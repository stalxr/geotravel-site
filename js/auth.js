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
  const ul = document.createElement('ul');
  list.forEach(id => {
    const li = document.createElement('li'); li.textContent = `Тур: ${id}`;
    ul.appendChild(li);
  });
  container.innerHTML = ''; container.appendChild(ul);
}


