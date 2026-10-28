import { rupiah } from '../core/format.js';
import { publishCatalog } from '../services/catalog.js';
import {
  addGalleryPhoto,
  galleryPhoto,
  getGallery,
  getGalleryItem,
  moveGalleryPhoto,
  removeGalleryPhoto,
  updateGalleryItem,
} from '../services/gallery.js';
import { getSettings } from '../services/settings.js';
import { emptyState, pageHeader } from '../ui/components.js';
import { delegate, esc, readImageAsDataUrl, setBusy } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction, openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

function itemCard(item, index, total) {
  const photo = galleryPhoto(item);
  const published = Boolean(item.photoUrl);
  return `
    <article class="card rounded-2xl overflow-hidden flex flex-col">
      <div class="relative aspect-[4/3] bg-brand-50">
        ${
          photo
            ? `<img src="${esc(photo)}" alt="${esc(item.caption || `Foto galeri ${index + 1}`)}" loading="lazy" class="w-full h-full object-cover" />`
            : `<div class="w-full h-full flex flex-col items-center justify-center gap-1 text-stone-400">
                ${icon('Image', 'w-8 h-8')}
                <span class="text-[10px] font-bold uppercase tracking-wider">Belum ada foto</span>
              </div>`
        }
        <span class="absolute left-2 top-2 ${published ? 'badge-green' : 'badge-amber'} shadow-sm">
          ${published ? 'Terbit' : 'Belum terbit'}
        </span>
        <div class="absolute right-2 top-2 flex flex-col gap-1">
          <button type="button" class="p-1.5 rounded-lg bg-white/90 text-stone-600 hover:text-brand" data-action="move" data-id="${item.id}" data-dir="-1" title="Naikkan" ${index === 0 ? 'disabled' : ''}>${icon('ChevronUp', 'w-3.5 h-3.5')}</button>
          <button type="button" class="p-1.5 rounded-lg bg-white/90 text-stone-600 hover:text-brand" data-action="move" data-id="${item.id}" data-dir="1" title="Turunkan" ${index === total - 1 ? 'disabled' : ''}>${icon('ChevronDown', 'w-3.5 h-3.5')}</button>
        </div>
      </div>
      <div class="p-4 flex flex-col flex-1">
        <p class="text-sm font-bold text-stone-800">${esc(item.caption || `Foto ${index + 1}`)}</p>
        <p class="text-[10px] text-stone-500 mt-0.5">${published ? 'Sudah tampil di landing page' : 'Klik Publikasikan agar tampil'}</p>
        <div class="mt-auto pt-3 flex flex-wrap justify-end gap-1">
          <button type="button" class="btn-outline btn-xs" data-action="edit" data-id="${item.id}">${icon('Pencil', 'w-3 h-3')} Edit</button>
          <button type="button" class="btn-ghost btn-xs text-rose-600" data-action="delete" data-id="${item.id}">${icon('Trash2', 'w-3.5 h-3.5')} Hapus</button>
        </div>
      </div>
    </article>
  `;
}

