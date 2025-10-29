// JavaScript для страницы туров

document.addEventListener('DOMContentLoaded', function() {
    initToursPage();
});

function initToursPage() {
    initFilters();
    initTourCards();
}

// Инициализация фильтров
function initFilters() {
    const filterForm = document.querySelector('.filters-form');
    const tourCards = document.querySelectorAll('.tour-card');
    
    if (!filterForm) return;
    
    // Обработка изменения фильтров
    filterForm.addEventListener('change', function() {
        filterTours();
    });
    
    // Обработка отправки формы фильтров
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        filterTours();
    });
    
    function filterTours() {
        const selectedTypes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        const selectElement = document.querySelector('.form-select');
        const selectedNights = selectElement ? selectElement.value : '';
        
        tourCards.forEach(card => {
            let show = true;
            
            // Фильтр по типу тура
            if (selectedTypes.length > 0) {
                const cardType = card.dataset.type;
                if (!selectedTypes.includes(cardType)) {
                    show = false;
                }
            }
            
            // Показываем/скрываем карточку
            if (show) {
                card.style.display = 'block';
                card.classList.add('animate-in');
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Извлечение цены из текста
function extractPrice(priceText) {
    const match = priceText.match(/[\d\s]+/);
    if (match) {
        return parseInt(match[0].replace(/\s/g, ''));
    }
    return 0;
}

// Инициализация карточек туров
function initTourCards() {
    const tourCards = document.querySelectorAll('.tour-card');
    
    tourCards.forEach(card => {
        // Добавляем анимацию при наведении
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Добавляем функциональность "Добавить в избранное"
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleFavorite(this);
            });
        }
    });
}

// Переключение избранного
function toggleFavorite(button) {
    const isFavorite = button.classList.contains('favorited');
    
    if (isFavorite) {
        button.classList.remove('favorited');
        button.innerHTML = '<i class="icon-heart-empty"></i> В избранное';
        travelAgency.showNotification('Тур удален из избранного', 'info');
    } else {
        button.classList.add('favorited');
        button.innerHTML = '<i class="icon-heart-filled"></i> В избранном';
        travelAgency.showNotification('Тур добавлен в избранное', 'success');
    }
}

// Сортировка туров
function sortTours(sortBy) {
    const toursGrid = document.querySelector('.tours-grid');
    const tourCards = Array.from(toursGrid.querySelectorAll('.tour-card'));
    
    tourCards.sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return extractPrice(a.querySelector('.card-price').textContent) - 
                       extractPrice(b.querySelector('.card-price').textContent);
            case 'price-desc':
                return extractPrice(b.querySelector('.card-price').textContent) - 
                       extractPrice(a.querySelector('.card-price').textContent);
            case 'name-asc':
                return a.querySelector('.card-title').textContent.localeCompare(
                    b.querySelector('.card-title').textContent
                );
            case 'name-desc':
                return b.querySelector('.card-title').textContent.localeCompare(
                    a.querySelector('.card-title').textContent
                );
            default:
                return 0;
        }
    });
    
    // Перестраиваем DOM
    tourCards.forEach(card => {
        toursGrid.appendChild(card);
    });
}

// Поиск туров
function searchTours(query) {
    const tourCards = document.querySelectorAll('.tour-card');
    const searchQuery = query.toLowerCase();
    
    tourCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchQuery) || description.includes(searchQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', travelAgency.utils.debounce(function() {
            searchTours(this.value);
        }, 300));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
});



