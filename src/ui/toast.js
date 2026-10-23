import { icon } from './icons.js';
import { esc } from './dom.js';

const VARIANTS = {
  success: { icon: 'CheckCircle2', color: 'text-emerald-400', border: 'border-emerald-500/30' },
  error: { icon: 'CircleX', color: 'text-rose-400', border: 'border-rose-500/30' },
  warning: { icon: 'AlertTriangle', color: 'text-amber-400', border: 'border-amber-500/30' },
  info: { icon: 'Info', color: 'text-sky-400', border: 'border-sky-500/30' },
};

/** Show a transient notification in the bottom-right corner. */
export function toast(message, type = 'success', duration = 3400) {
  const root = document.getElementById('toast-root');
  if (!root) return;

  const variant = VARIANTS[type] || VARIANTS.success;
  const element = document.createElement('div');
  element.className = `pointer-events-auto flex items-start gap-3 rounded-2xl border ${variant.border} bg-stone-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition duration-200 translate-y-2 opacity-0`;
  element.setAttribute('role', 'status');
  element.innerHTML = `
    <span class="shrink-0 ${variant.color}">${icon(variant.icon, 'w-5 h-5')}</span>
    <span class="leading-snug">${esc(message)}</span>
  `;

  root.appendChild(element);
  requestAnimationFrame(() => {
    element.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    element.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => element.remove(), 250);
  }, duration);
}
