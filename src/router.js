/**
 * Lightweight SPA router.
 * Supports static routes and parameterized routes like /product/:id
 * Uses History API (pushState / popstate).
 */

const routes = {};
let notFoundHandler = null;

export const router = {
  /**
   * Register a route pattern with a handler function.
   * @param {string} pattern - e.g. '/' or '/product/:id'
   * @param {Function} handler - called with params object
   */
  register(pattern, handler) {
    routes[pattern] = handler;
  },

  /**
   * Register a fallback handler for unmatched routes (404).
   * @param {Function} handler
   */
  notFound(handler) {
    notFoundHandler = handler;
  },

  /**
   * Navigate to a new path, push to history and render.
   * @param {string} path
   */
  navigate(path) {
    history.pushState(null, '', path);
    this._resolve(path);
  },

  /**
   * Match current path against registered routes and call the handler.
   * @param {string} path
   */
  _resolve(path) {
    // Scroll to top on every navigation
    window.scrollTo({ top: 0, behavior: 'instant' });

    for (const [pattern, handler] of Object.entries(routes)) {
      const regex = _patternToRegex(pattern);
      const match = path.match(regex);
      if (match) {
        const params = _extractParams(pattern, match);
        handler(params);
        return;
      }
    }

    // No route matched — show 404
    if (notFoundHandler) {
      notFoundHandler();
    } else if (routes['/']) {
      routes['/']({});
    }
  },

  /**
   * Bootstrap the router: bind popstate and delegate link clicks.
   */
  init() {
    // Back / forward navigation
    window.addEventListener('popstate', () => {
      this._resolve(location.pathname);
    });

    // Intercept clicks on elements with [data-link]
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (!link) return;
      e.preventDefault();
      const href = link.getAttribute('href') || link.dataset.href;
      if (href && href !== location.pathname) {
        this.navigate(href);
      }
    });

    // Resolve the initial URL on page load
    this._resolve(location.pathname);
  },
};

// ─── helpers ────────────────────────────────────────────────────────────────

function _patternToRegex(pattern) {
  const escaped = pattern
    .replace(/\//g, '\\/')
    .replace(/:([^/]+)/g, '([^/]+)');
  return new RegExp(`^${escaped}$`);
}

function _extractParams(pattern, match) {
  const keys = [];
  const keyRegex = /:([^/]+)/g;
  let m;
  while ((m = keyRegex.exec(pattern)) !== null) {
    keys.push(m[1]);
  }
  const params = {};
  keys.forEach((key, i) => {
    params[key] = match[i + 1];
  });
  return params;
}
