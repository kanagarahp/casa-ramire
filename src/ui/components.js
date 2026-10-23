import { ROOM_STATUS, BILL_STATUS } from '../core/constants.js';
import { esc } from './dom.js';
import { icon } from './icons.js';
import { initials } from '../core/format.js';

export function statusBadge(status) {
  const meta = ROOM_STATUS[status] || ROOM_STATUS.kosong;
  return `<span class="${meta.badge}">${meta.label}</span>`;
}

export function billBadge(status) {
  const meta = BILL_STATUS[status] || BILL_STATUS.unpaid;
  return `<span class="${meta.badge}">${meta.label}</span>`;
}

export function pageHeader({ eyebrow = '', eyebrowClass = 'badge-gold', title = '', subtitle = '', actions = '' }) {
  return `
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
      <div class="min-w-0">
        ${eyebrow ? `<span class="${eyebrowClass}">${esc(eyebrow)}</span>` : ''}
        <h1 class="page-title mt-2">${title}</h1>
        ${subtitle ? `<p class="page-subtitle">${subtitle}</p>` : ''}
      </div>
      ${actions ? `<div class="flex flex-wrap items-center gap-2 shrink-0">${actions}</div>` : ''}
    </div>
  `;
}

const STAT_TONES = {
  default: {
    card: 'card',
    label: 'text-stone-600',
    value: 'text-stone-800',
    iconBox: 'bg-stone-100 text-stone-600',
  },
  green: {
    card: 'card bg-emerald-50/60 border-emerald-200',
    label: 'text-emerald-800',
    value: 'text-emerald-900',
    iconBox: 'bg-emerald-100 text-emerald-700',
  },
  amber: {
    card: 'card bg-amber-50/60 border-amber-200',
    label: 'text-amber-800',
    value: 'text-amber-900',
    iconBox: 'bg-amber-100 text-amber-700',
  },
  indigo: {
    card: 'card bg-indigo-50/60 border-indigo-200',
    label: 'text-indigo-800',
    value: 'text-indigo-900',
    iconBox: 'bg-indigo-100 text-indigo-700',
  },
  teal: {
    card: 'card bg-teal-50/60 border-teal-200',
    label: 'text-teal-800',
    value: 'text-teal-900',
    iconBox: 'bg-teal-100 text-teal-700',
  },
  brand: {
    card: 'card bg-brand text-white border-brand',
    label: 'text-gold',
    value: 'text-white',
    iconBox: 'bg-white/10 text-gold',
  },
  rose: {
    card: 'card bg-rose-50/60 border-rose-200',
    label: 'text-rose-800',
    value: 'text-rose-900',
    iconBox: 'bg-rose-100 text-rose-700',
  },
};

export function statCard({ label, value, iconName = 'CircleDollarSign', tone = 'default', hint = '' }) {
  const styles = STAT_TONES[tone] || STAT_TONES.default;
  return `
    <div class="${styles.card} p-4 rounded-2xl">
      <div class="flex items-start justify-between gap-2">
        <p class="text-[11px] font-bold uppercase tracking-wider ${styles.label}">${esc(label)}</p>
        <span class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBox}">${icon(iconName, 'w-4 h-4')}</span>
      </div>
      <p class="text-2xl font-black mt-1.5 ${styles.value}">${value}</p>
      ${hint ? `<p class="text-[11px] mt-1 ${styles.label}">${hint}</p>` : ''}
    </div>
  `;
}

export function emptyRow(colspan, message = 'Belum ada data.') {
  return `<tr><td colspan="${colspan}" class="px-4 py-10 text-center text-stone-600 text-sm">${esc(message)}</td></tr>`;
}

export function emptyState({ iconName = 'Inbox', title = 'Belum ada data', description = '', action = '' }) {
  return `
    <div class="flex flex-col items-center justify-center text-center px-6 py-14">
      <div class="w-14 h-14 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center mb-3">
        ${icon(iconName, 'w-7 h-7')}
      </div>
      <h2 class="font-extrabold text-stone-700">${esc(title)}</h2>
      ${description ? `<p class="text-sm text-stone-500 mt-1 max-w-sm">${esc(description)}</p>` : ''}
      ${action ? `<div class="mt-4">${action}</div>` : ''}
    </div>
  `;
}

export function field({ label, input, hint = '', className = '' }) {
  return `
    <div class="${className}">
      ${label ? `<label class="label">${esc(label)}</label>` : ''}
      ${input}
      ${hint ? `<p class="hint mt-1">${esc(hint)}</p>` : ''}
    </div>
  `;
}

export function options(items, selected, { valueKey = 'id', labelKey = 'label', placeholder = '' } = {}) {
  const head = placeholder
    ? `<option value="">${esc(placeholder)}</option>`
    : '';
  return (
    head +
    items
      .map((item) => {
        const value = typeof item === 'object' ? item[valueKey] : item;
        const label = typeof item === 'object' ? item[labelKey] : item;
        return `<option value="${esc(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${esc(label)}</option>`;
      })
      .join('')
  );
}

export function avatar(name, size = 'w-10 h-10 text-xs') {
  return `<span class="inline-flex items-center justify-center rounded-full bg-brand text-gold font-extrabold shrink-0 ${size}">${esc(initials(name))}</span>`;
}

export function cardHeader({ title, description = '', actions = '' }) {
  return `
    <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
      <div>
        <h2 class="font-extrabold text-stone-800 text-sm">${esc(title)}</h2>
        ${description ? `<p class="text-xs text-stone-500 mt-0.5">${esc(description)}</p>` : ''}
      </div>
      ${actions ? `<div class="flex items-center gap-2">${actions}</div>` : ''}
    </div>
  `;
}

export function progressBar(percent, className = 'bg-emerald-500') {
  const value = Math.min(100, Math.max(0, Number(percent) || 0));
  return `
    <div class="h-2 rounded-full bg-stone-200/80 overflow-hidden">
      <div class="h-full rounded-full ${className} transition-all duration-500" style="width:${value}%"></div>
    </div>
  `;
}

export function sectionLabel(text) {
  return `<p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-600">${esc(text)}</p>`;
}

export function contactLink(phone, label = '') {
  if (!phone) return '<span class="text-stone-600">—</span>';
  return `<a href="tel:${esc(phone)}" class="inline-flex items-center gap-1 text-stone-600 hover:text-brand">${icon('Phone', 'w-3.5 h-3.5')}<span>${esc(label || phone)}</span></a>`;
}

export function iconButton(iconName, { title = '', className = 'btn-ghost btn-sm', attrs = '' } = {}) {
  return `<button type="button" class="${className}" title="${esc(title)}" aria-label="${esc(title)}" ${attrs}>${icon(iconName, 'w-4 h-4')}</button>`;
}
