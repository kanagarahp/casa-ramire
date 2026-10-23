import { esc } from './dom.js';
import { icon } from './icons.js';

const SIZES = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-6xl',
};

const stack = [];
let previousFocus = null;

function focusables(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.offsetParent !== null);
}

function handleKeydown(event) {
  if (!stack.length) return;
  const top = stack[stack.length - 1];

  if (event.key === 'Escape' && top.dismissible) {
    event.preventDefault();
    top.close();
    return;
  }

  if (event.key === 'Tab') {
    const items = focusables(top.panel);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

document.addEventListener('keydown', handleKeydown);

/**
 * Open a modal dialog.
 *
 * @param {object} options
 * @param {string} options.title
 * @param {string} [options.subtitle]
 * @param {string} options.body HTML for the body
 * @param {string} [options.footer] HTML for the footer
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [options.size]
 * @param {boolean} [options.dismissible]
 * @param {(el: HTMLElement, close: () => void) => void} [options.onMount]
 * @param {() => void} [options.onClose]
 */
export function openModal({
  title = '',
  subtitle = '',
  body = '',
  footer = '',
  size = 'md',
  dismissible = true,
  onMount,
  onClose,
} = {}) {
  const root = document.getElementById('modal-root');
  if (!root) throw new Error('modal-root tidak ditemukan');

  if (!stack.length) {
    previousFocus = document.activeElement;
    document.body.classList.add('overflow-hidden');
  }

  const wrap = document.createElement('div');
  wrap.className = 'modal-backdrop';
  wrap.innerHTML = `
    <div class="modal-panel ${SIZES[size] || SIZES.md}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-head">
        <div class="min-w-0">
          <h2 class="text-lg font-extrabold text-stone-800 leading-tight truncate">${title}</h2>
          ${subtitle ? `<p class="text-xs text-stone-500 mt-0.5">${subtitle}</p>` : ''}
        </div>
        ${
          dismissible
            ? `<button type="button" class="btn-ghost btn-sm shrink-0" data-modal-close aria-label="Tutup dialog">${icon('X', 'w-5 h-5')}</button>`
            : ''
        }
      </div>
      <div class="modal-body">${body}</div>
      ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
    </div>
  `;

  const panel = wrap.querySelector('.modal-panel');

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    const index = stack.findIndex((item) => item.wrap === wrap);
    if (index >= 0) stack.splice(index, 1);
    wrap.remove();
    if (!stack.length) {
      document.body.classList.remove('overflow-hidden');
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus({ preventScroll: true });
      }
      previousFocus = null;
    }
    onClose?.();
  };

  const instance = { el: wrap, panel, close, dismissible };
  stack.push(instance);

  wrap.addEventListener('mousedown', (event) => {
    if (event.target === wrap && dismissible) close();
  });

  wrap.querySelectorAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', close);
  });

  root.appendChild(wrap);
  onMount?.(wrap, close);

  requestAnimationFrame(() => {
    const target =
      panel.querySelector('.modal-body input:not([type="hidden"]), .modal-body select, .modal-body textarea') ||
      panel.querySelector('.modal-foot .btn-primary, .modal-foot .btn-danger, .modal-foot button') ||
      panel.querySelector('[data-modal-close]');
    target?.focus({ preventScroll: true });
  });

  return instance;
}

export function closeAllModals() {
  [...stack].reverse().forEach((item) => item.close());
}

/**
 * Promise-based confirmation dialog.
 * @returns {Promise<boolean>}
 */
export function confirmAction({
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  danger = false,
  iconName = 'AlertTriangle',
} = {}) {
  return new Promise((resolve) => {
    let settled = false;
    let instance;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    instance = openModal({
      title,
      size: 'sm',
      body: `
        <div class="flex items-start gap-3.5">
          <div class="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center ${danger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}">
            ${icon(iconName, 'w-6 h-6')}
          </div>
          <div class="text-sm text-stone-600 leading-relaxed pt-0.5">${message}</div>
        </div>
      `,
      footer: `
        <button type="button" class="btn-outline btn-sm" data-cancel>${esc(cancelText)}</button>
        <button type="button" class="${danger ? 'btn-danger' : 'btn-primary'} btn-sm" data-confirm>${esc(confirmText)}</button>
      `,
      onMount(el, close) {
        el.querySelector('[data-cancel]').addEventListener('click', () => {
          finish(false);
          close();
        });
        el.querySelector('[data-confirm]').addEventListener('click', () => {
          finish(true);
          close();
        });
      },
      onClose() {
        finish(false);
        instance = null;
      },
    });
  });
}
