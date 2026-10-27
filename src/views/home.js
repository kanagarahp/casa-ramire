import { PERIODS } from '../core/constants.js';
import { rupiah, waLink } from '../core/format.js';
import { getActiveUser } from '../services/auth.js';
import { buildCatalogSnapshot, fetchPublishedCatalog } from '../services/catalog.js';
import { brandMark } from '../ui/brand.js';
import { esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openSettingsModal } from './settings.js';

const MONTH_PERIODS = PERIODS.filter((period) => period.kind === 'months');

const FALLBACK_FACILITIES = [
  'AC',
  'WiFi',
  'Kasur',
  'Lemari',
  'Meja kerja',
  'Kamar mandi dalam',
];

const FACILITY_ICON_RULES = [
  { pattern: /ac|pendingin|air conditioner/i, icon: 'Snowflake' },
  { pattern: /wifi|internet/i, icon: 'Wifi' },
  { pattern: /kasur|bed/i, icon: 'BedDouble' },
  { pattern: /mandi|bath|shower/i, icon: 'Bath' },
  { pattern: /lemari|wardrobe/i, icon: 'DoorClosed' },
  { pattern: /meja|kerja|desk/i, icon: 'Laptop' },
  { pattern: /parkir|parking/i, icon: 'Car' },
  { pattern: /dapur|masak|kitchen/i, icon: 'Utensils' },
  { pattern: /cuci|laundry|washing/i, icon: 'WashingMachine' },
  { pattern: /kulkas|refrigerator/i, icon: 'Refrigerator' },
  { pattern: /keamanan|cctv|security/i, icon: 'ShieldCheck' },
  { pattern: /listrik|token/i, icon: 'Zap' },
];

const FALLBACK_PROPERTY = {
  name: 'Casa Ramire',
  tagline: 'Kos nyaman, tenang, dan strategis.',
  description:
    'Kamar deluxe dengan fasilitas lengkap di lingkungan yang tenang. Cocok untuk mahasiswa dan pekerja yang ingin tinggal jangka panjang.',
  address: 'Kos Casa Ramire',
  whatsapp: '',
  mapsUrl: '',
  facilities: FALLBACK_FACILITIES,
  deposit: 500000,
};

const STATUS_META = {
  kosong: { label: 'Tersedia', className: 'badge-green', dot: 'bg-emerald-500' },
  booking: { label: 'Booking', className: 'badge-blue', dot: 'bg-indigo-400' },
  terisi: { label: 'Terisi', className: 'badge-gray', dot: 'bg-stone-400' },
};

function normalizeCatalog(input) {
  const propertyInput = input?.property || {};
  const facilities = Array.isArray(propertyInput.facilities)
    ? propertyInput.facilities
    : String(propertyInput.facilities || '')
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    version: input?.version || 1,
    generatedAt: input?.generatedAt || '',
    property: {
      ...FALLBACK_PROPERTY,
      ...propertyInput,
      facilities: facilities.length ? facilities : FALLBACK_FACILITIES,
    },
    pricing: {
      lantai2: {},
      lantai3: {},
      ...(input?.pricing || {}),
    },
    rooms: Array.isArray(input?.rooms) ? input.rooms : [],
  };
}

function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.kosong;
}

function floorKeyFor(room) {
  return String(room.lantai) === '3' ? 'lantai3' : 'lantai2';
}

function monthlyPrice(room, catalog) {
  const direct = Number(room.priceMonthly);
  if (Number.isFinite(direct) && direct > 0) return direct;
  return Number(catalog.pricing?.[floorKeyFor(room)]?.['1']) || 0;
}

function waHref(property, message) {
  const phone = String(property?.whatsapp || '').trim();
  if (!phone) return '';
  return waLink(phone, message);
}

function facilityIcon(label) {
  const rule = FACILITY_ICON_RULES.find((item) => item.pattern.test(label));
  return rule?.icon || 'Check';
}

function roomPhoto(room) {
  return String(room.photo || '').trim();
}

