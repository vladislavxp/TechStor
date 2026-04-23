import './style.css';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { renderCatalog } from './pages/catalog.js';
import { renderProduct } from './pages/product.js';
import { renderCart } from './pages/cart.js';
import { router } from './router.js';

const app = document.getElementById('app');

function mountPage(pageEl) {
  const main = document.getElementById('main-content');
  if (main) {
    main.innerHTML = '';
    main.appendChild(pageEl);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Build shell
app.innerHTML = `
  <div id="header-mount"></div>
  <main id="main-content" class="main-content"></main>
  <div id="footer-mount"></div>
`;

app.querySelector('#header-mount').appendChild(renderHeader());
app.querySelector('#footer-mount').appendChild(renderFooter());

// Register routes
router.register('/', () => mountPage(renderCatalog()));
router.register('/product/:id', ({ id }) => mountPage(renderProduct({ id })));
router.register('/cart', () => mountPage(renderCart()));

// ── Stub pages ──────────────────────────────────────────────────────────────
function stubPage(title) {
  const el = document.createElement('div');
  el.className = 'stub-page container';
  el.innerHTML = `
    <h1>${title}</h1>
    <p>This section is coming soon. Check back later!</p>
    <a href="/" data-link class="btn btn--primary">Back to Shop</a>
  `;
  return el;
}

router.register('/categories', () => mountPage(stubPage('Categories')));
router.register('/deals',      () => mountPage(stubPage('Special Deals')));
router.register('/about',      () => mountPage(stubPage('About Us')));
router.register('/contact',    () => mountPage(stubPage('Contact Support')));

// ── 404 fallback ─────────────────────────────────────────────────────────────
router.notFound(() => {
  const el = document.createElement('div');
  el.className = 'not-found container';
  el.innerHTML = `
    <div class="not-found__inner">
      <span class="not-found__code">404</span>
      <h2 class="not-found__title">Page Not Found</h2>
      <p class="not-found__desc">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" data-link class="btn btn--primary btn--lg">Go to Catalog</a>
    </div>
  `;
  mountPage(el);
});

router.init();
