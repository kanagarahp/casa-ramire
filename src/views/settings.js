import { formatDateTime } from '../core/format.js';
import {
  factoryReset,
  getState,
  replaceState,
  resetOperationalData,
} from '../core/store.js';
import { changeOwnPassword, getActiveUser, isOwner } from '../services/auth.js';
import { publishCatalog } from '../services/catalog.js';
import { updateSettings } from '../services/settings.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { downloadFile, esc, readFileAsText, setBusy } from '../ui/dom.js';
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
  const settings = state.settings || {};
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

        ${section({
          iconName: 'Globe2',
          title: 'Landing page & katalog publik',
          description: 'Atur informasi yang tampil di casaramire.com dan publikasikan katalog kamar.',
          body: `
            <form id="settings-catalog-form" class="space-y-3">
              <div class="grid sm:grid-cols-2 gap-3">
                <div>
                  <label class="label" for="set-wa">Nomor WhatsApp admin</label>
                  <input id="set-wa" type="tel" class="input" value="${esc(settings.whatsapp || '')}" placeholder="cth: 08123456789" />
                  <p class="hint mt-1">Dipakai untuk tombol "Chat Admin" di landing page.</p>
                </div>
                <div>
                  <label class="label" for="set-address">Alamat / lokasi</label>
                  <input id="set-address" type="text" class="input" value="${esc(settings.address || '')}" placeholder="cth: Jl. Melati No. 10" />
                </div>
              </div>

              <div>
                <label class="label" for="set-tagline">Tagline singkat</label>
                <input id="set-tagline" type="text" class="input" value="${esc(settings.tagline || '')}" placeholder="cth: Kos nyaman, tenang, dan strategis." />
              </div>

              <div>
                <label class="label" for="set-description">Deskripsi properti</label>
                <textarea id="set-description" rows="3" class="input" placeholder="Ceritakan suasana dan keunggulan Casa Ramire…">${esc(settings.description || '')}</textarea>
              </div>

              <div>
                <label class="label" for="set-facilities">Fasilitas</label>
                <textarea id="set-facilities" rows="2" class="input" placeholder="AC, WiFi, kasur, lemari…">${esc(settings.facilities || '')}</textarea>
                <p class="hint mt-1">Pisahkan dengan koma atau baris baru.</p>
              </div>

              <div>
                <label class="label" for="set-maps">Link Google Maps (opsional)</label>
                <input id="set-maps" type="url" class="input" value="${esc(settings.mapsUrl || '')}" placeholder="https://maps.google.com/…" />
              </div>

              <div class="rounded-xl border border-line bg-cream/60 p-3">
                <label class="label" for="set-catalog-key">Kunci publikasi katalog</label>
                <input id="set-catalog-key" type="password" class="input" value="${esc(settings.catalogAdminKey || '')}" placeholder="Masukkan kunci dari owner" autocomplete="off" />
                <p class="hint mt-1">Kunci ini hanya disimpan di perangkat ini dan dipakai untuk mengunggah foto serta mempublikasikan katalog. Jangan bagikan.</p>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button type="submit" class="btn-primary btn-sm">${icon('Save', 'w-4 h-4')} Simpan profil</button>
                <button type="button" class="btn-gold btn-sm" data-action="publish-catalog">${icon('UploadCloud', 'w-4 h-4')} Publikasikan katalog</button>
                <a href="#/home" class="btn-outline btn-sm" data-modal-close>${icon('ExternalLink', 'w-4 h-4')} Buka landing page</a>
              </div>
              <p class="hint" data-published-at>
                Terakhir dipublikasikan: ${settings.catalogPublishedAt ? formatDateTime(settings.catalogPublishedAt) : 'belum pernah'}.
              </p>
            </form>
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

      const catalogForm = el.querySelector('#settings-catalog-form');

      const readCatalogForm = () => ({
        whatsapp: el.querySelector('#set-wa').value,
        address: el.querySelector('#set-address').value,
        tagline: el.querySelector('#set-tagline').value,
        description: el.querySelector('#set-description').value,
        facilities: el.querySelector('#set-facilities').value,
        mapsUrl: el.querySelector('#set-maps').value,
        catalogAdminKey: el.querySelector('#set-catalog-key').value,
      });

      const saveCatalogProfile = () => {
        const values = readCatalogForm();
        updateSettings(values);
        return values;
      };

      catalogForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        saveCatalogProfile();
        toast('Profil landing page berhasil disimpan.');
      });

      el.querySelector('[data-action="publish-catalog"]')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        const values = saveCatalogProfile();

        if (!values.whatsapp) {
          toast('Isi nomor WhatsApp admin agar tombol chat di landing page berfungsi.', 'warning');
          el.querySelector('#set-wa').focus();
          return;
        }

        if (!values.catalogAdminKey) {
          toast('Isi kunci publikasi katalog terlebih dahulu.', 'error');
          el.querySelector('#set-catalog-key').focus();
          return;
        }

        setBusy(button, true, 'Mempublikasikan katalog…');
        try {
          const result = await publishCatalog({
            adminKey: values.catalogAdminKey,
            onProgress: ({ label }) => {
              if (label) button.textContent = label;
            },
          });

          const status = el.querySelector('[data-published-at]');
          if (status) {
            status.textContent = `Terakhir dipublikasikan: ${formatDateTime(result.updatedAt)}.`;
          }
          toast(
            `Katalog berhasil dipublikasikan${result.uploadedPhotos ? ` (${result.uploadedPhotos} foto diunggah)` : ''}.`,
          );
        } catch (error) {
          toast(error.message, 'error');
        } finally {
          setBusy(button, false);
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
            'Semua data termasuk akun kustom dan pengaturan akan dikembalikan ke kondisi awal (akun demo owner/admin). Tindakan ini tidak dapat dibatalkan.',
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
