import { NAV_ITEMS, PAGE_META, ROLES } from '../core/constants.js';
import { formatDateLong } from '../core/format.js';
import { logout } from '../services/auth.js';
import { brandMark } from '../ui/brand.js';
import { avatar } from '../ui/components.js';
import { esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openSettingsModal } from './settings.js';

export function renderShell(user, route) {
  const navItems = NAV_ITEMS.filter((item) => !item.ownerOnly || user.role === 'owner');
  const meta = PAGE_META[route] || PAGE_META.dashboard;
  const roleLabel = ROLES[user.role]?.short || 'STAFF';

  return `
    <div class="flex h-dvh overflow-hidden">
      <aside
        id="sidebar"
        class="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-brand text-white flex flex-col shrink-0 shadow-xl -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-out"
        aria-label="Navigasi utama"
      >
        <div class="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          ${brandMark('w-11 h-11 rounded-2xl', { light: true })}
          <div class="min-w-0">
            <p class="font-extrabold tracking-wider text-sm leading-tight">CASA RAMIRE</p>
            <p class="text-[9px] font-bold text-gold uppercase tracking-[0.18em]">Property Management</p>
          </div>
          <button class="lg:hidden ml-auto p-2 rounded-lg text-stone-300 hover:bg-white/10" data-action="close-menu" aria-label="Tutup menu">
            ${icon('X', 'w-5 h-5')}
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-1" aria-label="Menu aplikasi">
          ${navItems
            .map(
              (item) => `
              <a href="#/${item.path}" data-nav="${item.path}" class="nav-item ${item.path === route ? 'nav-item-active' : ''}">
                ${icon(item.icon, 'w-[18px] h-[18px] shrink-0')}
                <span class="truncate">${esc(item.label)}</span>
              </a>`,
            )
            .join('')}
        </nav>

        <div class="p-3 border-t border-white/10 space-y-2">
          <div class="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/10 p-2.5">
            ${avatar(user.name, 'w-9 h-9 text-[11px] bg-gold text-brand')}
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white truncate">${esc(user.name)}</p>
              <p class="text-[9px] font-extrabold uppercase tracking-wider text-gold">${roleLabel}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-stone-200 hover:bg-white/10 transition" data-action="settings">
              ${icon('Settings', 'w-3.5 h-3.5')} Pengaturan
            </button>
            <button type="button" class="flex items-center justify-center gap-1.5 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-200 hover:bg-rose-500/20 transition" data-action="logout">
              ${icon('LogOut', 'w-3.5 h-3.5')} Keluar
            </button>
          </div>
        </div>
      </aside>

      <div id="sidebar-overlay" class="hidden fixed inset-0 z-30 bg-stone-950/50 backdrop-blur-[1px] lg:hidden"></div>

      <div class="flex-1 flex flex-col min-w-0">
        <header class="h-16 shrink-0 bg-cream/90 backdrop-blur border-b border-line flex items-center gap-3 px-4 sm:px-6">
          <button type="button" class="lg:hidden btn-ghost btn-sm" data-action="open-menu" aria-label="Buka menu">
            ${icon('Menu', 'w-5 h-5')}
          </button>
          <div class="min-w-0">
            <p id="topbar-title" class="text-sm font-extrabold text-stone-800 truncate">${esc(meta.title)}</p>
            <p id="topbar-subtitle" class="text-[11px] text-stone-600 truncate hidden sm:block">${esc(meta.subtitle)}</p>
          </div>
          <div class="ml-auto flex items-center gap-2 sm:gap-3">
            <span class="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 bg-white border border-line rounded-xl px-3 py-2">
              ${icon('CalendarDays', 'w-3.5 h-3.5 text-gold-700')}
              ${formatDateLong(new Date())}
            </span>
            <button type="button" class="btn-ghost btn-sm" data-action="settings" title="Pengaturan" aria-label="Pengaturan">
              ${icon('Settings', 'w-4 h-4')}
            </button>
            <div class="hidden sm:flex items-center gap-2 pl-2 border-l border-line">
              ${avatar(user.name, 'w-8 h-8 text-[10px]')}
              <div class="hidden md:block leading-tight">
                <p class="text-[11px] font-bold text-stone-800 max-w-[140px] truncate">${esc(user.name)}</p>
                <p class="text-[9px] font-extrabold uppercase tracking-wider text-gold-700">${roleLabel}</p>
              </div>
            </div>
          </div>
        </header>

        <main id="main-scroll" class="flex-1 overflow-y-auto">
          <div id="view" class="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto"></div>
        </main>
      </div>
    </div>
  `;
}

export function bindShell(root) {
  const sidebar = root.querySelector('#sidebar');
  const overlay = root.querySelector('#sidebar-overlay');

  const setDrawer = (open) => {
    sidebar.classList.toggle('-translate-x-full', !open);
    sidebar.classList.toggle('translate-x-0', open);
    overlay.classList.toggle('hidden', !open);
  };

  root.querySelector('[data-action="open-menu"]')?.addEventListener('click', () => setDrawer(true));
  root.querySelector('[data-action="close-menu"]')?.addEventListener('click', () => setDrawer(false));
  overlay?.addEventListener('click', () => setDrawer(false));

  root.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', () => setDrawer(false));
  });

  root.querySelectorAll('[data-action="settings"]').forEach((button) => {
    button.addEventListener('click', () => openSettingsModal());
  });

  root.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
    logout();
    setDrawer(false);
  });
}

export function updateShell(root, user, route) {
  const meta = PAGE_META[route] || PAGE_META.dashboard;
  const title = root.querySelector('#topbar-title');
  const subtitle = root.querySelector('#topbar-subtitle');
  if (title) title.textContent = meta.title;
  if (subtitle) subtitle.textContent = meta.subtitle;

  root.querySelectorAll('[data-nav]').forEach((link) => {
    const active = link.dataset.nav === route;
    link.classList.toggle('nav-item-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const roleLabel = ROLES[user.role]?.short || 'STAFF';
  const roleElement = root.querySelector('#sidebar [data-role-label]');
  if (roleElement) roleElement.textContent = roleLabel;
}
