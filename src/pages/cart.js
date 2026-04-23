import { cart } from '../store/cart.js';
import { router } from '../router.js';

/**
 * Available promo codes.
 * Key — code (uppercase), value — discount fraction (0.1 = 10%).
 */
const PROMO_CODES = {
  SAVE10:  0.1,   // 10% off
  TECH20:  0.2,   // 20% off
  WELCOME: 0.05,  // 5% welcome discount
};

export function renderCart() {
  const page = document.createElement('div');
  page.className = 'cart-page';

  let appliedPromo = null;
  let promoDiscount = 0;

  function render() {
    const items = cart.getItems();
    const subtotal = cart.getTotal();
    const discount = subtotal * promoDiscount;
    const total = subtotal - discount;

    if (items.length === 0) {
      page.innerHTML = `
        <div class="container">
          <h1 class="cart-page__title">Корзина</h1>
          <div class="cart-empty">
            <div class="cart-empty__icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h2 class="cart-empty__title">Your Cart is Empty</h2>
            <p class="cart-empty__desc">Add some amazing products to get started!</p>
            <button class="btn btn--primary btn--lg" id="continue-shopping">Continue Shopping</button>
          </div>
        </div>
      `;
      page.querySelector('#continue-shopping').addEventListener('click', () => router.navigate('/'));
      return;
    }

    page.innerHTML = `
      <div class="container">
        <h1 class="cart-page__title">Корзина <span class="cart-page__count">(${items.length} ${items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'})</span></h1>
        <div class="cart-layout">
          <!-- Items list -->
          <div class="cart-items" id="cart-items">
            ${items
              .map(
                (item) => `
              <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item__img-wrap">
                  <img src="${item.image}" alt="${item.name}" class="cart-item__img" />
                </div>
                <div class="cart-item__info">
                  <h3 class="cart-item__name">${item.name}</h3>
                  <p class="cart-item__subtitle">${item.subtitle}</p>
                  <p class="cart-item__price-mobile">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="cart-item__qty">
                  <button class="qty-control__btn" data-dec="${item.id}" aria-label="Decrease">−</button>
                  <span class="qty-control__val">${item.quantity}</span>
                  <button class="qty-control__btn" data-inc="${item.id}" aria-label="Increase">+</button>
                </div>
                <div class="cart-item__price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-item__remove" data-remove="${item.id}" aria-label="Remove item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Summary -->
          <aside class="cart-summary">
            <h2 class="cart-summary__title">Order Summary</h2>

            <div class="cart-summary__row">
              <span>Подытог</span>
              <span id="summary-subtotal">$${subtotal.toFixed(2)}</span>
            </div>

            ${
              appliedPromo
                ? `
              <div class="cart-summary__row cart-summary__row--discount">
                <span>Скидка (${appliedPromo})</span>
                <span id="summary-discount">−$${discount.toFixed(2)}</span>
              </div>
            `
                : ''
            }

            <div class="cart-summary__row">
              <span>Доставка</span>
              <span class="cart-summary__free">Бесплатно</span>
            </div>

            ${
              appliedPromo
                ? `<div class="cart-summary__row cart-summary__row--savings">
                    <span>Ваша экономия</span>
                    <span>$${discount.toFixed(2)}</span>
                   </div>`
                : ''
            }

            <div class="cart-summary__divider"></div>

            <div class="cart-summary__row cart-summary__row--total">
              <span>Итого</span>
              <span id="summary-total">$${total.toFixed(2)}</span>
            </div>

            <!-- Promo code -->
            <div class="cart-promo">
              <label class="cart-promo__label">Promo Code</label>
              <div class="cart-promo__row">
                <input
                  type="text"
                  id="promo-input"
                  class="cart-promo__input ${appliedPromo ? 'cart-promo__input--success' : ''}"
                  placeholder="Enter promo code"
                  value="${appliedPromo || ''}"
                  ${appliedPromo ? 'readonly' : ''}
                />
                <button class="btn ${appliedPromo ? 'btn--outline' : 'btn--primary'} cart-promo__btn" id="promo-btn">
                  ${appliedPromo ? 'Remove' : 'Apply'}
                </button>
              </div>
              <p class="cart-promo__msg" id="promo-msg"></p>
            </div>

            <button class="btn btn--primary btn--lg cart-summary__checkout">Оформить заказ</button>
            <button class="btn btn--outline cart-summary__continue" id="continue-btn">Продолжить покупки</button>
            <button class="btn cart-summary__clear" id="clear-cart-btn">🗑 Очистить корзину</button>
          </aside>
        </div>
      </div>
    `;

    // Quantity controls
    page.querySelectorAll('[data-dec]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.dec);
        const item = cart.getItems().find((i) => i.id === id);
        if (item) cart.updateQuantity(id, item.quantity - 1);
      });
    });

    page.querySelectorAll('[data-inc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.inc);
        const item = cart.getItems().find((i) => i.id === id);
        if (item) cart.updateQuantity(id, item.quantity + 1);
      });
    });

    // Remove
    page.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.remove);
        const item = page.querySelector(`.cart-item[data-item-id="${id}"]`);
        if (item) {
          item.classList.add('removing');
          setTimeout(() => cart.removeItem(id), 280);
        } else {
          cart.removeItem(id);
        }
      });
    });

    // Promo
    const promoBtn = page.querySelector('#promo-btn');
    const promoInput = page.querySelector('#promo-input');
    const promoMsg = page.querySelector('#promo-msg');

    promoBtn.addEventListener('click', () => {
      if (appliedPromo) {
        appliedPromo = null;
        promoDiscount = 0;
        render();
        return;
      }

      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        promoMsg.textContent = 'Please enter a promo code.';
        promoMsg.className = 'cart-promo__msg cart-promo__msg--error';
        return;
      }

      if (PROMO_CODES[code] !== undefined) {
        appliedPromo = code;
        promoDiscount = PROMO_CODES[code];
        promoMsg.textContent = `✓ Promo applied! ${promoDiscount * 100}% discount.`;
        promoMsg.className = 'cart-promo__msg cart-promo__msg--success';
        render();
      } else {
        promoMsg.textContent = 'Неверный промокод.';
        promoMsg.className = 'cart-promo__msg cart-promo__msg--error';
        promoInput.classList.add('cart-promo__input--error');
        // Shake animation on invalid code
        promoInput.classList.add('shake');
        setTimeout(() => promoInput.classList.remove('shake'), 500);
      }
    });

    // Enter key on promo input
    promoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') promoBtn.click();
    });

    // Continue shopping
    page.querySelector('#continue-btn')?.addEventListener('click', () => router.navigate('/'));

    // Clear cart
    page.querySelector('#clear-cart-btn')?.addEventListener('click', () => {
      if (confirm('Очистить всю корзину?')) cart.clear();
    });
  }

  cart.subscribe(() => render());
  render();

  return page;
}
