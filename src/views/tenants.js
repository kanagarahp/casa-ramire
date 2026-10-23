import {
  daysBetween,
  formatDate,
  rupiah,
  todayISO,
  waLink,
} from '../core/format.js';
import { getOutstandingForTenant, getTenants } from '../services/property.js';
import { buildMessage } from '../services/templates.js';
import {
  avatar,
  emptyState,
  pageHeader,
  statCard,
} from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openCheckoutModal, openExtendModal, openMoveRoomModal } from './booking-modal.js';
import { openTenantDetail } from './tenant-detail.js';

let statusFilter = 'aktif';
let searchTerm = '';

function statusPill(tenant) {
  return tenant.status === 'aktif'
    ? '<span class="badge-green">Aktif</span>'
    : '<span class="badge-gray">Checkout</span>';
}

function contractBadge(tenant) {
  if (tenant.status !== 'aktif') {
    return tenant.checkoutDate ? `<span class="badge-gray">Keluar ${formatDate(tenant.checkoutDate)}</span>` : '<span class="badge-gray">—</span>';
  }
  const daysLeft = daysBetween(todayISO(), tenant.endDate);
  if (daysLeft < 0) return `<span class="badge-red">Lewat ${Math.abs(daysLeft)} hari</span>`;
  if (daysLeft === 0) return `<span class="badge-red">Berakhir hari ini</span>`;
  if (daysLeft <= 7) return `<span class="badge-amber">H-${daysLeft}</span>`;
  return `<span class="badge-green">${daysLeft} hari lagi</span>`;
}

function rowHtml(tenant) {
  const outstanding = getOutstandingForTenant(tenant.id);
  const message = buildMessage('reminder', {
    nama: tenant.name,
    kamar: tenant.roomNumber || '—',
    nominal: rupiah(tenant.monthlyCharge),
    jatuh_tempo: formatDate(tenant.endDate),
  });
  const isActive = tenant.status === 'aktif';

  return `
    <tr>
      <td>
        <div class="flex items-center gap-2.5">
          ${avatar(tenant.name, 'w-9 h-9 text-[10px]')}
          <div class="min-w-0">
            <button type="button" class="font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="detail" data-id="${tenant.id}">${esc(tenant.name)}</button>
            <p class="text-[10px] text-stone-400 truncate">${esc(tenant.job || '—')} · ${esc(tenant.phone)}</p>
          </div>
        </div>
      </td>
      <td>
        <p class="font-semibold text-stone-700 whitespace-nowrap">${isActive ? `Kamar ${esc(tenant.roomNumber || '—')}` : '—'}</p>
        <div class="mt-0.5">${statusPill(tenant)}</div>
      </td>
      <td class="whitespace-nowrap">
        <p class="text-xs text-stone-600">${formatDate(tenant.startDate)} — ${formatDate(tenant.endDate)}</p>
        <div class="mt-0.5">${contractBadge(tenant)}</div>
      </td>
      <td class="font-bold whitespace-nowrap">${rupiah(tenant.contractTotal)}</td>
      <td class="font-bold whitespace-nowrap ${outstanding > 0 ? 'text-rose-700' : 'text-emerald-700'}">${outstanding > 0 ? rupiah(outstanding) : 'Lunas'}</td>
      <td>
        <div class="flex flex-wrap items-center justify-end gap-1">
          <button type="button" class="btn-outline btn-xs" data-action="detail" data-id="${tenant.id}">${icon('UserRound', 'w-3 h-3')} Detail</button>
          ${
            isActive
              ? `
                <button type="button" class="btn-outline btn-xs" data-action="extend" data-id="${tenant.id}" title="Perpanjang kontrak">${icon('Repeat', 'w-3 h-3')}</button>
                <button type="button" class="btn-ghost btn-xs" data-action="move" data-id="${tenant.id}" title="Pindah kamar">${icon('ArrowRight', 'w-3.5 h-3.5')}</button>
                <a href="${waLink(tenant.phone, message)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim WhatsApp">${icon('MessageCircle', 'w-4 h-4')}</a>
                <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="checkout" data-id="${tenant.id}" title="Check-out">${icon('DoorOpen', 'w-3.5 h-3.5')}</button>
              `
              : ''
          }
        </div>
      </td>
    </tr>
  `;
}

