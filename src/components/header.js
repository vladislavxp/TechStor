import { cart } from '../store/cart.js';
import { router } from '../router.js';

export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'header';

  header.innerHTML = `
    <div class="header__inner container">
      <a href="/" data-link class="header__logo" aria-label="TechStore — Home">
        <div class="header__logo-icon">T</div>
        <span class="header__logo-text">TechStore</span>
      </a>

      <nav class="header__nav">
        <a href="/" data-link class="header__nav-link">Каталог</a>
        <a href="/categories" data-link class="header__nav-link">Категории</a>
        <a href="/deals" data-link class="header__nav-link">Акции</a>
        <a href="/about" data-link class="header__nav-link">О нас</a>
      </nav>

      <button class="header__cart-btn" id="cart-btn" aria-label="Shopping cart">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span class="header__cart-badge" id="cart-badge" style="display:none">0</span>
        <span class="header__cart-label">Корзина</span>
      </button>

      <button class="header__burger" id="burger-btn" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="header__mobile-nav" id="mobile-nav">
      <a href="/" data-link class="header__nav-link">Каталог</a>
      <a href="/categories" data-link class="header__nav-link">Категории</a>
      <a href="/deals" data-link class="header__nav-link">Акции</a>
      <a href="/about" data-link class="header__nav-link">О нас</a>
    </div>
  `;

  function updateBadge() {
    const count = cart.getCount();
    const badge = header.querySelector('#cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
    updateActiveLink();
  }

  function updateActiveLink() {
    const links = header.querySelectorAll('.header__nav-link');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', location.pathname === href);
    });
  }

  cart.subscribe(updateBadge);
  updateBadge();

  // Add shadow to header on scroll
  const headerEl = header;
  window.addEventListener('scroll', () => {
    headerEl.classList.toggle('header--scrolled', window.scrollY > 10);
  }, { passive: true });

  header.querySelector('#cart-btn').addEventListener('click', () => {
    router.navigate('/cart');
  });

  const burgerBtn = header.querySelector('#burger-btn');
  const mobileNav = header.querySelector('#mobile-nav');
  burgerBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    burgerBtn.classList.toggle('open');
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('[data-link]').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      burgerBtn.classList.remove('open');
    });
  });

  return header;
}
