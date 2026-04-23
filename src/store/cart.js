/**
 * Cart store — manages cart state with localStorage persistence.
 *
 * Cart item shape:
 * {
 *   id:       number,
 *   name:     string,
 *   subtitle: string,
 *   price:    number,
 *   image:    string,
 *   quantity: number,
 * }
 */

const CART_KEY = 'techstore_cart';

// ─── persistence ─────────────────────────────────────────────────────────────

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Validate: must be an array of objects with required fields
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        typeof item.id === 'number' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage might be unavailable (private mode quota exceeded)
  }
}

// ─── state ───────────────────────────────────────────────────────────────────

let cartItems = loadCart();
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn());
}

// ─── public API ──────────────────────────────────────────────────────────────

export const cart = {
  /** Returns a shallow copy of all cart items. */
  getItems() {
    return [...cartItems];
  },

  /** Total number of units across all items. */
  getCount() {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  /** Total price (before any discounts). */
  getTotal() {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  /** Check if a product (by id) is already in the cart. */
  hasProduct(id) {
    return cartItems.some((item) => item.id === id);
  },

  /**
   * Add a product to the cart.
   * If it already exists, increments quantity by 1.
   * @param {{ id, name, subtitle, price, images: string[] }} product
   */
  addItem(product) {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({
        id:       product.id,
        name:     product.name,
        subtitle: product.subtitle,
        price:    product.price,
        image:    product.images[0],
        quantity: 1,
      });
    }
    saveCart(cartItems);
    notify();
  },

  /**
   * Remove a product from the cart entirely.
   * @param {number} id
   */
  removeItem(id) {
    cartItems = cartItems.filter((item) => item.id !== id);
    saveCart(cartItems);
    notify();
  },

  /**
   * Set the quantity of a cart item.
   * Removes the item if quantity <= 0.
   * @param {number} id
   * @param {number} quantity
   */
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

  /** Remove all items from the cart. */
  clear() {
    cartItems = [];
    saveCart(cartItems);
    notify();
  },

  /**
   * Subscribe to cart changes.
   * @param {Function} fn - called whenever cart state changes
   * @returns {Function} unsubscribe function
   */
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
