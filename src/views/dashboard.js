import { formatDate, rupiah, todayISO, waLink } from '../core/format.js';
import { getCashflowTrend, getDashboardStats } from '../services/reports.js';
import { buildMessage } from '../services/templates.js';
import {
  avatar,
  billBadge,
  cardHeader,
  emptyRow,
  emptyState,
  pageHeader,
  progressBar,
  statCard,
} from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openBookingModal, openCheckinFlow, openExtendModal } from './booking-modal.js';
import { openVerifyModal } from './billing-modals.js';
import { openTenantDetail } from './tenant-detail.js';

function daysLeftBadge(daysLeft) {
  if (daysLeft < 0) return `<span class="badge-red">Lewat ${Math.abs(daysLeft)} hari</span>`;
  if (daysLeft === 0) return `<span class="badge-red">Hari ini</span>`;
  return `<span class="badge-amber">H-${daysLeft}</span>`;
}

function checkinRows(checkins) {
  if (!checkins.length) {
    return `<tr><td colspan="5">${emptyState({
      iconName: 'CalendarClock',
      title: 'Belum ada antrean booking',
      description: 'Booking baru akan muncul di sini untuk diproses check-in.',
    })}</td></tr>`;
  }
  return checkins
    .map(({ room, booking }) => {
      const isPaid = booking.payOption === 'full';
      return `
        <tr>
          <td class="font-black text-stone-800 whitespace-nowrap">${esc(room.nomor)}</td>
          <td>
            <button type="button" class="font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="tenant-booking" data-room="${room.id}">${esc(booking.name)}</button>
            <p class="text-[10px] text-stone-400">${esc(booking.phone)}</p>
          </td>
          <td class="whitespace-nowrap">${formatDate(booking.startDate)}</td>
          <td>${isPaid ? '<span class="badge-green">Lunas</span>' : '<span class="badge-amber">DP</span>'}</td>
          <td>
            <div class="flex items-center justify-end gap-1">
              <button type="button" class="btn-primary btn-xs" data-action="checkin" data-room="${room.id}">${icon('LogIn', 'w-3 h-3')} Check-in</button>
              <button type="button" class="btn-outline btn-xs" data-action="edit-booking" data-room="${room.id}" title="Edit booking">${icon('Pencil', 'w-3 h-3')}</button>
            </div>
          </td>
        </tr>`;
    })
    .join('');
}

function expiringRows(entries) {
  if (!entries.length) {
    return emptyState({
      iconName: 'BadgeCheck',
      title: 'Semua kontrak aman',
      description: 'Tidak ada kontrak yang berakhir dalam 7 hari ke depan.',
    });
  }
  return `<div class="divide-y divide-line-soft">
    ${entries
      .map(({ tenant, daysLeft }) => {
        const message = buildMessage('reminder', {
          nama: tenant.name,
          kamar: tenant.roomNumber,
          nominal: rupiah(tenant.monthlyCharge),
          jatuh_tempo: formatDate(tenant.endDate),
        });
        return `
          <div class="px-5 py-3.5 flex flex-wrap items-center gap-3">
            ${avatar(tenant.name, 'w-9 h-9 text-[10px]')}
            <div class="min-w-0 flex-1">
              <button type="button" class="text-sm font-bold text-stone-800 hover:text-brand hover:underline text-left" data-action="detail" data-tenant="${tenant.id}">${esc(tenant.name)}</button>
              <p class="text-[11px] text-stone-500">Kamar ${esc(tenant.roomNumber || '—')} · berakhir ${formatDate(tenant.endDate)}</p>
            </div>
            <div class="flex items-center gap-2 ml-auto">
              ${daysLeftBadge(daysLeft)}
              <a href="${waLink(tenant.phone, message)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim pengingat WhatsApp">${icon('MessageCircle', 'w-4 h-4')}</a>
              <button type="button" class="btn-outline btn-xs" data-action="extend" data-tenant="${tenant.id}">${icon('Repeat', 'w-3 h-3')} Perpanjang</button>
            </div>
          </div>`;
      })
      .join('')}
  </div>`;
}

