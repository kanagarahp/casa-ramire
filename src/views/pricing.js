import { PERIODS } from '../core/constants.js';
import { rupiah, toNumber } from '../core/format.js';
import {
  deletePromo,
  getPromos,
  getRates,
  savePricing,
  savePromo,
  togglePromo,
} from '../services/pricing.js';
import {
  emptyRow,
  pageHeader,
  sectionLabel,
} from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

function rateCard(floor, rates) {
  return `
    <div class="card p-5 rounded-2xl">
      <div class="flex items-start justify-between gap-3 border-b border-line pb-3 mb-4">
        <div>
          <h2 class="font-black text-lg text-stone-800">Pricelist Lantai ${floor}</h2>
          <p class="text-xs text-stone-500">Kamar Deluxe ${floor === '2' ? '201 – 221' : '301 – 321'}</p>
        </div>
        <button type="button" class="btn-primary btn-sm" data-save-floor="${floor}">${icon('Check', 'w-4 h-4')} Simpan</button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${PERIODS.map(
          (period) => `
          <div>
            <label class="label" for="rate-${floor}-${period.key}">${period.label}</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-600">Rp</span>
              <input
                id="rate-${floor}-${period.key}"
                type="number"
                min="0"
                step="10000"
                class="input input-sm pl-9 font-bold"
                data-rate-floor="${floor}"
                data-rate-period="${period.key}"
                value="${toNumber(rates[period.key]) || ''}"
              />
            </div>
          </div>`,
        ).join('')}
      </div>
      <p class="hint mt-3">Tarif paket bulanan adalah total untuk seluruh periode, bukan per bulan.</p>
    </div>
  `;
}

function promoTypeBadge(promo) {
  return promo.type === 'persen'
    ? `<span class="badge-blue">Persen</span>`
    : `<span class="badge-gold">Rupiah</span>`;
}

