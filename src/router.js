const routes = {};
let currentPath = '';

export const router = {
  register(path, handler) {
    routes[path] = handler;
  },

  navigate(path) {
    history.pushState(null, '', path);
    this.resolve(path);
  },

  resolve(path) {
    currentPath = path;

    // Match exact or parameterized routes
    for (const [pattern, handler] of Object.entries(routes)) {
      const regex = patternToRegex(pattern);
      const match = path.match(regex);
      if (match) {
        const params = extractParams(pattern, match);
        handler(params);
        return;
      }
    }

    // Fallback to catalog
    if (routes['/']) {
      routes['/']({});
    }
  },

  init() {
    window.addEventListener('popstate', () => {
      this.resolve(location.pathname);
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href') || link.dataset.href;
        if (href) this.navigate(href);
      }
    });

    this.resolve(location.pathname);
  },
};

function patternToRegex(pattern) {
  const escaped = pattern.replace(/\//g, '\\/').replace(/:([^/]+)/g, '([^/]+)');
  return new RegExp(`^${escaped}$`);
}

function extractParams(pattern, match) {
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