function roomCard(room, catalog) {
  const meta = statusMeta(room.status);
  const price = monthlyPrice(room, catalog);
  const photo = roomPhoto(room);
  const message = `Halo Admin ${catalog.property.name}, saya mau tanya ketersediaan Kamar ${room.nomor}.`;
  const wa = waHref(catalog.property, message);
  const chips = catalog.property.facilities
    .slice(0, 3)
    .map(
      (facility) =>
        `<span class="badge-gray normal-case tracking-normal">${esc(facility)}</span>`,
    )
    .join('');

  return `
    <article
      data-room-card
      data-status="${esc(room.status || 'kosong')}"
      data-floor="${esc(room.lantai || '')}"
      class="group card overflow-hidden rounded-3xl card-hover flex flex-col"
    >
      <div class="relative aspect-[4/3] bg-brand-50 overflow-hidden">
        ${
          photo
            ? `<img src="${esc(photo)}" alt="Kamar ${esc(room.nomor)} ${esc(catalog.property.name)}" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />`
            : `<div class="w-full h-full bg-gradient-to-br from-brand via-brand-700 to-brand-600 flex flex-col items-center justify-center gap-2 text-gold/90">
                ${icon('BedDouble', 'w-12 h-12')}
                <span class="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/70">Foto menyusul</span>
              </div>`
        }
        <span class="absolute left-3 top-3 ${meta.className} shadow-sm">${meta.label}</span>
        <span class="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-600">
          Lantai ${esc(room.lantai || '—')}
        </span>
      </div>

      <div class="p-5 flex flex-col flex-1">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-xl font-black text-stone-800 leading-none">Kamar ${esc(room.nomor)}</h3>
            <p class="text-[10px] font-extrabold uppercase tracking-wider text-gold-700 mt-1.5">Deluxe · ${esc(catalog.property.name)}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-[9px] font-bold uppercase tracking-wider text-stone-500">Mulai dari</p>
            <p class="text-base font-black text-stone-800 leading-tight">${rupiah(price)}</p>
            <p class="text-[9px] text-stone-500">/ bulan</p>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-1.5">${chips}</div>

        <div class="mt-auto pt-4 border-t border-line-soft flex items-center justify-between gap-2">
          <span class="flex items-center gap-1.5 text-[10px] font-bold text-stone-500">
            <span class="w-2 h-2 rounded-full ${meta.dot}"></span>
            ${room.status === 'terisi' ? 'Tanya ketersediaan' : 'Siap dilihat'}
          </span>
          ${
            wa
              ? `<a href="${wa}" target="_blank" rel="noopener" class="btn-primary btn-sm">${icon('MessageCircle', 'w-4 h-4')} Tanya</a>`
              : `<button type="button" class="btn-outline btn-sm" data-scroll="kontak">${icon('MessageCircle', 'w-4 h-4')} Tanya</button>`
          }
        </div>
      </div>
    </article>
  `;
}