export function render(root) {
  const promos = getPromos();
  const rates2 = getRates('2');
  const rates3 = getRates('3');

  root.innerHTML = `
    <div data-view="pricing" class="animate-in">
      ${pageHeader({
        eyebrow: 'Pricing Strategy',
        title: 'Pricelist & Diskon Promo 🏷️',
        subtitle: 'Atur tarif harian sampai tahunan dan program promo untuk menarik penghuni.',
        actions: `<button type="button" class="btn-primary btn-sm" data-action="add-promo">${icon('Plus', 'w-4 h-4')} Tambah Promo</button>`,
      })}

      <div class="grid lg:grid-cols-2 gap-5 mb-6">
        ${rateCard('2', rates2)}
        ${rateCard('3', rates3)}
      </div>

      <div class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2 class="font-extrabold text-stone-800 text-sm">Daftar Promo</h2>
            <p class="text-xs text-stone-500 mt-0.5">Diskon rupiah dihitung per bulan kontrak.</p>
          </div>
          <span class="badge-gold">${promos.filter((promo) => promo.active).length} aktif</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Nama Promo</th><th>Tipe</th><th>Nilai Diskon</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${
                promos.length
                  ? promos
                      .map(
                        (promo) => `
                        <tr>
                          <td class="font-bold text-stone-800">${esc(promo.name)}</td>
                          <td>${promoTypeBadge(promo)}</td>
                          <td class="font-bold whitespace-nowrap">${promo.type === 'persen' ? `${toNumber(promo.value)}%` : `${rupiah(promo.value)} / bulan`}</td>
                          <td>${promo.active ? '<span class="badge-green">Aktif</span>' : '<span class="badge-gray">Nonaktif</span>'}</td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-action="toggle-promo" data-id="${promo.id}">${promo.active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                              <button type="button" class="btn-ghost btn-xs" data-action="edit-promo" data-id="${promo.id}" title="Edit promo">${icon('Pencil', 'w-3.5 h-3.5')}</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete-promo" data-id="${promo.id}" title="Hapus promo">${icon('Trash2', 'w-3.5 h-3.5')}</button>
                            </div>
                          </td>
                        </tr>`,
                      )
                      .join('')
                  : emptyRow(5, 'Belum ada promo. Tambahkan promo pertama Anda.')
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="card p-5 mt-5">
        ${sectionLabel('Catatan perhitungan')}
        <p class="text-xs text-stone-500 leading-relaxed mt-1.5">
          Diskon rupiah diterapkan per bulan kontrak; diskon persen dihitung dari total sewa. Add-on selalu dihitung per bulan.
          Deposit tidak termasuk pendapatan sewa. Semua perhitungan ini otomatis dipakai pada form booking, check-in, dan perpanjangan.
        </p>
      </div>
    </div>
  `;

  const scope = root.querySelector('[data-view="pricing"]');

  scope.querySelectorAll('[data-save-floor]').forEach((button) => {
    button.addEventListener('click', () => {
      const floor = button.dataset.saveFloor;
      const values = {};
      scope.querySelectorAll(`[data-rate-floor="${floor}"]`).forEach((input) => {
        values[input.dataset.ratePeriod] = input.value;
      });
      try {
        savePricing(floor, values);
        toast(`Pricelist lantai ${floor} berhasil disimpan.`);
      } catch (error) {
        toast(error.message, 'error');
      }
    });
  });

  delegate(scope, 'click', '[data-action]', async (event, target) => {
    const action = target.dataset.action;
    const id = Number(target.dataset.id);

    if (action === 'add-promo') {
      openPromoModal();
      return;
    }
    if (action === 'edit-promo') {
      openPromoModal(id);
      return;
    }
    if (action === 'toggle-promo') {
      togglePromo(id);
      toast('Status promo diperbarui.');
      return;
    }
    if (action === 'delete-promo') {
      const promo = getPromos().find((item) => item.id === id);
      const approved = await confirmAction({
        title: 'Hapus promo?',
        message: `Promo <b>${esc(promo?.name || '')}</b> akan dihapus. Kontrak yang sudah berjalan tidak terpengaruh.`,
        confirmText: 'Ya, hapus',
        danger: true,
      });
      if (!approved) return;
      deletePromo(id);
      toast('Promo berhasil dihapus.');
    }
  });
}

function openPromoModal(promoId = null) {
  const promo = promoId ? getPromos().find((item) => item.id === promoId) : null;

  openModal({
    title: promo ? 'Edit Promo' : 'Tambah Promo Baru',
    subtitle: 'Promo dapat diaktifkan atau dinonaktifkan kapan saja.',
    size: 'sm',
    body: `
      <form id="promo-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="pr-name">Nama promo</label>
          <input id="pr-name" type="text" class="input" placeholder="cth: Promo Mahasiswa" value="${esc(promo?.name || '')}" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label" for="pr-type">Tipe diskon</label>
            <select id="pr-type" class="select">
              <option value="rupiah" ${promo?.type !== 'persen' ? 'selected' : ''}>Rupiah / bulan</option>
              <option value="persen" ${promo?.type === 'persen' ? 'selected' : ''}>Persen (%)</option>
            </select>
          </div>
          <div>
            <label class="label" for="pr-value">Nilai</label>
            <input id="pr-value" type="number" min="1" step="1" class="input" placeholder="cth: 200000" value="${promo ? toNumber(promo.value) : ''}" />
          </div>
        </div>
        <label class="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-line hover:bg-stone-50">
          <input id="pr-active" type="checkbox" class="w-4 h-4 accent-brand" ${promo ? (promo.active ? 'checked' : '') : 'checked'} />
          <span class="text-xs font-bold text-stone-700">Aktifkan promo ini</span>
        </label>
        <p class="hint">Diskon rupiah berlaku per bulan sewa. Diskon persen dihitung dari total nilai sewa.</p>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="promo-form" class="btn-primary btn-sm" data-submit>${icon('Check', 'w-4 h-4')} Simpan promo</button>
    `,
    onMount(el, close) {
      el.querySelector('#promo-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          savePromo({
            id: promo?.id || null,
            name: el.querySelector('#pr-name').value,
            type: el.querySelector('#pr-type').value,
            value: toNumber(el.querySelector('#pr-value').value),
            active: el.querySelector('#pr-active').checked,
          });
          toast(promo ? 'Promo berhasil diperbarui.' : 'Promo baru berhasil ditambahkan.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
