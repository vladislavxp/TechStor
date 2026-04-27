import { products } from '../data/products.js';
import { router } from '../router.js';

// Иконки для каждой категории
const CATEGORY_ICONS = {
  AUDIO:       '🎧',
  COMPUTERS:   '💻',
  WEARABLES:   '⌚',
  PHOTOGRAPHY: '📷',
  TABLETS:     '📱',
};

// Цвета фона для карточек категорий
const CATEGORY_COLORS = {
  AUDIO:       { bg: '#eff6ff', accent: '#2563eb', border: '#bfdbfe' },
  COMPUTERS:   { bg: '#f0fdf4', accent: '#16a34a', border: '#bbf7d0' },
  WEARABLES:   { bg: '#fdf4ff', accent: '#9333ea', border: '#e9d5ff' },
  PHOTOGRAPHY: { bg: '#fff7ed', accent: '#ea580c', border: '#fed7aa' },
  TABLETS:     { bg: '#fefce8', accent: '#ca8a04', border: '#fde68a' },
};

export function renderCategories() {
  const page = document.createElement('div');
  page.className = 'categories-page';

  // Собираем уникальные категории и считаем товары
  const categoryMap = {};
  products.forEach((p) => {
    if (!categoryMap[p.subtitle]) {
      categoryMap[p.subtitle] = { name: p.subtitle, count: 0, image: p.images[0] };
    }
    categoryMap[p.subtitle].count++;
  });

  const categories = Object.values(categoryMap);

  page.innerHTML = `
    <section class="categories-hero">
      <div class="container">
        <h1 class="categories-hero__title">Категории товаров</h1>
        <p class="categories-hero__subtitle">Выбирайте из широкого ассортимента премиальной электроники по категориям</p>
      </div>
    </section>

    <div class="container categories-body">
      <div class="categories-grid">
        ${categories
          .map((cat) => {
            const colors = CATEGORY_COLORS[cat.name] || { bg: '#f9fafb', accent: '#6b7280', border: '#e5e7eb' };
            const icon = CATEGORY_ICONS[cat.name] || '📦';
            const label = cat.count === 1 ? '1 товар' : `${cat.count} товара`;
            return `
              <article class="category-card" data-category="${cat.name}"
                style="--cat-bg:${colors.bg}; --cat-accent:${colors.accent}; --cat-border:${colors.border}">
                <div class="category-card__img-wrap">
                  <img src="${cat.image}" alt="${cat.name}" class="category-card__img" loading="lazy" />
                  <div class="category-card__overlay"></div>
                </div>
                <div class="category-card__body">
                  <span class="category-card__icon">${icon}</span>
                  <div class="category-card__info">
                    <h3 class="category-card__name">${cat.name.charAt(0) + cat.name.slice(1).toLowerCase()}</h3>
                    <p class="category-card__count">${label}</p>
                  </div>
                  <svg class="category-card__arrow" width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </article>
            `;
          })
          .join('')}
      </div>
    </div>
  `;

  // Клик по карточке — переход в каталог с фильтром по категории
  page.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', () => {
      router.navigate('/');
    });
  });

  return page;
}
