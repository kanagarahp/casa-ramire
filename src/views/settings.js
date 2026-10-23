import { formatDateTime } from '../core/format.js';
import {
  factoryReset,
  getState,
  replaceState,
  resetOperationalData,
} from '../core/store.js';
import { changeOwnPassword, getActiveUser, isOwner } from '../services/auth.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { downloadFile, readFileAsText } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { toast } from '../ui/toast.js';

function section({ iconName, title, description, body }) {
  return `
    <section class="card p-5">
      <div class="flex items-start gap-3">
        <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">
          ${icon(iconName, 'w-5 h-5')}
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="font-extrabold text-stone-800 text-sm">${title}</h2>
          <p class="text-xs text-stone-500 mt-0.5">${description}</p>
          <div class="mt-4">${body}</div>
        </div>
      </div>
    </section>
  `;
}

export function openSettingsModal() {
  const user = getActiveUser();
  if (!user) return;
  const state = getState();
  const owner = isOwner();

  openModal({
    title: 'Pengaturan',
    subtitle: 'Akun, cadangan data, dan pemeliharaan sistem',
    size: 'lg',
    body: `
      <div class="space-y-4">
        ${section({
          iconName: 'KeyRound',
          title: 'Keamanan akun',
          description: 'Ganti password Anda secara berkala.',
          body: `
            <form id="settings-password-form" class="space-y-3" novalidate>
              <div class="grid sm:grid-cols-2 gap-3">
                <div>
                  <label class="label" for="pwd-current">Password saat ini</label>
                  <input id="pwd-current" type="password" class="input" autocomplete="current-password" required />
                </div>
                <div>
                  <label class="label" for="pwd-new">Password baru</label>
                  <input id="pwd-new" type="password" class="input" autocomplete="new-password" placeholder="Minimal 6 karakter" required />
                </div>
              </div>
              <div>
                <label class="label" for="pwd-confirm">Konfirmasi password baru</label>
                <input id="pwd-confirm" type="password" class="input" autocomplete="new-password" required />
              </div>
              <button type="submit" class="btn-primary btn-sm">
                ${icon('Check', 'w-4 h-4')} Simpan password
              </button>
            </form>
          `,
        })}

        ${section({
          iconName: 'DatabaseBackup',
          title: 'Cadangan & pemulihan data',
          description: `Terakhir diperbarui: ${formatDateTime(state.meta?.updatedAt)}`,
          body: `
            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn-outline btn-sm" data-action="export-backup">
                ${icon('Download', 'w-4 h-4')} Unduh backup JSON
              </button>
              <label class="btn-outline btn-sm cursor-pointer">
                ${icon('Upload', 'w-4 h-4')} Pulihkan dari file
                <input type="file" accept="application/json,.json" class="hidden" data-import-input />
              </label>
            </div>
            <p class="hint mt-2">Backup mencakup seluruh data kamar, penghuni, tagihan, pengeluaran, dan pengaturan. Simpan file di tempat aman.</p>
          `,
        })}

        ${
          owner
            ? section({
                iconName: 'ShieldCheck',
                title: 'Pemeliharaan data',
                description: 'Aksi di bawah ini tidak dapat dibatalkan. Unduh backup terlebih dahulu.',
                body: `
                  <div class="flex flex-wrap gap-2">
                    <button type="button" class="btn-outline btn-sm" data-action="reset-operational">
                      ${icon('RotateCcw', 'w-4 h-4')} Reset data operasional
                    </button>
                    <button type="button" class="btn-danger-soft btn-sm" data-action="factory-reset">
                      ${icon('AlertTriangle', 'w-4 h-4')} Factory reset
                    </button>
                  </div>
                  <p class="hint mt-2">Reset operasional mengosongkan kamar, penghuni, tagihan, dan pengeluaran — konfigurasi & akun tetap. Factory reset mengembalikan semuanya ke kondisi awal.</p>
                `,
              })
            : ''
        }

        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs text-stone-500 leading-relaxed">
          <p class="font-bold text-stone-700 mb-1">Tentang penyimpanan</p>
          Aplikasi ini menyimpan data di <code class="font-mono text-[11px] bg-white border border-line rounded px-1 py-0.5">localStorage</code> browser. Data tidak dikirim ke server. Gunakan backup rutin dan jangan membersihkan data situs ini tanpa cadangan.
        </div>
      </div>
    `,
    footer: `<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,
    onMount(el, close) {
      const passwordForm = el.querySelector('#settings-password-form');
      passwordForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const current = el.querySelector('#pwd-current').value;
        const next = el.querySelector('#pwd-new').value;
        const confirmation = el.querySelector('#pwd-confirm').value;
        if (next !== confirmation) {
          toast('Konfirmasi password tidak cocok.', 'error');
          return;
        }
        try {
          changeOwnPassword(current, next);
          passwordForm.reset();
          toast('Password berhasil diperbarui.');
        } catch (error) {
          toast(error.message, 'error');
        }
      });

      el.querySelector('[data-action="export-backup"]')?.addEventListener('click', () => {
        const snapshot = getState();
        const stamp = new Date().toISOString().slice(0, 10);
        downloadFile(`casa-ramire-backup-${stamp}.json`, JSON.stringify(snapshot, null, 2));
        toast('Backup berhasil diunduh.');
      });

      const importInput = el.querySelector('[data-import-input]');
      importInput?.addEventListener('change', async () => {
        const file = importInput.files?.[0];
        if (!file) return;
        try {
          const text = await readFileAsText(file);
          const parsed = JSON.parse(text);
          if (!parsed || !Array.isArray(parsed.rooms) || !Array.isArray(parsed.users)) {
            throw new Error('File backup tidak valid.');
          }

          const approved = await confirmAction({
            title: 'Pulihkan data dari backup?',
            message: 'Seluruh data saat ini akan <b>diganti</b> dengan isi file backup. Lanjutkan?',
            confirmText: 'Ya, pulihkan',
            danger: true,
          });
          if (!approved) return;

          const currentSession = getState().session;
          replaceState({ ...parsed, session: parsed.session || currentSession });
          toast('Data berhasil dipulihkan dari backup.');
          close();
        } catch (error) {
          toast(error.message || 'Gagal membaca file backup.', 'error');
        } finally {
          importInput.value = '';
        }
      });

      el.querySelector('[data-action="reset-operational"]')?.addEventListener('click', async () => {
        const approved = await confirmAction({
          title: 'Reset data operasional?',
          message:
            'Kamar akan dikosongkan dan data penghuni, tagihan, invoice, serta pengeluaran dihapus. Akun, pricelist, add-on, promo, dan template tetap disimpan.',
          confirmText: 'Ya, reset',
          danger: true,
        });
        if (!approved) return;
        resetOperationalData();
        toast('Data operasional berhasil direset.');
        close();
      });

      el.querySelector('[data-action="factory-reset"]')?.addEventListener('click', async () => {
        const approved = await confirmAction({
          title: 'Factory reset seluruh aplikasi?',
          message:
            'Semua data termasuk akun kustom dan pengaturan akan dikembalikan ke kondisi awal (akun demo owner/rian). Tindakan ini tidak dapat dibatalkan.',
          confirmText: 'Ya, factory reset',
          danger: true,
        });
        if (!approved) return;
        factoryReset();
        toast('Aplikasi dikembalikan ke kondisi awal.', 'warning');
        close();
      });
    },
  });
}
