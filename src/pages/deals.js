import { products } from '../data/products.js';
import { cart } from '../store/cart.js';
import { router } from '../router.js';
import { renderStars } from '../utils/stars.js';
import { toast } from '../utils/toast.js';

// Товары на акции (первые 4, скидка 20%)
const DEAL_PRODUCT_IDS = [1, 2, 3, 4];
const DEAL_DISCOUNT = 20; // процент скидки
const DEAL_ENDS_DAYS = 4; // через сколько дней заканчивается

export function renderDeals() {
  const page = document.createElement('div');
  page.className = 'deals-page';

  const dealProducts = products.filter((p) => DEAL_PRODUCT_IDS.includes(p.id));

  // Таймер обратного отсчёта
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + DEAL_ENDS_DAYS);

  page.innerHTML = `
    <section class="deals-hero">
      <div class="container deals-hero__inner">
        <div class="deals-hero__text">
          <span class="deals-hero__label">🔥 Горячие предложения</span>
          <h1 class="deals-hero__title">Специальные акции</h1>
          <p class="deals-hero__subtitle">Ограниченные предложения на лучшие товары — не упустите!</p>
        </div>
        <div class="deals-hero__badge">
          <span class="deals-hero__badge-pct">до ${DEAL_DISCOUNT}%</span>
          <span class="deals-hero__badge-text">скидка</span>
        </div>
      </div>
    </section>

    <div class="container deals-body">

      <!-- Блок Flash Sale -->
      <section class="flash-sale">
        <div class="flash-sale__header">
          <div class="flash-sale__title-wrap">
            <h2 class="flash-sale__title">⚡ Flash Sale</h2>
            <p class="flash-sale__subtitle">Скидка до ${DEAL_DISCOUNT}% на избранные товары</p>
          </div>
          <div class="flash-sale__timer">
            <span class="flash-sale__timer-label">Заканчивается через</span>
            <div class="flash-sale__countdown" id="countdown">
              <div class="countdown-block">
                <span class="countdown-val" id="cd-days">02</span>
                <span class="countdown-unit">дн</span>
              </div>
              <span class="countdown-sep">:</span>
              <div class="countdown-block">
                <span class="countdown-val" id="cd-hours">00</span>
                <span class="countdown-unit">ч</span>
              </div>
              <span class="countdown-sep">:</span>
              <div class="countdown-block">
                <span class="countdown-val" id="cd-mins">00</span>
                <span class="countdown-unit">мин</span>
              </div>
              <span class="countdown-sep">:</span>
              <div class="countdown-block">
                <span class="countdown-val" id="cd-secs">00</span>
                <span class="countdown-unit">сек</span>
              </div>
            </div>
          </div>
        </div>

        <div class="deals-grid" id="deals-grid">
          ${dealProducts
            .map((p) => {
              const salePrice = (p.price * (1 - DEAL_DISCOUNT / 100)).toFixed(2);
              return `
              <article class="deal-card" data-id="${p.id}">
                <div class="deal-card__img-wrap">
                  <img src="${p.images[0]}" alt="${p.name}" class="deal-card__img" loading="lazy" />
                  <span class="deal-card__discount-badge">Скидка ${DEAL_DISCOUNT}%</span>
                </div>
                <div class="deal-card__body">
                  <span class="deal-card__category">${p.subtitle}</span>
                  <div class="deal-card__rating">${renderStars(p.rating)}</div>
                  <h3 class="deal-card__name">${p.name}</h3>
                  <div class="deal-card__prices">
                    <span class="deal-card__sale-price">$${salePrice}</span>
                    <span class="deal-card__old-price">$${p.price.toFixed(2)}</span>
                  </div>
                  <div class="deal-card__footer">
                    <button class="btn ${cart.hasProduct(p.id) ? 'btn--added' : 'btn--primary'} deal-card__btn" data-add="${p.id}">
                      ${cart.hasProduct(p.id) ? 'В корзине ✓' : 'В корзину'}
                    </button>
                    <button class="btn btn--outline deal-card__view" data-view="${p.id}">Подробнее</button>
                  </div>
                </div>
              </article>
            `;
            })
            .join('')}
        </div>
      </section>

      <!-- Кнопка перехода в каталог -->
      <div class="deals-more">
        <p class="deals-more__text">Хотите увидеть больше товаров?</p>
        <a href="/" data-link class="btn btn--primary btn--lg">Смотреть все товары</a>
      </div>
    </div>
  `;

  // Кнопки «В корзину»
  page.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.add);
      const product = products.find((p) => p.id === id);
      if (product && !cart.hasProduct(id)) {
        cart.addItem(product);
        btn.textContent = 'В корзине ✓';
        btn.classList.remove('btn--primary');
        btn.classList.add('btn--added');
        toast(`"${product.name}" добавлен в корзину`);
      }
    });
  });

  // Кнопки «Подробнее»
  page.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      router.navigate(`/product/${btn.dataset.view}`);
    });
  });

  // Таймер обратного отсчёта
  function updateCountdown() {
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) return;

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const dEl = page.querySelector('#cd-days');
    const hEl = page.querySelector('#cd-hours');
    const mEl = page.querySelector('#cd-mins');
    const sEl = page.querySelector('#cd-secs');

    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(mins);
    if (sEl) sEl.textContent = pad(secs);
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);

  // Останавливаем таймер при уходе со страницы
  const observer = new MutationObserver(() => {
    if (!document.contains(page)) {
      clearInterval(timer);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return page;
}