export function render(root) {
  const gallery = getGallery();
  const settings = getSettings();
  const published = gallery.filter((item) => item.photoUrl).length;

  root.innerHTML = `
    <div data-view="gallery" class="animate-in">
      ${pageHeader({
        eyebrow: 'Landing Content',
        title: 'Galeri Landing Page 🖼️',
        subtitle: 'Foto suasana kamar dan properti yang tampil di landing page. Tidak ada lagi katalog per kamar.',
        actions: `
          <button type="button" class="btn-outline btn-sm" data-action="publish">${icon('UploadCloud', 'w-4 h-4')} Publikasikan</button>
          <button type="button" class="btn-primary btn-sm" data-action="add">${icon('Plus', 'w-4 h-4')} Tambah Foto</button>
        `,
      })}

      <div class="grid sm:grid-cols-3 gap-3 mb-5">
        <div class="card p-4">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Total Foto</p>
          <p class="text-2xl font-black text-stone-800 mt-1">${gallery.length}</p>
        </div>
        <div class="card p-4">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Sudah Terbit</p>
          <p class="text-2xl font-black text-emerald-700 mt-1">${published}</p>
        </div>
        <div class="card p-4">
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Menunggu Publikasi</p>
          <p class="text-2xl font-black ${gallery.length - published > 0 ? 'text-amber-700' : 'text-stone-800'} mt-1">${gallery.length - published}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-line bg-white p-4 mb-5 text-xs text-stone-600 leading-relaxed">
        <b class="text-stone-800">Cara kerja:</b> unggah foto di sini, atur urutannya, lalu klik
        <b>Publikasikan</b>. Foto pertama menjadi gambar utama di bagian hero landing page.
        ${settings.catalogAdminKey ? '' : '<span class="block mt-1 text-rose-700 font-semibold">Kunci admin belum diisi — buka Pengaturan untuk mengisi kunci publikasi.</span>'}
      </div>

      ${
        gallery.length
          ? `<div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">${gallery
              .map((item, index) => itemCard(item, index, gallery.length))
              .join('')}</div>`
          : `<div class="card">${emptyState({
              iconName: 'Image',
              title: 'Galeri masih kosong',
              description:
                'Tambahkan foto kamar, area bersama, atau fasad properti. Foto akan tampil di landing page setelah dipublikasikan.',
              action: `<button type="button" class="btn-primary btn-sm" data-action="add">${icon('Plus', 'w-4 h-4')} Tambah Foto</button>`,
            })}</div>`
      }

      <div class="card p-5 mt-5">
        <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Ringkasan publikasi</p>
        <p class="text-sm text-stone-600 mt-1">
          Terakhir dipublikasikan:
          <b>${settings.catalogPublishedAt ? new Date(settings.catalogPublishedAt).toLocaleString('id-ID') : 'belum pernah'}</b>.
          Harga sewa tetap diatur di menu Pricelist. Deposit saat ini ${rupiah(settings.depositDefault || 0)}.
        </p>
      </div>
    </div>
  `;

  const scope = root.querySelector('[data-view="gallery"]');

  delegate(scope, 'click', '[data-action]', async (event, target) => {
    const action = target.dataset.action;
    const id = Number(target.dataset.id);

    if (action === 'add') {
      openUploadModal();
      return;
    }

    if (action === 'move') {
      moveGalleryPhoto(id, Number(target.dataset.dir));
      return;
    }

    if (action === 'edit') {
      openEditModal(id);
      return;
    }

    if (action === 'delete') {
      const approved = await confirmAction({
        title: 'Hapus foto galeri?',
        message: 'Foto ini akan dihapus dari galeri landing page setelah dipublikasikan ulang.',
        confirmText: 'Ya, hapus',
        danger: true,
      });
      if (!approved) return;
      removeGalleryPhoto(id);
      toast('Foto galeri dihapus.');
      return;
    }

    if (action === 'publish') {
      const values = getSettings();
      if (!values.catalogAdminKey) {
        toast('Isi kunci admin di Pengaturan terlebih dahulu.', 'error');
        return;
      }
      setBusy(target, true, 'Mempublikasikan…');
      try {
        const result = await publishCatalog({
          adminKey: values.catalogAdminKey,
          onProgress: ({ label }) => {
            if (label) target.textContent = label;
          },
        });
        toast(
          `Galeri berhasil dipublikasikan${result.uploadedPhotos ? ` (${result.uploadedPhotos} foto diunggah)` : ''}.`,
        );
      } catch (error) {
        toast(error.message, 'error');
      } finally {
        setBusy(target, false);
      }
    }
  });
}

