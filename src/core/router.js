import { NAV_ITEMS } from '../core/constants.js';

const VALID_ROUTES = new Set(NAV_ITEMS.map((item) => item.path));

export function getRoute() {
  const raw = String(window.location.hash || '').replace(/^#\/?/, '').split('?')[0].trim();
  return VALID_ROUTES.has(raw) ? raw : 'dashboard';
}

export function navigate(route, { replace = false } = {}) {
  const target = VALID_ROUTES.has(route) ? route : 'dashboard';
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