function priceRows(floor, catalog) {
  const data = catalog.pricing?.[floor.key] || {};
  const monthly = Number(data['1']) || 0;

  const rows = MONTH_PERIODS.map((period) => {
    const value = Number(data[period.key]) || 0;
    const perMonth = period.months > 1 ? Math.round(value / period.months) : value;
    const saving = monthly && period.months > 1 ? Math.max(0, monthly * period.months - value) : 0;

    return `
      <div class="flex items-center justify-between gap-3 py-2.5 border-b border-line-soft last:border-0">
        <div>
          <p class="text-sm font-bold text-stone-800">${period.label}</p>
          <p class="text-[10px] text-stone-500">${period.months > 1 ? `≈ ${rupiah(perMonth)} / bulan` : 'Tarif bulanan'}</p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-sm font-black text-stone-800">${rupiah(value)}</p>
          ${saving > 0 ? `<p class="text-[10px] font-bold text-emerald-700">Hemat ${rupiah(saving)}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="card rounded-3xl p-5 sm:p-6 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="badge-gold">Lantai ${esc(floor.key === 'lantai2' ? '2' : '3')}</span>
          <h3 class="text-xl font-black text-stone-800 mt-3">Kamar ${floor.key === 'lantai2' ? '201 – 221' : '301 – 321'}</h3>
          <p class="text-xs text-stone-500 mt-1">Harga sudah termasuk fasilitas kamar.</p>
        </div>
        <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">${icon('Building2', 'w-5 h-5')}</span>
      </div>

      <div class="mt-4">${rows || '<p class="text-sm text-stone-500">Hubungi admin untuk harga terbaru.</p>'}</div>

      <div class="mt-4 flex flex-wrap gap-1.5">
        <span class="badge-gray">Harian ${rupiah(data.harian || 0)}</span>
        <span class="badge-gray">Mingguan ${rupiah(data.mingguan || 0)}</span>
      </div>

      <p class="hint mt-4 pt-4 border-t border-line-soft">
        Deposit ${rupiah(catalog.property.deposit || 0)}. Hubungi admin untuk ketersediaan dan jadwal survei.
      </p>
    </div>
  `;
}

function heroGallery(catalog) {
  const photos = catalog.rooms.filter((room) => roomPhoto(room)).slice(0, 3);

  if (!photos.length) {
    return `
      <div class="relative rounded-[2rem] bg-brand text-white p-6 sm:p-8 overflow-hidden shadow-xl">
        <div class="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gold/15 blur-3xl"></div>
        <div class="absolute -left-10 -bottom-10 w-56 h-56 rounded-full bg-white/10 blur-2xl"></div>
        <div class="relative">
          ${brandMark('w-16 h-16 rounded-2xl', { light: true })}
          <p class="mt-6 text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">Casa Ramire</p>
          <p class="text-3xl font-black mt-2 leading-tight">${catalog.rooms.length} kamar<br/>2 lantai</p>
          <p class="text-sm text-stone-300 mt-3 leading-relaxed">
            Katalog foto akan segera dilengkapi. Hubungi admin untuk melihat kamar secara langsung.
          </p>
          <div class="mt-6 grid grid-cols-2 gap-3">
            <div class="rounded-2xl bg-white/10 border border-white/10 p-3">
              <p class="text-[9px] font-extrabold uppercase tracking-wider text-gold">Tersedia</p>
              <p class="text-xl font-black mt-1">${catalog.rooms.filter((room) => room.status === 'kosong').length}</p>
            </div>
            <div class="rounded-2xl bg-white/10 border border-white/10 p-3">
              <p class="text-[9px] font-extrabold uppercase tracking-wider text-gold">Fasilitas</p>
              <p class="text-xl font-black mt-1">${catalog.property.facilities.length}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const [first, second, third] = photos;
  return `
    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2 relative rounded-[2rem] overflow-hidden aspect-[16/10] bg-brand shadow-xl">
        <img src="${esc(roomPhoto(first))}" alt="Kamar ${esc(first.nomor)} Casa Ramire" class="w-full h-full object-cover" />
        <div class="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-stone-950/70 to-transparent">
          <p class="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold">Kamar ${esc(first.nomor)}</p>
          <p class="text-white font-black text-lg">Suasana Casa Ramire</p>
        </div>
      </div>
      ${
        second
          ? `<div class="relative rounded-2xl overflow-hidden aspect-[4/3] bg-brand">
              <img src="${esc(roomPhoto(second))}" alt="Kamar ${esc(second.nomor)} Casa Ramire" loading="lazy" class="w-full h-full object-cover" />
            </div>`
          : `<div class="rounded-2xl bg-brand-50 border border-line flex items-center justify-center aspect-[4/3] text-brand">${icon('BedDouble', 'w-8 h-8')}</div>`
      }
      ${
        third
          ? `<div class="relative rounded-2xl overflow-hidden aspect-[4/3] bg-brand">
              <img src="${esc(roomPhoto(third))}" alt="Kamar ${esc(third.nomor)} Casa Ramire" loading="lazy" class="w-full h-full object-cover" />
            </div>`
          : `<div class="rounded-2xl bg-gold-50 border border-gold/30 flex items-center justify-center aspect-[4/3] text-gold-700">${icon('Sparkles', 'w-8 h-8')}</div>`
      }
    </div>
  `;
}

function facilityCards(catalog) {
  return catalog.property.facilities
    .map(
      (facility) => `
      <div class="card rounded-2xl p-4 flex items-center gap-3">
        <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">
          ${icon(facilityIcon(facility), 'w-5 h-5')}
        </span>
        <p class="text-sm font-bold text-stone-700">${esc(facility)}</p>
      </div>
    `,
    )
    .join('');
}

function previewBanner() {
  return `
    <div class="bg-brand text-white border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2 text-[11px]">
        ${icon('Eye', 'w-4 h-4 text-gold shrink-0')}
        <span class="font-semibold text-stone-200">Mode pratinjau admin — perubahan foto dan profil baru terlihat publik setelah dipublikasikan.</span>
        <div class="ml-auto flex items-center gap-2">
          <button type="button" class="btn-gold btn-xs" data-action="open-settings">${icon('UploadCloud', 'w-3.5 h-3.5')} Publikasikan</button>
          <a href="#/dashboard" class="btn-outline btn-xs border-white/20 bg-white/5 text-white hover:bg-white/10">Dashboard</a>
        </div>
      </div>
    </div>
  `;
}

function pageHtml(catalog, { preview, source }) {
  const property = catalog.property;
  const rooms = catalog.rooms;
  const available = rooms.filter((room) => room.status === 'kosong').length;
  const wa = waHref(
    property,
    `Halo Admin ${property.name}, saya mau tanya ketersediaan kamar di Casa Ramire.`,
  );
  const adminHref = getActiveUser() ? '#/dashboard' : '#/login';
  const adminLabel = getActiveUser() ? 'Dashboard' : 'Masuk Admin';
  const mapsUrl = String(property.mapsUrl || '').trim();

  return `
    <div data-view="home" class="min-h-dvh bg-cream">
      <header class="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-line">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <a href="#/home" class="flex items-center gap-2.5 min-w-0" aria-label="${esc(property.name)} — beranda">
            ${brandMark('w-10 h-10 rounded-xl')}
            <span class="min-w-0">
              <span class="block text-sm font-extrabold text-stone-800 leading-tight truncate">${esc(property.name)}</span>
              <span class="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-700">Kos Deluxe</span>
            </span>
          </a>

          <nav class="hidden lg:flex items-center gap-1 ml-6" aria-label="Navigasi landing page">
            <button type="button" class="btn-ghost btn-sm" data-scroll="kamar">Kamar</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="harga">Harga</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="fasilitas">Fasilitas</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="kontak">Kontak</button>
          </nav>

          <div class="ml-auto flex items-center gap-2">
            <a href="${adminHref}" class="btn-outline btn-sm">${icon('LockKeyhole', 'w-4 h-4')} ${adminLabel}</a>
            ${
              wa
                ? `<a href="${wa}" target="_blank" rel="noopener" class="btn-primary btn-sm">${icon('MessageCircle', 'w-4 h-4')} <span class="hidden sm:inline">Chat Admin</span></a>`
                : ''
            }
          </div>
        </div>
      </header>

      ${preview ? previewBanner() : ''}

      <main>
        <section class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-b from-white via-cream to-cream"></div>
          <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
            <div class="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
              <div class="animate-in">
                <span class="badge-gold">${esc(property.name)} · Kos Deluxe</span>
                <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-stone-800 mt-4 text-balance leading-[1.05]">
                  Kamar nyaman,<br class="hidden sm:block" /> hidup lebih tenang.
                </h1>
                <p class="text-base sm:text-lg text-stone-600 mt-4 max-w-xl leading-relaxed">
                  ${esc(property.description)}
                </p>

                <div class="flex flex-wrap items-center gap-2.5 mt-7">
                  <button type="button" class="btn-primary px-5 py-3" data-scroll="kamar">
                    ${icon('Building2', 'w-4 h-4')} Lihat Katalog Kamar
                  </button>
                  ${
                    wa
                      ? `<a href="${wa}" target="_blank" rel="noopener" class="btn-outline px-5 py-3 text-emerald-700">${icon('MessageCircle', 'w-4 h-4')} Chat WhatsApp</a>`
                      : `<button type="button" class="btn-outline px-5 py-3" data-scroll="kontak">${icon('MessageCircle', 'w-4 h-4')} Hubungi Admin</button>`
                  }
                </div>

                <dl class="grid grid-cols-3 gap-3 mt-8 max-w-lg">
                  <div class="rounded-2xl bg-white border border-line p-3.5">
                    <dt class="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Total kamar</dt>
                    <dd class="text-xl font-black text-stone-800 mt-1">${rooms.length}</dd>
                  </div>
                  <div class="rounded-2xl bg-white border border-line p-3.5">
                    <dt class="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Tersedia</dt>
                    <dd class="text-xl font-black text-emerald-700 mt-1">${available}</dd>
                  </div>
                  <div class="rounded-2xl bg-white border border-line p-3.5">
                    <dt class="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Lantai</dt>
                    <dd class="text-xl font-black text-stone-800 mt-1">2</dd>
                  </div>
                </dl>

                <p class="text-[11px] text-stone-500 mt-4 flex items-center gap-1.5">
                  ${icon('MapPin', 'w-3.5 h-3.5 text-gold-700')}
                  ${esc(property.address || 'Lokasi Casa Ramire')}
                </p>
              </div>

              <div class="animate-in">${heroGallery(catalog)}</div>
            </div>
          </div>
        </section>

        <section id="kamar" class="scroll-mt-20 py-12 sm:py-16 bg-white border-y border-line">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <span class="badge-gold">Katalog Kamar</span>
                <h2 class="page-title mt-3">Pilih kamar yang paling cocok.</h2>
                <p class="page-subtitle max-w-2xl">
                  Semua kamar berukuran sama dan sudah dilengkapi fasilitas utama. Harga berbeda per lantai.
                </p>
              </div>
              <div class="flex flex-wrap gap-2" data-catalog-filters>
                <button type="button" class="chip-active" data-filter="all">Semua (${rooms.length})</button>
                <button type="button" class="chip-idle" data-filter="available">Tersedia (${available})</button>
                <button type="button" class="chip-idle" data-filter="floor-2">Lantai 2</button>
                <button type="button" class="chip-idle" data-filter="floor-3">Lantai 3</button>
              </div>
            </div>

            ${
              rooms.length
                ? `<div id="catalog-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                    ${rooms.map((room) => roomCard(room, catalog)).join('')}
                  </div>
                  <div id="catalog-empty" hidden class="mt-7">
                    <div class="card p-10 text-center text-sm text-stone-500">Tidak ada kamar yang cocok dengan filter ini.</div>
                  </div>`
                : `<div class="card p-10 text-center mt-7">
                    <p class="font-extrabold text-stone-700">Katalog kamar sedang disiapkan.</p>
                    <p class="text-sm text-stone-500 mt-1">Silakan hubungi admin untuk informasi ketersediaan.</p>
                  </div>`
            }
          </div>
        </section>

        <section id="harga" class="scroll-mt-20 py-12 sm:py-16">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="max-w-2xl">
              <span class="badge-gold">Harga & Paket Sewa</span>
              <h2 class="page-title mt-3">Harga transparan, tanpa kejutan.</h2>
              <p class="page-subtitle">
                Pilih durasi sewa yang paling pas. Semakin lama, semakin hemat per bulan.
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mt-7">
              ${priceRows({ key: 'lantai2' }, catalog)}
              ${priceRows({ key: 'lantai3' }, catalog)}
            </div>

            <p class="hint mt-4">
              * Harga dapat berubah sewaktu-waktu. Konfirmasi ketersediaan dan promo terbaru melalui admin.
            </p>
          </div>
        </section>

        <section id="fasilitas" class="scroll-mt-20 py-12 sm:py-16 bg-white border-y border-line">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
              <div>
                <span class="badge-gold">Fasilitas</span>
                <h2 class="page-title mt-3">Semua yang kamu butuhkan untuk tinggal nyaman.</h2>
                <p class="page-subtitle">
                  Fasilitas utama sudah termasuk dalam harga sewa. Ajukan kebutuhan tambahan ke admin.
                </p>
                <div class="card rounded-2xl p-4 mt-5 bg-cream/60">
                  <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Deposit</p>
                  <p class="text-xl font-black text-stone-800 mt-1">${rupiah(property.deposit || 0)}</p>
                  <p class="hint mt-1">Deposit dikembalikan sesuai ketentuan saat check-out.</p>
                </div>
              </div>
              <div class="grid sm:grid-cols-2 gap-3">${facilityCards(catalog)}</div>
            </div>
          </div>
        </section>

        <section id="kontak" class="scroll-mt-20 py-12 sm:py-16">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="rounded-[2rem] bg-brand text-white overflow-hidden relative">
              <div class="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gold/15 blur-3xl"></div>
              <div class="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
              <div class="relative p-7 sm:p-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
                <div>
                  <span class="badge-gold">Hubungi Admin</span>
                  <h2 class="text-3xl sm:text-4xl font-black tracking-tight mt-3 text-balance">
                    Mau lihat kamar atau tanya harga?
                  </h2>
                  <p class="text-sm text-stone-300 mt-3 max-w-xl leading-relaxed">
                    Admin Casa Ramire siap membantu ketersediaan kamar, jadwal survei, dan proses sewa.
                  </p>
                  <div class="flex flex-wrap gap-2.5 mt-6">
                    ${
                      wa
                        ? `<a href="${wa}" target="_blank" rel="noopener" class="btn-gold px-5 py-3">${icon('MessageCircle', 'w-4 h-4')} Chat WhatsApp Admin</a>`
                        : `<a href="${adminHref}" class="btn-gold px-5 py-3">${icon('LockKeyhole', 'w-4 h-4')} Masuk untuk atur kontak</a>`
                    }
                    ${
                      mapsUrl
                        ? `<a href="${esc(mapsUrl)}" target="_blank" rel="noopener" class="btn-outline border-white/20 bg-white/5 text-white hover:bg-white/10 px-5 py-3">${icon('MapPin', 'w-4 h-4')} Lihat Lokasi</a>`
                        : ''
                    }
                  </div>
                </div>

                <div class="rounded-2xl bg-white/10 border border-white/15 p-5 space-y-4">
                  <div class="flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">${icon('MapPin', 'w-4 h-4')}</span>
                    <div>
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-gold">Alamat</p>
                      <p class="text-sm font-semibold text-white mt-0.5">${esc(property.address || 'Casa Ramire')}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">${icon('Phone', 'w-4 h-4')}</span>
                    <div>
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-gold">WhatsApp Admin</p>
                      <p class="text-sm font-semibold text-white mt-0.5">${esc(property.whatsapp || 'Belum diatur')}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">${icon('Clock', 'w-4 h-4')}</span>
                    <div>
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-gold">Survei</p>
                      <p class="text-sm font-semibold text-white mt-0.5">Atur jadwal dengan admin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="border-t border-line py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            ${brandMark('w-9 h-9 rounded-xl')}
            <div>
              <p class="text-sm font-extrabold text-stone-800 leading-tight">${esc(property.name)}</p>
              <p class="text-[10px] text-stone-500">Kos nyaman untuk tinggal jangka panjang.</p>
            </div>
          </div>
          <div class="flex items-center gap-3 text-[11px] font-semibold text-stone-500">
            <button type="button" class="hover:text-brand" data-scroll="kamar">Kamar</button>
            <button type="button" class="hover:text-brand" data-scroll="harga">Harga</button>
            <button type="button" class="hover:text-brand" data-scroll="kontak">Kontak</button>
            <a href="${adminHref}" class="hover:text-brand">${adminLabel}</a>
          </div>
          <p class="text-[10px] text-stone-400">© ${new Date().getFullYear()} ${esc(property.name)}</p>
        </div>
      </footer>
    </div>
  `;
}

function bindLanding(root, catalog) {
  root.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.scroll;
      const target = id ? root.querySelector(`#${id}`) : null;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const filterButtons = [...root.querySelectorAll('[data-filter]')];
  const cards = [...root.querySelectorAll('[data-room-card]')];
  const empty = root.querySelector('#catalog-empty');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        item.className = item === button ? 'chip-active' : 'chip-idle';
      });

      let visible = 0;
      cards.forEach((card) => {
        const status = card.dataset.status;
        const floor = card.dataset.floor;
        const show =
          filter === 'all' ||
          (filter === 'available' && status === 'kosong') ||
          (filter === `floor-${floor}`);
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (empty) empty.hidden = visible > 0;
    });
  });

  root.querySelector('[data-action="open-settings"]')?.addEventListener('click', () => {
    openSettingsModal();
  });

  document.title = `${catalog.property.name} — Katalog Kamar & Harga`;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      'content',
      catalog.property.description ||
        `${catalog.property.name} — katalog kamar, harga sewa, dan kontak admin.`,
    );
  }
}

function paint(root, catalog, options) {
  root.innerHTML = pageHtml(catalog, options);
  bindLanding(root, catalog);
}

export function render(root) {
  const user = getActiveUser();
  const preview = Boolean(user);
  const renderId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  root.dataset.homeRenderId = renderId;

  const localCatalog = normalizeCatalog(buildCatalogSnapshot({ includeLocalPhotos: true }));
  paint(root, localCatalog, { preview, source: preview ? 'preview' : 'local' });

  if (preview) return;

  fetchPublishedCatalog()
    .then((published) => {
      if (
        !published ||
        root.dataset.homeRenderId !== renderId ||
        !root.querySelector('[data-view="home"]')
      ) {
        return;
      }

      const catalog = normalizeCatalog(published);
      paint(root, catalog, { preview: false, source: 'published' });
    })
    .catch((error) => {
      console.warn('[home] gagal memuat katalog publik, memakai data lokal', error);
    });
}
