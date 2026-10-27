import { NAV_ITEMS, PUBLIC_ROUTES } from '../core/constants.js';

const VALID_ROUTES = new Set([
  ...NAV_ITEMS.map((item) => item.path),
  ...PUBLIC_ROUTES,
]);

export function getRoute() {
  const raw = String(window.location.hash || '').replace(/^#\/?/, '').split('?')[0].trim();
  if (!raw) return 'home';
  return VALID_ROUTES.has(raw) ? raw : 'home';
}

export function navigate(route, { replace = false } = {}) {
  const target = VALID_ROUTES.has(route) ? route : 'home';
  const hash = `#/${target}`;
  if (window.location.hash === hash) return;
  if (replace) {
    window.history.replaceState(null, '', hash);
  } else {
    window.location.hash = hash;
  }
}

export function onRouteChange(handler) {
  window.addEventListener('hashchange', handler);
}
