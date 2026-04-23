import { products } from '../data/products.js';
import { cart } from '../store/cart.js';
import { router } from '../router.js';
import { renderStars } from '../utils/stars.js';

export function renderProduct({ id }) {
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    const notFound = document.createElement('div');
    notFound.className = 'not-found container';
    notFound.innerHTML = `
      <h2>Product not found</h2>
      <button class="btn btn--primary" data-link href="/">Back to Catalog</button>
    `;
    return notFound;
  }

  const page = document.createElement('div');
  page.className = 'product-page';

  let currentSlide = 0;
  let quantity = 1;

  function isInCart() {
    return cart.hasProduct(product.id);
  }

  function renderPage() {
    page.innerHTML = `
      <div class="container">
        <nav class="breadcrumb">
          <a href="/" data-link class="breadcrumb__link">Products</a>
          <span class="breadcrumb__sep">›</span>
          <span class="breadcrumb__current">${product.name}</span>
        </nav>

        <div class="product-detail">
          <!-- Gallery -->
          <div class="product-gallery">
            <div class="product-gallery__main">
              <button class="product-gallery__arrow product-gallery__arrow--prev" id="prev-slide" aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <img
                src="${product.images[currentSlide]}"
                alt="${product.name}"
                class="product-gallery__img"
                id="main-img"
              />
              <button class="product-gallery__arrow product-gallery__arrow--next" id="next-slide" aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <div class="product-gallery__dots" id="gallery-dots">
                ${product.images.map((_, i) => `<button class="product-gallery__dot ${i === currentSlide ? 'active' : ''}" data-dot="${i}"></button>`).join('')}
              </div>
            </div>
            <div class="product-gallery__thumbs" id="gallery-thumbs">
              ${product.images
                .map(
                  (img, i) => `
                <button class="product-gallery__thumb ${i === currentSlide ? 'active' : ''}" data-thumb="${i}">
                  <img src="${img}" alt="Thumbnail ${i + 1}" />
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Info -->
          <div class="product-info">
            <span class="product-info__badge">${product.subtitle}</span>
            <h1 class="product-info__name">${product.name}</h1>

            <div class="product-info__rating">
              ${renderStars(product.rating)}
              <span class="product-info__rating-val">(${product.rating})</span>
              <span class="product-info__reviews">Based on ${product.reviewsCount} reviews</span>
            </div>

            <div class="product-info__price-row">
              <span class="product-info__price">$${product.price.toFixed(2)}</span>
              <span class="product-info__shipping">${product.shipping}</span>
            </div>

            <div class="product-info__highlights">
              <h4>Key Highlights</h4>
              <ul>
                ${product.highlights.map((h) => `<li>${h}</li>`).join('')}
              </ul>
            </div>

            <div class="product-info__desc">
              <h4>Description</h4>
              <p>${product.description}</p>
            </div>

            <div class="product-info__qty-row">
              <span class="product-info__qty-label">Quantity</span>
              <div class="qty-control">
                <button class="qty-control__btn" id="qty-dec" aria-label="Decrease">−</button>
                <span class="qty-control__val" id="qty-val">${quantity}</span>
                <button class="qty-control__btn" id="qty-inc" aria-label="Increase">+</button>
              </div>
            </div>

            <button class="btn btn--primary btn--lg product-info__add-btn ${isInCart() ? 'btn--added' : ''}" id="add-to-cart-btn">
              ${isInCart() ? '✓ Added to Cart' : 'Add to Cart'}
            </button>

            <!-- Accordion: Technical Specifications -->
            <div class="accordion" id="specs-accordion">
              <button class="accordion__trigger" aria-expanded="false">
                <span>Technical Specifications</span>
                <svg class="accordion__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div class="accordion__body">
                <table class="specs-table">
                  ${Object.entries(product.specs)
                    .map(
                      ([key, val]) => `
                    <tr>
                      <td class="specs-table__key">${key}</td>
                      <td class="specs-table__val">${val}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <section class="related-products">
          <h2 class="related-products__title">Related Products</h2>
          <div class="related-products__grid" id="related-grid"></div>
        </section>
      </div>
    `;

    // Gallery navigation
    const mainImg = page.querySelector('#main-img');
    const dots = page.querySelectorAll('[data-dot]');
    const thumbs = page.querySelectorAll('[data-thumb]');

    function goToSlide(index) {
      currentSlide = (index + product.images.length) % product.images.length;
      mainImg.src = product.images[currentSlide];
      mainImg.classList.add('fade');
      setTimeout(() => mainImg.classList.remove('fade'), 300);

      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
      thumbs.forEach((t, i) => t.classList.toggle('active', i === currentSlide));
    }

    page.querySelector('#prev-slide').addEventListener('click', () => goToSlide(currentSlide - 1));
    page.querySelector('#next-slide').addEventListener('click', () => goToSlide(currentSlide + 1));
    dots.forEach((d) => d.addEventListener('click', () => goToSlide(parseInt(d.dataset.dot))));
    thumbs.forEach((t) => t.addEventListener('click', () => goToSlide(parseInt(t.dataset.thumb))));

    // Touch swipe support
    let touchStartX = 0;
    mainImg.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    mainImg.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    });

    // Quantity
    page.querySelector('#qty-dec').addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        page.querySelector('#qty-val').textContent = quantity;
      }
    });
    page.querySelector('#qty-inc').addEventListener('click', () => {
      quantity++;
      page.querySelector('#qty-val').textContent = quantity;
    });

    // Add to cart
    const addBtn = page.querySelector('#add-to-cart-btn');
    addBtn.addEventListener('click', () => {
      if (!isInCart()) {
        for (let i = 0; i < quantity; i++) {
          cart.addItem(product);
        }
        addBtn.textContent = '✓ Added to Cart';
        addBtn.classList.add('btn--added');
        addBtn.classList.remove('btn--primary');
      } else {
        router.navigate('/cart');
      }
    });

    // Accordion
    const accordion = page.querySelector('.accordion');
    const trigger = accordion.querySelector('.accordion__trigger');
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      accordion.classList.toggle('open', !expanded);
    });

    // Related products
    const related = products.filter((p) => p.id !== product.id && p.subtitle === product.subtitle).slice(0, 3);
    const fallback = products.filter((p) => p.id !== product.id).slice(0, 3);
    const relatedList = related.length > 0 ? related : fallback;

    const relatedGrid = page.querySelector('#related-grid');
    relatedGrid.innerHTML = relatedList
      .map(
        (p) => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-card__img-wrap">
          <img src="${p.images[0]}" alt="${p.name}" class="product-card__img" loading="lazy" />
          <span class="product-card__badge">${p.subtitle}</span>
        </div>
        <div class="product-card__body">
          <div class="product-card__rating">
            ${renderStars(p.rating)}
            <span class="product-card__rating-val">(${p.rating})</span>
          </div>
          <h3 class="product-card__name">${p.name}</h3>
          <div class="product-card__footer">
            <span class="product-card__price">$${p.price.toFixed(2)}</span>
            <button class="btn product-card__btn ${cart.hasProduct(p.id) ? 'btn--added' : 'btn--primary'}" data-add="${p.id}">
              ${cart.hasProduct(p.id) ? 'In Cart ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </article>
    `
      )
      .join('');

    relatedGrid.querySelectorAll('.product-card').forEach((card) => {
      const cid = card.dataset.id;
      card.querySelector('.product-card__img-wrap').addEventListener('click', () => router.navigate(`/product/${cid}`));
      card.querySelector('.product-card__name').addEventListener('click', () => router.navigate(`/product/${cid}`));
    });

    relatedGrid.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = parseInt(btn.dataset.add);
        const p = products.find((x) => x.id === pid);
        if (p && !cart.hasProduct(pid)) {
          cart.addItem(p);
          btn.textContent = 'In Cart ✓';
          btn.classList.remove('btn--primary');
          btn.classList.add('btn--added');
        }
      });
    });
  }

  cart.subscribe(() => {
    const addBtn = page.querySelector('#add-to-cart-btn');
    if (addBtn) {
      if (isInCart()) {
        addBtn.textContent = '✓ Added to Cart';
        addBtn.classList.add('btn--added');
        addBtn.classList.remove('btn--primary');
      }
    }
  });

  renderPage();
  return page;
}