function cashflowChart(trend) {
  const max = Math.max(1, ...trend.flatMap((item) => [item.income, item.expense]));
  const current = trend[trend.length - 1] || { income: 0, expense: 0, net: 0 };

  return `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Kas masuk bulan ini</p>
        <p class="font-black text-emerald-700 text-base">${rupiah(current.income)}</p>
      </div>
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Kas keluar</p>
        <p class="font-black text-rose-700 text-base">${rupiah(current.expense)}</p>
      </div>
      <div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Net</p>
        <p class="font-black text-stone-800 text-base">${rupiah(current.net)}</p>
      </div>
    </div>
    <div class="flex items-end justify-between gap-2 h-40">
      ${trend
        .map((item) => {
          const incomeHeight = item.income ? Math.max(3, (item.income / max) * 100) : 0;
          const expenseHeight = item.expense ? Math.max(3, (item.expense / max) * 100) : 0;
          return `
            <div class="flex-1 min-w-0 flex flex-col items-center gap-1.5">
              <div class="w-full h-32 flex items-end justify-center gap-1">
                <div class="w-3 rounded-t-md bg-emerald-500/90 transition-all" style="height:${incomeHeight}%" title="Masuk ${rupiah(item.income)}"></div>
                <div class="w-3 rounded-t-md bg-rose-400/90 transition-all" style="height:${expenseHeight}%" title="Keluar ${rupiah(item.expense)}"></div>
              </div>
              <span class="text-[9px] font-bold uppercase tracking-wider text-stone-400">${esc(item.label)}</span>
            </div>`;
        })
        .join('')}
    </div>
    <div class="flex items-center gap-4 mt-4 text-[10px] font-semibold text-stone-500">
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Kas masuk</span>
      <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-rose-400"></span> Pengeluaran</span>
    </div>
  `;
}

function floorList(floors) {
  if (!floors.length) return `<p class="text-sm text-stone-400">Belum ada data lantai.</p>`;
  return floors
    .map(
      (floor) => `
      <div>
        <div class="flex items-center justify-between text-xs mb-1.5">
          <span class="font-extrabold text-stone-700">Lantai ${esc(floor.floor)}</span>
          <span class="font-bold text-stone-500">${floor.occupied}/${floor.total} terisi · ${floor.occupancy.toFixed(0)}%</span>
        </div>
        ${progressBar(floor.occupancy, floor.occupancy >= 70 ? 'bg-emerald-500' : floor.occupancy >= 40 ? 'bg-amber-400' : 'bg-rose-400')}
        <div class="flex flex-wrap gap-1.5 mt-2">
          <span class="badge-green">${floor.occupied} terisi</span>
          <span class="badge-amber">${floor.vacant} kosong</span>
          ${floor.booking ? `<span class="badge-blue">${floor.booking} booking</span>` : ''}
        </div>
      </div>`,
    )
    .join('');
}

