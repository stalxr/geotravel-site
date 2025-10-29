// JavaScript для страницы галереи

document.addEventListener('DOMContentLoaded', function() {
    initGalleryPage();
});

function initGalleryPage() {
    initFilters();
    initViewToggle();
    initLightbox();
    initLoadMore();
}

// Данные галереи
const galleryData = [
    {
        src: '../images/gallery-1.jpg',
        title: 'Отель Delphin Imperial',
        description: 'Анталия, Турция',
        category: 'hotels'
    },
    {
        src: '../images/gallery-2.jpg',
        title: 'Пляж в Анталии',
        description: 'Турция',
        category: 'beaches'
    },
    {
        src: '../images/gallery-3.jpg',
        title: 'Стамбул',
        description: 'Турция',
        category: 'cities'
    },
    {
        src: '../images/gallery-4.jpg',
        title: 'Каппадокия',
        description: 'Турция',
        category: 'nature'
    },
    {
        src: '../images/gallery-5.jpg',
        title: 'Отель в Хургаде',
        description: 'Египет',
        category: 'hotels'
    },
    {
        src: '../images/gallery-6.jpg',
        title: 'Красное море',
        description: 'Египет',
        category: 'beaches'
    },
    {
        src: '../images/gallery-7.jpg',
        title: 'Каир',
        description: 'Египет',
        category: 'cities'
    },
    {
        src: '../images/gallery-8.jpg',
        title: 'Пирамиды Гизы',
        description: 'Египет',
        category: 'nature'
    },
    {
        src: '../images/gallery-9.jpg',
        title: 'Отель в Тайланде',
        description: 'Пхукет',
        category: 'hotels'
    },
    {
        src: '../images/gallery-10.jpg',
        title: 'Пляж в Тайланде',
        description: 'Пхукет',
        category: 'beaches'
    },
    {
        src: '../images/gallery-11.jpg',
        title: 'Тайская кухня',
        description: 'Тайланд',
        category: 'food'
    },
    {
        src: '../images/gallery-12.jpg',
        title: 'Джунгли Тайланда',
        description: 'Тайланд',
        category: 'nature'
    }
];

let currentImageIndex = 0;
let currentFilter = 'all';
let currentView = 'grid';

// Инициализация фильтров
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Убираем активный класс со всех вкладок
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс к текущей вкладке
            this.classList.add('active');
            
            // Фильтруем галерею
            filterGallery(filter, galleryItems);
            currentFilter = filter;
        });
    });
}

// Фильтрация галереи
function filterGallery(filter, galleryItems) {
    galleryItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            item.style.display = 'block';
        } else {
            item.classList.add('hidden');
            item.style.display = 'none';
        }
    });
}

// Инициализация переключения вида
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const galleryGrid = document.getElementById('galleryGrid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Убираем активный класс со всех кнопок
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
            
            // Переключаем вид
            toggleView(view, galleryGrid);
            currentView = view;
        });
    });
}

// Переключение вида
function toggleView(view, galleryGrid) {
    if (view === 'list') {
        galleryGrid.classList.add('list-view');
    } else {
        galleryGrid.classList.remove('list-view');
    }
}

// Инициализация лайтбокса
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    // Закрытие по клику на overlay
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Открыть лайтбокс
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    currentImageIndex = index;
    const imageData = galleryData[index];
    
    lightboxImage.src = imageData.src;
    lightboxImage.alt = imageData.title;
    lightboxTitle.textContent = imageData.title;
    lightboxDescription.textContent = imageData.description;
    lightboxCounter.textContent = `${index + 1} из ${galleryData.length}`;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрыть лайтбокс
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Предыдущее изображение
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
    openLightbox(currentImageIndex);
}

// Следующее изображение
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
    openLightbox(currentImageIndex);
}

// Инициализация кнопки "Загрузить еще"
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreImages();
        });
    }
}

// Загрузить больше изображений
function loadMoreImages() {
    // В реальном приложении здесь будет AJAX запрос
    // Пока что просто показываем сообщение
    travelAgency.showNotification('Все изображения загружены', 'info');
}

// Анимация появления элементов при прокрутке
function initScrollAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    galleryItems.forEach(item => {
        observer.observe(item);
    });
}

// Инициализация анимаций при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

// Функция для добавления нового изображения в галерею
function addGalleryImage(imageData) {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.category = imageData.category;
    
    galleryItem.innerHTML = `
        <div class="gallery-image">
            <img src="${imageData.src}" alt="${imageData.title}">
            <div class="gallery-overlay">
                <button class="gallery-btn" onclick="openLightbox(${galleryData.length})">
                    <i class="icon-zoom"></i>
                </button>
            </div>
        </div>
        <div class="gallery-info">
            <h3>${imageData.title}</h3>
            <p>${imageData.description}</p>
        </div>
    `;
    
    galleryGrid.appendChild(galleryItem);
    galleryData.push(imageData);
    
    // Анимация появления
    setTimeout(() => {
        galleryItem.classList.add('animate-in');
    }, 100);
}

// Экспорт функций для использования в других файлах
window.Gallery = {
    openLightbox: openLightbox,
    closeLightbox: closeLightbox,
    addGalleryImage: addGalleryImage
};




