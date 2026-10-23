import './styles.css';

import { NAV_ITEMS, PAGE_META } from './core/constants.js';
import { getRoute, navigate, onRouteChange } from './core/router.js';
import { subscribe } from './core/store.js';
import { getActiveUser, isOwner } from './services/auth.js';
import { closeAllModals } from './ui/modal.js';
import { toast } from './ui/toast.js';

import * as dashboardView from './views/dashboard.js';
import * as roomsView from './views/rooms.js';
import * as pricingView from './views/pricing.js';
import * as addonsView from './views/addons.js';
import * as tenantsView from './views/tenants.js';
import * as financialView from './views/financial.js';
import * as billingView from './views/billing.js';
import * as contentView from './views/content.js';
import * as usersView from './views/users.js';

import { bindLogin, renderLogin } from './views/login.js';
import { bindShell, renderShell, updateShell } from './views/shell.js';

const app = document.getElementById('app');

const VIEWS = {
  dashboard: dashboardView,
  rooms: roomsView,
  pricing: pricingView,
  addons: addonsView,
  tenants: tenantsView,
  financial: financialView,
  billing: billingView,
  content: contentView,
  users: usersView,
};

const OWNER_ONLY = new Set(NAV_ITEMS.filter((item) => item.ownerOnly).map((item) => item.path));

let lastUserId = null;
let lastRoute = null;
let scheduled = false;

function scheduleRender() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    render();
  });
}

function errorScreen(error) {
  return `
    <div class="card p-8 text-center animate-in">
      <h2 class="font-black text-stone-800 text-lg">Terjadi kesalahan saat memuat halaman</h2>
      <p class="text-sm text-stone-500 mt-1 max-w-lg mx-auto">
        Coba muat ulang aplikasi. Jika masalah berlanjut, unduh backup data lalu lakukan pemulihan.
      </p>
      <pre class="mt-4 text-left text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 overflow-x-auto">${String(error?.message || error)}</pre>
      <button type="button" class="btn-primary btn-sm mt-4" onclick="location.reload()">Muat ulang</button>
    </div>
  `;
}

function render() {
  const user = getActiveUser();

  if (!user) {
    if (lastUserId !== null) closeAllModals();
    lastUserId = null;
    lastRoute = null;
    app.innerHTML = renderLogin();
    bindLogin(app);
    document.title = 'Masuk — Casa Ramire';
    return;
  }

  let route = getRoute();
  if (OWNER_ONLY.has(route) && !isOwner()) {
    toast('Halaman tersebut hanya dapat diakses oleh owner.', 'warning');
    navigate('dashboard', { replace: true });
    route = 'dashboard';
  }

  const userId = String(user.id);
  const shellChanged = lastUserId !== userId;

  if (shellChanged) {
    app.innerHTML = renderShell(user, route);
    bindShell(app);
    lastUserId = userId;
    lastRoute = null;
  } else {
    updateShell(app, user, route);
  }

  const view = app.querySelector('#view');
  if (!view) return;

  const routeChanged = lastRoute !== route;
  view.innerHTML = '';

  const viewModule = VIEWS[route] || VIEWS.dashboard;
  try {
    viewModule.render(view);
  } catch (error) {
    console.error('[app] failed to render view', route, error);
    view.innerHTML = errorScreen(error);
  }

  if (routeChanged) {
    lastRoute = route;
    document.getElementById('main-scroll')?.scrollTo({ top: 0 });
    document.title = `${PAGE_META[route]?.title || 'Dashboard'} — Casa Ramire`;
  }
}

subscribe(scheduleRender);
onRouteChange(scheduleRender);

if (!window.location.hash) {
  window.history.replaceState(null, '', '#/dashboard');
}

render();
