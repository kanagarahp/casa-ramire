/** Tiny DOM/utility helpers shared by all views. */

export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape user-controlled text before inserting it into an HTML template. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);
}

/** Event delegation helper. */
export function delegate(root, eventType, selector, handler) {
  const listener = (event) => {
    const target = event.target.closest(selector);
    if (target && root.contains(target)) handler(event, target);
  };
  root.addEventListener(eventType, listener);
  return () => root.removeEventListener(eventType, listener);
}

export function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export function debounce(fn, wait = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function downloadFile(filename, content, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Read an image file and return a compressed JPEG data URL.
 * Used for the room cover photos on the public catalog.
 */
export function readImageAsDataUrl(file, { maxDimension = 900, quality = 0.62 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) {
      reject(new Error('Pilih foto berformat JPG, PNG, atau WebP.'));
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      reject(new Error('Ukuran file foto maksimal 12 MB.'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      try {
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        let nextQuality = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', nextQuality);

        // Keep each image well below the API/localStorage limits.
        while (dataUrl.length > 380_000 && nextQuality > 0.32) {
          nextQuality -= 0.07;
          dataUrl = canvas.toDataURL('image/jpeg', nextQuality);
        }

        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Gagal membaca file foto.'));
    };

    image.src = objectUrl;
  });
}

export function setBusy(button, busy, busyLabel = 'Memproses…') {
  if (!button) return;
  if (busy) {
    button.dataset.originalHtml = button.innerHTML;
    button.disabled = true;
    button.textContent = busyLabel;
  } else {
    button.disabled = false;
    if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
      delete button.dataset.originalHtml;
    }
  }
}

export function scrollTop(el = document.getElementById('main-scroll')) {
  el?.scrollTo({ top: 0, behavior: 'smooth' });
}