export function render(root) {
  const stats = getDashboardStats();
  const trend = getCashflowTrend(6);
  const today = todayISO();

  root.innerHTML = `
    <div data-view="dashboard" class="animate-in">
      ${pageHeader({
        eyebrow: 'Enterprise Dashboard',
        title: 'Dashboard Casa Ramire ☕',
        subtitle: `Monitor ${stats.total} kamar, antrean check-in, dan kesehatan kas properti.`,
        actions: `
          <a href="#/rooms" class="btn-primary btn-sm">${icon('Building2', 'w-4 h-4')} Kelola Kamar</a>
          <a href="#/billing" class="btn-outline btn-sm">${icon('ReceiptText', 'w-4 h-4')} Verifikasi Kas</a>
        `,
      })}

      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        ${statCard({ label: 'Total Kamar', value: stats.total, iconName: 'Building2', hint: '2 lantai' })}
        ${statCard({ label: 'Terisi', value: stats.occupied, iconName: 'UserCheck', tone: 'green', hint: `${stats.occupancy.toFixed(0)}% okupansi` })}
        ${statCard({ label: 'Kosong', value: stats.vacant, iconName: 'DoorOpen', tone: 'amber', hint: 'Siap dipasarkan' })}
        ${statCard({ label: 'Booking', value: stats.booking, iconName: 'CalendarClock', tone: 'indigo', hint: 'Menunggu check-in' })}
        ${statCard({ label: 'Okupansi', value: `${stats.occupancy.toFixed(1)}%`, iconName: 'PieChart', tone: 'teal', hint: 'Okupansi saat ini' })}
        ${statCard({ label: 'Pendapatan Bulan Ini', value: rupiah(stats.revenue), iconName: 'Wallet', tone: 'brand', hint: `Laba ${rupiah(stats.profit)}` })}
      </div>

      <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <div class="card overflow-hidden">
          ${cardHeader({
            title: 'Antrean Check-in',
            description: 'Booking yang menunggu diproses',
            actions: `<span class="badge-blue">${stats.checkins.length} booking</span>`,
          })}
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Kamar</th><th>Nama</th><th>Mulai</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
              <tbody>${checkinRows(stats.checkins)}</tbody>
            </table>
          </div>
        </div>

        <div class="card overflow-hidden">
          ${cardHeader({
            title: 'Kontrak Akan Berakhir',
            description: 'H-7 dan kontrak yang sudah lewat',
            actions: `<span class="badge-red">${stats.expiring.length} kontrak</span>`,
          })}
          <div class="p-0">${expiringRows(stats.expiring)}</div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <div class="card overflow-hidden">
          ${cardHeader({ title: 'Arus Kas 6 Bulan', description: 'Kas masuk dari tagihan & invoice dibanding pengeluaran' })}
          <div class="p-5">${cashflowChart(trend)}</div>
        </div>
        <div class="card overflow-hidden">
          ${cardHeader({ title: 'Okupansi per Lantai', description: 'Distribusi kamar terisi, kosong, dan booking' })}
          <div class="p-5 space-y-5">${floorList(stats.floors)}</div>
        </div>
      </div>

      <div class="card overflow-hidden">
        ${cardHeader({
          title: 'Tagihan Aktif',
          description: `Menunggu verifikasi pembayaran · total ${rupiah(stats.unpaidBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0))}`,
          actions: `<a href="#/billing" class="btn-outline btn-xs">Lihat semua</a>`,
        })}
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Kamar</th><th>Penghuni</th><th>Jatuh Tempo</th><th>Nominal</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${
                stats.unpaidBills.length
                  ? stats.unpaidBills
                      .map((bill) => {
                        const message = buildMessage('tagihan', {
                          nama: bill.tenantName,
                          kamar: bill.roomNumber,
                          nominal: rupiah(bill.amount),
                          jatuh_tempo: formatDate(bill.dueDate),
                        });
                        const overdue = bill.dueDate && bill.dueDate < today;
                        return `
                          <tr>
                            <td class="font-black text-stone-800">${esc(bill.roomNumber || '—')}</td>
                            <td>
                              <p class="font-semibold text-stone-700">${esc(bill.tenantName || '—')}</p>
                              <p class="text-[10px] text-stone-400">${esc(bill.type || '')}</p>
                            </td>
                            <td class="${overdue ? 'text-rose-700 font-bold' : ''} whitespace-nowrap">${formatDate(bill.dueDate)}</td>
                            <td class="font-black text-amber-700 whitespace-nowrap">${rupiah(bill.amount)}</td>
                            <td>${billBadge(bill.status)}</td>
                            <td>
                              <div class="flex items-center justify-end gap-1">
                                <button type="button" class="btn-primary btn-xs" data-action="verify" data-id="${bill.id}">${icon('ShieldCheck', 'w-3 h-3')} Verifikasi</button>
                                ${bill.phone ? `<a href="${waLink(bill.phone, message)}" target="_blank" rel="noopener" class="btn-ghost btn-xs text-emerald-700" title="Kirim tagihan via WhatsApp">${icon('MessageCircle', 'w-4 h-4')}</a>` : ''}
                              </div>
                            </td>
                          </tr>`;
                      })
                      .join('')
                  : emptyRow(6, 'Tidak ada tagihan aktif. Semua pembayaran sudah diverifikasi. 🎉')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const scope = root.querySelector('[data-view="dashboard"]');
  delegate(scope, 'click', '[data-action]', (event, target) => {
    const action = target.dataset.action;
    if (action === 'checkin') openCheckinFlow(Number(target.dataset.room));
    if (action === 'edit-booking') openBookingModal(Number(target.dataset.room), 'edit_booking');
    if (action === 'extend') openExtendModal(Number(target.dataset.tenant));
    if (action === 'detail') openTenantDetail(Number(target.dataset.tenant));
    if (action === 'tenant-booking') openBookingModal(Number(target.dataset.room), 'edit_booking');
    if (action === 'verify') openVerifyModal({ kind: 'bill', id: Number(target.dataset.id) });
  });
}
