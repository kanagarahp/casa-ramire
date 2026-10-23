import { rupiah, toNumber } from '../core/format.js';
import {
  deleteAddon,
  getAddons,
  saveAddon,
  toggleAddon,
} from '../services/addons.js';
import { emptyRow, pageHeader, statCard } from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

export function render(root) {
  const addons = getAddons();
  const active = addons.filter((addon) => addon.active);
  const potential = active.reduce((sum, addon) => sum + toNumber(addon.price), 0);

  root.innerHTML = `
    <div data-view="addons" class="animate-in">
      ${pageHeader({
        eyebrow: 'Services & Amenities',
        title: 'Master Layanan Add-On 🚗',
        subtitle: 'Atur layanan tambahan yang bisa dipasang ke kontrak penghuni.',
        actions: `<button type="button" class="btn-primary btn-sm" data-action="add-addon">${icon('Plus', 'w-4 h-4')} Tambah Add-On</button>`,
      })}

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        ${statCard({ label: 'Total Layanan', value: addons.length, iconName: 'Sparkles' })}
        ${statCard({ label: 'Layanan Aktif', value: active.length, iconName: 'BadgeCheck', tone: 'green' })}
        ${statCard({ label: 'Potensi / Bulan', value: rupiah(potential), iconName: 'Coins', tone: 'brand', hint: 'Jika semua add-on terpasang' })}
        ${statCard({ label: 'Rata-rata Tarif', value: rupiah(active.length ? potential / active.length : 0), iconName: 'Percent', tone: 'amber' })}
      </div>

      <div class="card overflow-hidden">
        <div class="px-5 py-4 border-b border-line">
          <h3 class="font-extrabold text-stone-800 text-sm">Daftar Layanan</h3>
          <p class="text-xs text-stone-500 mt-0.5">Tarif add-on dihitung per bulan dan otomatis masuk ke tagihan sewa.</p>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Nama Add-On</th><th>Tarif / Bulan</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
            <tbody>
              ${
                addons.length
                  ? addons
                      .map(
                        (addon) => `
                        <tr>
                          <td>
                            <div class="flex items-center gap-2.5">
                              <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">${icon('Sparkles', 'w-4 h-4')}</span>
                              <span class="font-bold text-stone-800">${esc(addon.name)}</span>
                            </div>
                          </td>
                          <td class="font-black text-stone-800 whitespace-nowrap">${rupiah(addon.price)}</td>
                          <td>${addon.active ? '<span class="badge-green">Aktif</span>' : '<span class="badge-gray">Nonaktif</span>'}</td>
                          <td>
                            <div class="flex items-center justify-end gap-1">
                              <button type="button" class="btn-outline btn-xs" data-action="toggle" data-id="${addon.id}">${addon.active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                              <button type="button" class="btn-ghost btn-xs" data-action="edit" data-id="${addon.id}" title="Edit add-on">${icon('Pencil', 'w-3.5 h-3.5')}</button>
                              <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${addon.id}" title="Hapus add-on">${icon('Trash2', 'w-3.5 h-3.5')}</button>
                            </div>
                          </td>
                        </tr>`,
                      )
                      .join('')
                  : emptyRow(4, 'Belum ada layanan add-on. Tambahkan layanan pertama Anda.')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const scope = root.querySelector('[data-view="addons"]');
  delegate(scope, 'click', '[data-action]', async (event, target) => {
    const action = target.dataset.action;
    const id = Number(target.dataset.id);

    if (action === 'add-addon') {
      openAddonModal();
      return;
    }
    if (action === 'edit') {
      openAddonModal(id);
      return;
    }
    if (action === 'toggle') {
      toggleAddon(id);
      toast('Status layanan diperbarui.');
      return;
    }
    if (action === 'delete') {
      const addon = addons.find((item) => item.id === id);
      const approved = await confirmAction({
        title: 'Hapus layanan add-on?',
        message: `Layanan <b>${esc(addon?.name || '')}</b> akan dihapus dari master. Kontrak yang sudah berjalan tetap menyimpan data add-on.`,
        confirmText: 'Ya, hapus',
        danger: true,
      });
      if (!approved) return;
      deleteAddon(id);
      toast('Layanan add-on berhasil dihapus.');
    }
  });
}

function openAddonModal(addonId = null) {
  const addon = addonId ? getAddons().find((item) => item.id === addonId) : null;

  openModal({
    title: addon ? 'Edit Add-On' : 'Tambah Master Add-On',
    size: 'sm',
    body: `
      <form id="addon-form" class="space-y-4" novalidate>
        <div>
          <label class="label" for="ad-name">Nama layanan</label>
          <input id="ad-name" type="text" class="input" placeholder="cth: Parkir Mobil" value="${esc(addon?.name || '')}" />
        </div>
        <div>
          <label class="label" for="ad-price">Tarif per bulan (Rp)</label>
          <input id="ad-price" type="number" min="0" step="1000" class="input" placeholder="cth: 100000" value="${addon ? toNumber(addon.price) : ''}" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-line hover:bg-stone-50">
          <input id="ad-active" type="checkbox" class="w-4 h-4 accent-brand" ${addon ? (addon.active ? 'checked' : '') : 'checked'} />
          <span class="text-xs font-bold text-stone-700">Layanan tersedia untuk dipilih</span>
        </label>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="addon-form" class="btn-primary btn-sm" data-submit>${icon('Check', 'w-4 h-4')} Simpan</button>
    `,
    onMount(el, close) {
      el.querySelector('#addon-form').addEventListener('submit', (event) => {
        event.preventDefault();
        try {
          saveAddon({
            id: addon?.id || null,
            name: el.querySelector('#ad-name').value,
            price: toNumber(el.querySelector('#ad-price').value),
            active: el.querySelector('#ad-active').checked,
          });
          toast(addon ? 'Add-on berhasil diperbarui.' : 'Add-on baru berhasil ditambahkan.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
