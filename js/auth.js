// Simple auth with localStorage and header state
document.addEventListener('DOMContentLoaded', function() {
  try { initAuthHeader(); } catch (_) {}
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e){
      e.preventDefault();
      const login = (document.getElementById('regLogin')?.value || '').trim();
      const pass = (document.getElementById('regPassword')?.value || '').trim();
      if (!login || !pass) { try { travelAgency.showNotification('Заполните логин и пароль', 'info'); } catch(_){} return; }
      const exists = localStorage.getItem(`gt_user_${login}`);
      if (exists) { try { travelAgency.showNotification('Пользователь уже существует', 'info'); } catch(_){} return; }
      localStorage.setItem(`gt_user_${login}`, JSON.stringify({login, pass}));
      localStorage.setItem('gt_current_user', login);
      try { travelAgency.showNotification('Вы успешно зарегистрировались!', 'success'); } catch(_){}
      setTimeout(()=> { window.location.href = 'account.html'; }, 600);
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const login = (document.getElementById('login')?.value || '').trim();
      const pass = (document.getElementById('password')?.value || '').trim();
      const raw = localStorage.getItem(`gt_user_${login}`);
      if (!raw) { try { travelAgency.showNotification('Пользователь не найден', 'info'); } catch(_){} return; }
      const user = JSON.parse(raw);
      if (user.pass !== pass) { try { travelAgency.showNotification('Неверный пароль', 'info'); } catch(_){} return; }
      localStorage.setItem('gt_current_user', login);
      try { travelAgency.showNotification('Вы успешно вошли!', 'success'); } catch(_){}
      setTimeout(()=> { window.location.href = 'account.html'; }, 400);
    });
  }

  const favoritesContainer = document.getElementById('favoritesList');
  if (favoritesContainer) {
    renderFavoritesList(favoritesContainer);
  }

  // Profile modal handlers
  const openBtn = document.getElementById('openProfileBtn');
  const modal = document.getElementById('profileModal');
  const closeBtn = document.getElementById('closeProfileBtn');
  const clearBtn = document.getElementById('clearProfileBtn');
  const form = document.getElementById('profileForm');
  if (openBtn && modal) {
    openBtn.addEventListener('click', function(){
      modal.style.display = 'block';
      loadProfileIntoForm();
    });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', function(){ modal.style.display = 'none'; });
    modal.addEventListener('click', function(e){ if (e.target === modal) modal.style.display = 'none'; });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function(){
      const user = localStorage.getItem('gt_current_user');
      if (!user) return;
      localStorage.removeItem(`gt_profile_${user}`);
      try { travelAgency.showNotification('Профиль очищен', 'info'); } catch(_){}
      loadProfileIntoForm();
    });
  }
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const user = localStorage.getItem('gt_current_user');
      if (!user) return;
      const profile = {
        lastName: document.getElementById('pLastName')?.value || '',
        firstName: document.getElementById('pFirstName')?.value || '',
        middleName: document.getElementById('pMiddleName')?.value || '',
        birthDate: document.getElementById('pBirthDate')?.value || '',
        passport: document.getElementById('pPassport')?.value || '',
        phone: document.getElementById('pPhone')?.value || '',
        email: document.getElementById('pEmail')?.value || ''
      };
      localStorage.setItem(`gt_profile_${user}`, JSON.stringify(profile));
      try { travelAgency.showNotification('Профиль сохранён. Автозаполнение включено.', 'success'); } catch(_){}
      modal.style.display = 'none';
    });
  }
});

function initAuthHeader() {
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  const base = isInPagesFolder ? '../pages/' : 'pages/';
  const header = document.getElementById('header');
  if (!header) return;
  const user = localStorage.getItem('gt_current_user');
  const actions = header.querySelector('.header-actions');
  if (!actions) return;
  actions.innerHTML = '';
  if (user) {
    const acc = document.createElement('a'); acc.className='btn btn-outline'; acc.href= base + 'account.html'; acc.textContent='Личный кабинет';
    const logout = document.createElement('a'); logout.className='btn'; logout.href='#'; logout.textContent='Выйти';
    logout.addEventListener('click', function(e){ e.preventDefault(); localStorage.removeItem('gt_current_user'); window.location.reload(); });
    actions.appendChild(acc); actions.appendChild(logout);
  } else {
    const login = document.createElement('a'); login.className='btn btn-primary'; login.href= base + 'login.html'; login.textContent='Войти';
    const reg = document.createElement('a'); reg.className='btn btn-outline'; reg.href= base + 'register.html'; reg.textContent='Регистрация';
    actions.appendChild(login); actions.appendChild(reg);
  }
}

