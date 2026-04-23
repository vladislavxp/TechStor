/**
 * Lightweight toast notification utility.
 * Renders a small popup at the bottom-right of the screen.
 *
 * Usage:
 *   import { toast } from './utils/toast.js';
 *   toast('Added to cart!');
 *   toast('Error message', 'error');
 */

let container = null;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} [type='success']
 * @param {number} [duration=2800] - ms before auto-dismiss
 */
export function toast(message, type = 'success', duration = 2800) {
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', 'status');

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  el.innerHTML = `<span class="toast__icon">${icon}</span><span class="toast__msg">${message}</span>`;

  getContainer().appendChild(el);

  // Trigger entrance animation on next frame
  requestAnimationFrame(() => el.classList.add('toast--visible'));

  // Auto-dismiss
  const timer = setTimeout(() => dismiss(el), duration);

  el.addEventListener('click', () => {
    clearTimeout(timer);
    dismiss(el);
  });
}

function dismiss(el) {
  el.classList.remove('toast--visible');
  el.classList.add('toast--hiding');
  el.addEventListener('transitionend', () => el.remove(), { once: true });
}
