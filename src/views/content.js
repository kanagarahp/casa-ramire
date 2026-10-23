import { DEFAULT_TEMPLATES, TEMPLATE_VARIABLES } from '../core/constants.js';
import {
  SAMPLE_CONTEXT,
  getTemplates,
  saveTemplates,
} from '../services/templates.js';
import { cardHeader, pageHeader } from '../ui/components.js';
import { delegate, esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { confirmAction } from '../ui/modal.js';
import { toast } from '../ui/toast.js';

const TABS = [
  { id: 'tagihan', label: 'Tagihan Sewa', iconName: 'ReceiptText', description: 'Dikirim saat menerbitkan tagihan sewa.' },
  { id: 'manual', label: 'Invoice Layanan', iconName: 'FileText', description: 'Untuk invoice non-sewa seperti laundry atau perbaikan.' },
  { id: 'reminder', label: 'Pengingat Kontrak', iconName: 'CalendarClock', description: 'Pengingat sebelum kontrak sewa berakhir.' },
];

let activeType = 'tagihan';
let drafts = null;

function getDrafts() {
  if (!drafts) drafts = getTemplates();
  return drafts;
}

function renderText(template) {
  return String(template || '').replace(/\{([a-z_]+)\}/gi, (match, token) => {
    const value = SAMPLE_CONTEXT[token];
    return value === undefined || value === null ? match : String(value);
  });
}

function renderTabs() {
  return TABS.map(
    (tab) => `
    <button type="button" class="${activeType === tab.id ? 'chip-active' : 'chip-idle'} flex items-center gap-1.5" data-tab="${tab.id}">
      ${icon(tab.iconName, 'w-3.5 h-3.5')} ${tab.label}
    </button>`,
  ).join('');
}

function activeTabMeta() {
  return TABS.find((tab) => tab.id === activeType) || TABS[0];
}

export function render(root) {
  const store = getDrafts();
  const tab = activeTabMeta();

  root.innerHTML = `
    <div data-view="content" class="animate-in">
      ${pageHeader({
        eyebrow: 'Communication Studio',
        title: 'Konten & WA Preview 💬',
        subtitle: 'Kelola template pesan otomatis dan lihat hasilnya sebelum dikirim ke penghuni.',
        actions: `
          <button type="button" class="btn-outline btn-sm" data-action="reset-template">${icon('RotateCcw', 'w-4 h-4')} Reset template</button>
          <button type="button" class="btn-primary btn-sm" data-action="save-templates">${icon('Check', 'w-4 h-4')} Simpan semua</button>
        `,
      })}

      <div class="flex flex-wrap gap-2 mb-5 border-b border-line pb-3" id="content-tabs">
        ${renderTabs()}
      </div>

      <div class="grid lg:grid-cols-2 gap-6 items-start">
        <div class="card overflow-hidden">
          ${cardHeader({
            title: 'Editor Template',
            description: 'Gunakan variabel agar pesan terisi otomatis.',
            actions: `<span class="badge-gold" id="char-count">${String(store[activeType] || '').length} karakter</span>`,
          })}
          <div class="p-5 space-y-4">
            <div>
              <label class="label" for="template-text">Isi pesan — <span id="active-template-label">${esc(tab.label)}</span></label>
              <textarea id="template-text" rows="13" class="input font-mono text-[12px] leading-relaxed" spellcheck="false">${esc(store[activeType] || '')}</textarea>
              <p class="hint mt-2">${esc(tab.description)}</p>
            </div>

            <div>
              <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 mb-2">Sisipkan variabel</p>
              <div class="flex flex-wrap gap-1.5">
                ${TEMPLATE_VARIABLES.map(
                  (variable) => `
                  <button type="button" class="badge-gray hover:bg-brand hover:text-white hover:border-brand transition" data-token="${esc(variable.token)}" title="${esc(variable.desc)}">
                    ${icon('Plus', 'w-3 h-3')} ${esc(variable.token)}
                  </button>`,
                ).join('')}
              </div>
            </div>

            <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              ${icon('Info', 'w-3.5 h-3.5 shrink-0 mt-0.5')}
              <span>Pesan hanya disiapkan sebagai tautan WhatsApp — tidak dikirim otomatis oleh aplikasi. Pastikan nomor penghuni sudah benar.</span>
            </div>
          </div>
        </div>

        <div class="card overflow-hidden">
          ${cardHeader({
            title: 'Preview Pesan',
            description: 'Tampilan perkiraan di WhatsApp penerima.',
            actions: `<button type="button" class="btn-outline btn-xs" data-action="copy">${icon('Copy', 'w-3.5 h-3.5')} Salin</button>`,
          })}
          <div class="p-5">
            <div class="rounded-2xl bg-[#e5ddd5] p-4 min-h-[300px] flex flex-col justify-end">
              <div class="max-w-[92%] self-start">
                <div class="rounded-xl rounded-tl-sm bg-white px-3.5 py-3 shadow-sm">
                  <p id="preview-text" class="text-[12px] text-stone-800 whitespace-pre-line leading-relaxed">${esc(renderText(store[activeType]))}</p>
                  <p class="text-[9px] text-stone-600 text-right mt-1.5">${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ✓✓</p>
                </div>
                <p class="text-[9px] text-stone-500 mt-1.5">Casa Ramire · otomatis dari template</p>
              </div>
            </div>

            <div class="mt-4 rounded-xl border border-line bg-cream/60 p-3">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-2">Data contoh</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                ${Object.entries(SAMPLE_CONTEXT)
                  .map(
                    ([key, value]) => `
                    <div class="flex justify-between gap-2">
                      <span class="text-stone-600 font-mono">{${esc(key)}}</span>
                      <span class="font-semibold text-stone-700 truncate">${esc(value)}</span>
                    </div>`,
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const scope = root.querySelector('[data-view="content"]');
  const textarea = scope.querySelector('#template-text');
  const preview = scope.querySelector('#preview-text');
  const counter = scope.querySelector('#char-count');

  const syncDraft = () => {
    getDrafts()[activeType] = textarea.value;
  };

  const refreshPreview = () => {
    syncDraft();
    preview.textContent = renderText(getDrafts()[activeType]);
    counter.textContent = `${textarea.value.length} karakter`;
  };

  const repaintTabs = () => {
    scope.querySelector('#content-tabs').innerHTML = renderTabs();
    scope.querySelector('#active-template-label').textContent = activeTabMeta().label;
    scope.querySelector('#template-text').closest('.space-y-4').querySelector('.hint').textContent =
      activeTabMeta().description;
  };

  delegate(scope, 'click', '[data-tab]', (event, target) => {
    syncDraft();
    activeType = target.dataset.tab;
    textarea.value = getDrafts()[activeType] || '';
    repaintTabs();
    refreshPreview();
  });

  textarea.addEventListener('input', refreshPreview);

  scope.querySelectorAll('[data-token]').forEach((button) => {
    button.addEventListener('click', () => {
      const token = button.dataset.token;
      const start = textarea.selectionStart ?? textarea.value.length;
      const end = textarea.selectionEnd ?? textarea.value.length;
      textarea.value = `${textarea.value.slice(0, start)}${token}${textarea.value.slice(end)}`;
      textarea.focus();
      textarea.setSelectionRange(start + token.length, start + token.length);
      refreshPreview();
    });
  });

  scope.querySelector('[data-action="save-templates"]')?.addEventListener('click', () => {
    syncDraft();
    try {
      saveTemplates(getDrafts());
      drafts = getTemplates();
      toast('Template pesan berhasil disimpan.');
    } catch (error) {
      toast(error.message, 'error');
    }
  });

  scope.querySelector('[data-action="reset-template"]')?.addEventListener('click', async () => {
    const approved = await confirmAction({
      title: 'Reset template ini?',
      message: `Template <b>${esc(activeTabMeta().label)}</b> akan dikembalikan ke bawaan. Perubahan yang belum disimpan akan hilang.`,
      confirmText: 'Ya, reset',
      danger: true,
    });
    if (!approved) return;
    drafts = getDrafts();
    drafts[activeType] = DEFAULT_TEMPLATES[activeType];
    textarea.value = drafts[activeType];
    refreshPreview();
    toast('Template dikembalikan ke bawaan. Tekan Simpan untuk menerapkan.', 'warning');
  });

  scope.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    const text = renderText(getDrafts()[activeType]);
    try {
      await navigator.clipboard.writeText(text);
      toast('Pesan berhasil disalin.');
    } catch {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', '');
      helper.className = 'fixed opacity-0 pointer-events-none';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
      toast('Pesan berhasil disalin.');
    }
  });
}