function renderFavoritesList(container) {
  const user = localStorage.getItem('gt_current_user');
  if (!user) { container.innerHTML = '<p>Войдите, чтобы увидеть избранное.</p>'; return; }
  const raw = localStorage.getItem(`gt_favorites_${user}`);
  const list = raw ? JSON.parse(raw) : [];
  if (!list.length) { container.innerHTML = '<p>Избранных туров пока нет.</p>'; return; }

  const catalog = getTourCatalog();
  container.innerHTML = '';
  list.forEach(id => {
    const data = catalog[id];
    if (!data) return;
    const card = document.createElement('div');
    card.className = 'tour-card card';
    card.setAttribute('data-id', id);
    card.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="card-img">
      <div class="card-content">
        <div class="tour-badge">${data.badge}</div>
        <h3 class="card-title">${data.title}</h3>
        <p class="card-text">${data.description || ''}</p>
        <div class="card-price">от ${data.price}</div>
        <div class="card-actions">
          <a href="tour-details.html?id=${id}" class="btn">Подробнее</a>
          <a href="booking.html?title=${encodeURIComponent(data.title)}&price=${encodeURIComponent(data.price.replace(/[^0-9]/g,''))}&image=${encodeURIComponent(data.image)}&category=${encodeURIComponent(data.badge)}&adults=2&children=0" class="btn">Забронировать</a>
          <a href="#" class="favorite-btn favorited" data-remove="true"><i class="icon-heart-filled"></i> В избранном</a>
        </div>
      </div>
    `;
    const removeBtn = card.querySelector('[data-remove="true"]');
    removeBtn.addEventListener('click', function(e){
      e.preventDefault();
      const cur = JSON.parse(localStorage.getItem(`gt_favorites_${user}`) || '[]');
      const idx = cur.indexOf(id);
      if (idx >= 0) cur.splice(idx,1);
      localStorage.setItem(`gt_favorites_${user}`, JSON.stringify(cur));
      renderFavoritesList(container);
    });
    container.appendChild(card);
  });
}

function getTourCatalog() {
  return {
    '1': { title: 'Анталия, Турция - 7 ночей', badge: 'Пляжный отдых', price: '35 000 ₽', image: 'https://getmecar.ru/wp-content/uploads/2024/02/11-e1651558649220.jpg', description: '7 ночей, все включено, 5★ отель' },
    '2': { title: 'Хургада, Египет - 10 ночей', badge: 'Пляжный отдых', price: '42 000 ₽', image: 'https://avatars.mds.yandex.net/i?id=aba51126b020fb3731fecf9fbe56b3fd_l-8168927-images-thumbs&n=13', description: '10 ночей, все включено, 4★ отель' },
    '3': { title: 'Европа: 5 столиц - 10 дней', badge: 'Экскурсионный', price: '55 000 ₽', image: 'https://sun9-40.userapi.com/c604525/v604525628/5a3fa/DFi66xcuVuc.jpg', description: '10 дней, 5 стран, завтраки' },
    '4': { title: 'Стамбул - город контрастов', badge: 'Экскурсионный', price: '28 000 ₽', image: 'https://inbusiness.kz/uploads/2025-6/v02IfVym.jpg', description: '5 дней, экскурсии включены' },
    '5': { title: 'Тайланд: острова и джунгли - 12 дней', badge: 'Приключенческий', price: '65 000 ₽', image: 'https://sun9-85.userapi.com/impf/xGC0HdQyAGxHYmSn37kEBzItLPYfUbN3-uEueA/0I2a3RP_CQM.jpg?size=1920x768&quality=95&crop=0,60,1220,487&sign=e8c48d3696f4621ad6049632cf00851c&type=cover_group', description: '12 дней, активный отдых' },
    '6': { title: 'ОАЭ: пустыня и небоскребы - 8 дней', badge: 'Приключенческий', price: '48 000 ₽', image: 'https://cdn.fishki.net/upload/post/201401/27/1240358/394645.jpg', description: '8 дней, сафари и шопинг' },
    '7': { title: 'Карловы Вары, Чехия - 10 дней', badge: 'Лечебно-оздоровительный', price: '75 000 ₽', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Karlovy_Vary_Czech.jpg', description: 'Лечение, процедуры, экскурсии' },
    '8': { title: 'Мертвое море, Израиль - 7 дней', badge: 'Лечебно-оздоровительный', price: '58 000 ₽', image: 'https://avatars.mds.yandex.net/i?id=c51ac7a529be4887f5820b121edb11c9_l-4283547-images-thumbs&n=13', description: '7 дней, спа-процедуры' }
  };
}

function loadProfileIntoForm() {
  const user = localStorage.getItem('gt_current_user');
  if (!user) return;
  const raw = localStorage.getItem(`gt_profile_${user}`);
  if (!raw) {
    ['pLastName','pFirstName','pMiddleName','pBirthDate','pPassport','pPhone','pEmail'].forEach(id=>{
      const el = document.getElementById(id); if (el) el.value = '';
    });
    return;
  }
  const p = JSON.parse(raw);
  const map = {
    pLastName: p.lastName,
    pFirstName: p.firstName,
    pMiddleName: p.middleName,
    pBirthDate: p.birthDate,
    pPassport: p.passport,
    pPhone: p.phone,
    pEmail: p.email
  };
  Object.keys(map).forEach(id=>{ const el = document.getElementById(id); if (el) el.value = map[id] || ''; });
}