export function render(root) {
  const tenants = getTenants();
  const active = tenants.filter((tenant) => tenant.status === 'aktif');
  const checkedOut = tenants.filter((tenant) => tenant.status === 'checkout');
  const outstanding = active.reduce((sum, tenant) => sum + getOutstandingForTenant(tenant.id), 0);
  const contractValue = active.reduce((sum, tenant) => sum + Number(tenant.contractTotal || 0), 0);

  root.innerHTML = `
    <div data-view="tenants" class="animate-in">
      ${pageHeader({
        eyebrow: 'Directory & Contracts',
        title: 'Data Penghuni & Kontrak 👥',
        subtitle: 'Direktori penghuni, kontak darurat, riwayat kamar, dan siklus kontrak.',
        actions: `<a href="#/rooms" class="btn-primary btn-sm">${icon('UserPlus', 'w-4 h-4')} Check-in Penghuni</a>`,
      })}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${statCard({ label: 'Penghuni Aktif', value: active.length, iconName: 'Users', tone: 'green', hint: `${checkedOut.length} sudah checkout` })}
        ${statCard({ label: 'Nilai Kontrak Aktif', value: rupiah(contractValue), iconName: 'Wallet', tone: 'brand' })}
        ${statCard({ label: 'Total Tunggakan', value: rupiah(outstanding), iconName: 'CircleAlert', tone: outstanding > 0 ? 'rose' : 'green' })}
        ${statCard({ label: 'Total Penghuni', value: tenants.length, iconName: 'ClipboardList', hint: 'Termasuk riwayat' })}
      </div>

      <div class="card p-3 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex flex-wrap gap-2">
          <button type="button" class="chip-active" data-filter="aktif">Aktif (${active.length})</button>
          <button type="button" class="chip-idle" data-filter="checkout">Checkout (${checkedOut.length})</button>
          <button type="button" class="chip-idle" data-filter="semua">Semua (${tenants.length})</button>
        </div>
        <div class="relative sm:ml-auto sm:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">${icon('Search', 'w-3.5 h-3.5')}</span>
          <input id="tenant-search" type="search" class="input input-sm pl-8" placeholder="Cari nama / kamar / HP…" value="${esc(searchTerm)}" />
        </div>
      </div>

      <div id="tenants-content"></div>
    </div>
  `;

  const scope = root.querySelector('[data-view="tenants"]');
  const content = scope.querySelector('#tenants-content');
  const searchInput = scope.querySelector('#tenant-search');

  const sync = () => {
    scope.querySelectorAll('[data-filter]').forEach((button) => {
      button.className = button.dataset.filter === statusFilter ? 'chip-active' : 'chip-idle';
    });
  };

  const paint = () => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = tenants
      .filter((tenant) => {
        if (statusFilter === 'semua') return true;
        return tenant.status === statusFilter;
      })
      .filter((tenant) => {
        if (!term) return true;
        return [tenant.name, tenant.roomNumber || '', tenant.phone || '', tenant.job || '']
          .join(' ')
          .toLowerCase()
          .includes(term);
      });

    if (!filtered.length) {
      content.innerHTML = `<div class="card">${emptyState({
        iconName: 'Users',
        title: 'Tidak ada penghuni',
        description:
          statusFilter === 'aktif'
            ? 'Belum ada penghuni aktif. Lakukan check-in dari menu Status Kamar.'
            : 'Tidak ada data yang cocok dengan filter atau pencarian.',
        action: `<a href="#/rooms" class="btn-primary btn-sm">${icon('Building2', 'w-4 h-4')} Buka Status Kamar</a>`,
      })}</div>`;
      return;
    }

    content.innerHTML = `
      <div class="card overflow-hidden">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Penghuni</th>
                <th>Kamar &amp; Status</th>
                <th>Masa Sewa</th>
                <th>Nilai Kontrak</th>
                <th>Tunggakan</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>${filtered.map(rowHtml).join('')}</tbody>
          </table>
        </div>
      </div>
    `;
  };

  sync();
  paint();

  scope.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      statusFilter = button.dataset.filter;
      sync();
      paint();
    });
  });

  searchInput?.addEventListener('input', () => {
    searchTerm = searchInput.value;
    paint();
  });

  delegate(scope, 'click', '[data-action]', (event, target) => {
    const action = target.dataset.action;
    const id = Number(target.dataset.id);
    if (action === 'detail') openTenantDetail(id);
    if (action === 'extend') openExtendModal(id);
    if (action === 'move') openMoveRoomModal(id);
    if (action === 'checkout') openCheckoutModal(id);
  });
}
