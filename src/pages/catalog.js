import { products } from '../data/products.js';
import { cart } from '../store/cart.js';
import { router } from '../router.js';
import { renderStars } from '../utils/stars.js';
import { toast } from '../utils/toast.js';

export function renderCatalog() {
  const page = document.createElement('div');
  page.className = 'catalog-page';

  let filtered = [...products];
  let sortValue = 'name-asc';
  let minPrice = 0;
  let maxPrice = 9999;
  let minRating = 0;

  const maxProductPrice = Math.max(...products.map((p) => p.price));

  page.innerHTML = `
    <section class="catalog-hero">
      <div class="container">
        <h1 class="catalog-hero__title">Premium Electronics</h1>
        <p class="catalog-hero__subtitle">Discover our curated collection of high-quality tech products</p>
      </div>
    </section>

    <div class="catalog-body container">
      <aside class="catalog-filters" id="filters-panel">
        <div class="catalog-filters__header">
          <h3>Filters</h3>
          <button class="catalog-filters__reset" id="reset-filters">Reset</button>
        </div>

        <div class="catalog-filters__group">
          <label class="catalog-filters__label">Price Range</label>
          <div class="catalog-filters__price-inputs">
            <div class="catalog-filters__price-field">
              <span>Min</span>
              <input type="number" id="price-min" class="catalog-filters__input" value="0" min="0" max="${maxProductPrice}" />
            </div>
            <div class="catalog-filters__price-sep">—</div>
            <div class="catalog-filters__price-field">
              <span>Max</span>
              <input type="number" id="price-max" class="catalog-filters__input" value="${maxProductPrice}" min="0" max="${maxProductPrice}" />
            </div>
          </div>
          <div class="catalog-filters__range-wrap">
            <div class="price-slider" id="price-slider">
              <div class="price-slider__track">
                <div class="price-slider__fill" id="slider-fill"></div>
              </div>
              <div class="price-slider__thumb price-slider__thumb--min" id="thumb-min" tabindex="0" role="slider" aria-label="Minimum price"></div>
              <div class="price-slider__thumb price-slider__thumb--max" id="thumb-max" tabindex="0" role="slider" aria-label="Maximum price"></div>
            </div>
          </div>
        </div>

        <div class="catalog-filters__group">
          <label class="catalog-filters__label">Minimum Rating</label>
          <div class="catalog-filters__rating-options" id="rating-options">
            ${[1, 2, 3, 4, 5]
              .map(
                (r) => `
              <label class="catalog-filters__rating-opt">
                <input type="radio" name="rating" value="${r}" ${r === 0 ? 'checked' : ''} />
                <span class="catalog-filters__rating-stars">${renderStars(r)}</span>
                <span class="catalog-filters__rating-label">&amp; up</span>
              </label>
            `
              )
              .join('')}
          </div>
        </div>
      </aside>

      <main class="catalog-main">
        <div class="catalog-toolbar">
          <p class="catalog-count" id="catalog-count">${products.length} products</p>
          <div class="catalog-sort">
            <label for="sort-select" class="catalog-sort__label">Sort by:</label>
            <select id="sort-select" class="catalog-sort__select">
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div class="catalog-grid" id="catalog-grid"></div>
      </main>
    </div>
  `;

  function applyFiltersAndSort() {
    filtered = products.filter((p) => {
      return p.price >= minPrice && p.price <= maxPrice && p.rating >= minRating;
    });

    filtered.sort((a, b) => {
      switch (sortValue) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    renderGrid();
  }

  function renderGrid() {
    const grid = page.querySelector('#catalog-grid');
    const count = page.querySelector('#catalog-count');
    count.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="catalog-empty">
          <p>No products match your filters.</p>
          <button class="btn btn--outline" id="clear-filters-btn">Clear Filters</button>
        </div>
      `;
      grid.querySelector('#clear-filters-btn')?.addEventListener('click', resetFilters);
      return;
    }

    grid.innerHTML = filtered
      .map(
        (p, i) => `
      <article class="product-card" data-id="${p.id}" style="animation-delay:${i * 60}ms">
        <div class="product-card__img-wrap">
          <img src="${p.images[0]}" alt="${p.name}" class="product-card__img" loading="lazy" />
          <span class="product-card__badge">${p.subtitle}</span>
          ${p.oldPrice ? `<span class="product-card__sale-badge">SALE</span>` : ''}
        </div>
        <div class="product-card__body">
          <div class="product-card__rating">
            ${renderStars(p.rating)}
            <span class="product-card__rating-val">(${p.rating})</span>
          </div>
          <h3 class="product-card__name">${p.name}</h3>
          <div class="product-card__footer">
            <div class="product-card__prices">
              <span class="product-card__price">$${p.price.toFixed(2)}</span>
              ${p.oldPrice ? `<span class="product-card__old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
              ${p.oldPrice ? `<span class="product-card__discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
            </div>
            <button class="btn product-card__btn ${cart.hasProduct(p.id) ? 'btn--added' : 'btn--primary'}" data-add="${p.id}">
              ${cart.hasProduct(p.id) ? 'In Cart ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </article>
    `
      )
      .join('');

    // Card click → product page
    grid.querySelectorAll('.product-card').forEach((card) => {
      const id = card.dataset.id;
      card.querySelector('.product-card__img-wrap').addEventListener('click', () => {
        router.navigate(`/product/${id}`);
      });
      card.querySelector('.product-card__name').addEventListener('click', () => {
        router.navigate(`/product/${id}`);
      });
    });

    // Add to cart buttons
    grid.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.add);
        const product = products.find((p) => p.id === id);
        if (product && !cart.hasProduct(id)) {
          cart.addItem(product);
          btn.textContent = 'In Cart ✓';
          btn.classList.remove('btn--primary');
          btn.classList.add('btn--added');
          toast(`"${product.name}" added to cart`);
        }
      });
    });
  }

  function resetFilters() {
    minPrice = 0;
    maxPrice = maxProductPrice;
    minRating = 0;
    page.querySelector('#price-min').value = 0;
    page.querySelector('#price-max').value = maxProductPrice;
    updateSliderUI();
    const radios = page.querySelectorAll('input[name="rating"]');
    radios.forEach((r) => (r.checked = false));
    applyFiltersAndSort();
  }

  // Sort
  page.querySelector('#sort-select').addEventListener('change', (e) => {
    sortValue = e.target.value;
    applyFiltersAndSort();
  });

  // Price number inputs
  page.querySelector('#price-min').addEventListener('input', (e) => {
    minPrice = Math.min(parseFloat(e.target.value) || 0, maxPrice - 10);
    updateSliderUI();
    applyFiltersAndSort();
  });

  page.querySelector('#price-max').addEventListener('input', (e) => {
    maxPrice = Math.max(parseFloat(e.target.value) || maxProductPrice, minPrice + 10);
    updateSliderUI();
    applyFiltersAndSort();
  });

  // ── Кастомный двойной слайдер ──────────────────────────────────────────────
  function updateSliderUI() {
    const slider   = page.querySelector('#price-slider');
    const thumbMin = page.querySelector('#thumb-min');
    const thumbMax = page.querySelector('#thumb-max');
    const fill     = page.querySelector('#slider-fill');
    if (!slider) return;

    // Ограничиваем проценты чтобы ползунки не вылезали за края
    const pctMin = Math.max(0, Math.min((minPrice / maxProductPrice) * 100, 100));
    const pctMax = Math.max(0, Math.min((maxPrice / maxProductPrice) * 100, 100));

    thumbMin.style.left = `${pctMin}%`;
    thumbMax.style.left = `${pctMax}%`;
    fill.style.left     = `${pctMin}%`;
    fill.style.width    = `${pctMax - pctMin}%`;
  }

  function initSlider() {
    const slider   = page.querySelector('#price-slider');
    const thumbMin = page.querySelector('#thumb-min');
    const thumbMax = page.querySelector('#thumb-max');

    function getPercent(clientX) {
      const rect = slider.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    }

    function dragThumb(thumb, onMove) {
      function onMouseMove(e) {
        onMove(e.clientX);
      }
      function onTouchMove(e) {
        onMove(e.touches[0].clientX);
      }
      function stop() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', stop);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', stop);
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', stop);
      document.addEventListener('touchmove', onTouchMove, { passive: true });
      document.addEventListener('touchend', stop);
    }

    thumbMin.addEventListener('mousedown', (e) => {
      e.preventDefault();
      dragThumb(thumbMin, (clientX) => {
        const pct = getPercent(clientX);
        const val = Math.round((pct * maxProductPrice) / 10) * 10;
        minPrice = Math.max(0, Math.min(val, maxPrice - 10));
        page.querySelector('#price-min').value = minPrice;
        updateSliderUI();
        applyFiltersAndSort();
      });
    });

    thumbMin.addEventListener('touchstart', (e) => {
      dragThumb(thumbMin, (clientX) => {
        const pct = getPercent(clientX);
        const val = Math.round((pct * maxProductPrice) / 10) * 10;
        minPrice = Math.max(0, Math.min(val, maxPrice - 10));
        page.querySelector('#price-min').value = minPrice;
        updateSliderUI();
        applyFiltersAndSort();
      });
    }, { passive: true });

    thumbMax.addEventListener('mousedown', (e) => {
      e.preventDefault();
      dragThumb(thumbMax, (clientX) => {
        const pct = getPercent(clientX);
        const val = Math.round((pct * maxProductPrice) / 10) * 10;
        maxPrice = Math.max(minPrice + 10, Math.min(val, maxProductPrice));
        page.querySelector('#price-max').value = maxPrice;
        updateSliderUI();
        applyFiltersAndSort();
      });
    });

    thumbMax.addEventListener('touchstart', (e) => {
      dragThumb(thumbMax, (clientX) => {
        const pct = getPercent(clientX);
        const val = Math.round((pct * maxProductPrice) / 10) * 10;
        maxPrice = Math.max(minPrice + 10, Math.min(val, maxProductPrice));
        page.querySelector('#price-max').value = maxPrice;
        updateSliderUI();
        applyFiltersAndSort();
      });
    }, { passive: true });

    updateSliderUI();
  }

  initSlider();

  // Пересчитать позиции ползунков после того как DOM отрисован
  requestAnimationFrame(() => updateSliderUI());
  // ──────────────────────────────────────────────────────────────────────────

  // Rating filter
  page.querySelector('#rating-options').addEventListener('change', (e) => {
    if (e.target.name === 'rating') {
      minRating = parseFloat(e.target.value);
      applyFiltersAndSort();
    }
  });

  // Reset
  page.querySelector('#reset-filters').addEventListener('click', resetFilters);

  // Re-render on cart change (to update button states)
  cart.subscribe(() => {
    renderGrid();
  });

  applyFiltersAndSort();

  return page;
}
