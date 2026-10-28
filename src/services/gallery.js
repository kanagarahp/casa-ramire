import { nextId } from '../core/id.js';
import { getState, update } from '../core/store.js';

/**
 * Landing-page gallery.
 *
 * Photos are stored locally as compressed data URLs while the owner edits, then
 * uploaded to `/api/catalog/photo` when the catalog is published. The public
 * landing page only reads the published URL.
 */

export function getGallery() {
  return [...(getState().gallery || [])];
}

export function getGalleryItem(id) {
  return (getState().gallery || []).find((item) => String(item.id) === String(id)) || null;
}

export function galleryPhoto(item) {
  return String(item?.photo || item?.photoUrl || '').trim();
}

export function publishedGallery() {
  return getGallery().filter((item) => galleryPhoto(item));
}

function validatePhoto(value) {
  const photo = String(value || '').trim();
  if (!photo) return '';
  const isDataImage = /^data:image\/(jpeg|png|webp);base64,/i.test(photo);
  const isRemoteImage = /^https?:\/\//i.test(photo);
  const isCatalogPhoto = photo.startsWith('/api/catalog/photo');
  if (!isDataImage && !isRemoteImage && !isCatalogPhoto) {
    throw new Error('Format foto tidak didukung.');
  }
  return photo;
}

function ensureQuota(previousLength, nextLength) {
  // localStorage is typically limited to ~5 MB. Leave room for operational data.
  const currentLength = JSON.stringify(getState()).length;
  if (currentLength - previousLength + nextLength > 4_600_000) {
    throw new Error(
      'Penyimpanan foto hampir penuh. Hapus beberapa foto galeri atau gunakan foto yang lebih kecil.',
    );
  }
}

export function addGalleryPhoto({ photo, caption = '' } = {}) {
  const value = validatePhoto(photo);
  if (!value) throw new Error('Pilih foto terlebih dahulu.');
  ensureQuota(0, value.length);

  let created = null;
  update((draft) => {
    draft.gallery = Array.isArray(draft.gallery) ? draft.gallery : [];
    created = {
      id: nextId(draft.gallery),
      caption: String(caption || '').trim(),
      photo: value,
      photoUrl: '',
      createdAt: new Date().toISOString(),
    };
    draft.gallery.push(created);
  });
  return created;
}

export function updateGalleryItem(id, patch = {}) {
  const item = getGalleryItem(id);
  if (!item) throw new Error('Foto galeri tidak ditemukan.');
  const previousPhoto = galleryPhoto(item);
  const nextPhoto = patch.photo !== undefined ? validatePhoto(patch.photo) : previousPhoto;
  ensureQuota(previousPhoto.length, nextPhoto.length);

  update((draft) => {
    const target = (draft.gallery || []).find((entry) => String(entry.id) === String(id));
    if (!target) return;
    if (patch.caption !== undefined) target.caption = String(patch.caption).trim();
    if (patch.photo !== undefined) {
      target.photo = nextPhoto;
      // A replaced photo needs a fresh public upload.
      if (nextPhoto !== previousPhoto) target.photoUrl = '';
    }
    target.updatedAt = new Date().toISOString();
  });
  return getGalleryItem(id);
}

export function removeGalleryPhoto(id) {
  update((draft) => {
    draft.gallery = (draft.gallery || []).filter((item) => String(item.id) !== String(id));
  });
}

/** Move a gallery photo up (-1) or down (+1). */
export function moveGalleryPhoto(id, direction) {
  update((draft) => {
    const list = draft.gallery || [];
    const index = list.findIndex((item) => String(item.id) === String(id));
    const next = index + Number(direction || 0);
    if (index < 0 || next < 0 || next >= list.length) return;
    const [item] = list.splice(index, 1);
    list.splice(next, 0, item);
  });
}
