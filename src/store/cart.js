const CART_KEY = 'techstore_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

let cartItems = loadCart();
const listeners = new Set();

export const cart = {
  getItems() {
    return [...cartItems];
  },

  getCount() {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotal() {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  hasProduct(id) {
    return cartItems.some((item) => item.id === id);
  },

  addItem(product) {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      });
    }
    saveCart(cartItems);
    notify();
  },

  removeItem(id) {
    cartItems = cartItems.filter((item) => item.id !== id);
    saveCart(cartItems);
    notify();
  },

  updateQuantity(id, quantity) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      item.quantity = quantity;
      saveCart(cartItems);
      notify();
    }
  },

  clear() {
    cartItems = [];
    saveCart(cartItems);
    notify();
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

function notify() {
  listeners.forEach((fn) => fn());
}