function openUploadModal() {
  let files = [];
  let processing = false;

  openModal({
    title: 'Tambah Foto Galeri',
    subtitle: 'Bisa pilih beberapa foto sekaligus. Foto otomatis dikompres.',
    size: 'md',
    body: `
      <div class="space-y-4">
        <div>
          <label class="label" for="gal-files">Pilih foto</label>
          <input id="gal-files" type="file" accept="image/jpeg,image/png,image/webp" multiple class="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-gold" />
          <p class="hint mt-1.5">JPG/PNG/WebP. Maksimal 12 MB per file.</p>
        </div>
        <div id="gal-preview" class="grid grid-cols-3 gap-2"></div>
        <div>
          <label class="label" for="gal-caption">Keterangan (opsional)</label>
          <input id="gal-caption" type="text" class="input" placeholder="cth: Kamar Deluxe lantai 2" />
        </div>
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-save>${icon('Upload', 'w-4 h-4')} Simpan foto</button>
    `,
    onMount(el, close) {
      const input = el.querySelector('#gal-files');
      const preview = el.querySelector('#gal-preview');
      const saveButton = el.querySelector('[data-save]');

      input?.addEventListener('change', async () => {
        const selected = [...(input.files || [])];
        if (!selected.length) return;
        processing = true;
        setBusy(saveButton, true, 'Mengompres foto…');
        try {
          files = [];
          for (const file of selected) {
            files.push(await readImageAsDataUrl(file, { maxDimension: 1200, quality: 0.66 }));
          }
          preview.innerHTML = files
            .map(
              (src, index) =>
                `<div class="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-line">
                  <img src="${esc(src)}" alt="Pratinjau ${index + 1}" class="w-full h-full object-cover" />
                </div>`,
            )
            .join('');
          toast(`${files.length} foto siap disimpan.`);
        } catch (error) {
          files = [];
          preview.innerHTML = '';
          toast(error.message, 'error');
        } finally {
          processing = false;
          setBusy(saveButton, false);
        }
      });

      saveButton?.addEventListener('click', () => {
        if (processing) return;
        if (!files.length) {
          toast('Pilih foto terlebih dahulu.', 'warning');
          return;
        }
        const caption = el.querySelector('#gal-caption').value;
        try {
          files.forEach((photo, index) => {
            addGalleryPhoto({
              photo,
              caption: index === 0 ? caption : '',
            });
          });
          toast(`${files.length} foto ditambahkan. Klik Publikasikan agar tampil di landing page.`);
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}

function openEditModal(id) {
  const item = getGalleryItem(id);
  if (!item) return;
  let nextPhoto = null;

  openModal({
    title: 'Edit Foto Galeri',
    size: 'md',
    body: `
      <div class="space-y-4">
        <div id="gal-edit-preview" class="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-line">
          ${galleryPhoto(item) ? `<img src="${esc(galleryPhoto(item))}" alt="Foto galeri" class="w-full h-full object-cover" />` : ''}
        </div>
        <div>
          <label class="label" for="gal-edit-file">Ganti foto (opsional)</label>
          <input id="gal-edit-file" type="file" accept="image/jpeg,image/png,image/webp" class="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-gold" />
        </div>
        <div>
          <label class="label" for="gal-edit-caption">Keterangan</label>
          <input id="gal-edit-caption" type="text" class="input" value="${esc(item.caption || '')}" />
        </div>
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="button" class="btn-primary btn-sm" data-save>${icon('Check', 'w-4 h-4')} Simpan</button>
    `,
    onMount(el, close) {
      el.querySelector('#gal-edit-file')?.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          nextPhoto = await readImageAsDataUrl(file, { maxDimension: 1200, quality: 0.66 });
          el.querySelector('#gal-edit-preview').innerHTML =
            `<img src="${esc(nextPhoto)}" alt="Pratinjau foto baru" class="w-full h-full object-cover" />`;
          toast('Foto baru siap disimpan.');
        } catch (error) {
          toast(error.message, 'error');
        }
      });

      el.querySelector('[data-save]')?.addEventListener('click', () => {
        try {
          updateGalleryItem(id, {
            caption: el.querySelector('#gal-edit-caption').value,
            ...(nextPhoto ? { photo: nextPhoto } : {}),
          });
          toast('Foto galeri diperbarui. Publikasikan ulang agar perubahan tampil.');
          close();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    },
  });
}
