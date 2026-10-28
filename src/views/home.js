import { CAR_FEE, PERIODS } from '../core/constants.js';
import {
  addDays,
  addMonths,
  daysBetween,
  formatDate,
  rupiah,
  toNumber,
  todayISO,
  waLink,
} from '../core/format.js';
import { getActiveUser } from '../services/auth.js';
import { submitBookingRequest } from '../services/bookings.js';
import { buildCatalogSnapshot, fetchLiveAvailability, fetchPublishedCatalog } from '../services/catalog.js';
import { isValidEmail } from '../services/email.js';
import { brandMark } from '../ui/brand.js';
import { esc } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { openModal } from '../ui/modal.js';
import { toast } from '../ui/toast.js';
import { openSettingsModal } from './settings.js';

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
  address: 'Kos Casa Ramire, Yogyakarta',
  whatsapp: '',
  email: 'casaramirejogja@gmail.com',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=casa+ramire+kost+jogja',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=casa%20ramire%20kost%20jogja&z=16&output=embed',
  facilities: FALLBACK_FACILITIES,
  deposit: 500000,
};

function normalizeCatalog(input) {
  const propertyInput = input?.property || {};
  const facilities = Array.isArray(propertyInput.facilities)
    ? propertyInput.facilities
    : String(propertyInput.facilities || '')
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter(Boolean);

  const rooms = Array.isArray(input?.rooms) ? input.rooms : [];
  const availability = input?.availability || {
    total: rooms.length,
    available: rooms.filter((room) => room.status === 'kosong').length,
    occupied: rooms.filter((room) => room.status === 'terisi').length,
    booked: rooms.filter((room) => room.status === 'booking').length,
  };

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
    availability,
    gallery: Array.isArray(input?.gallery)
      ? input.gallery.filter((item) => String(item?.url || '').trim())
      : [],
    promos: Array.isArray(input?.promos) ? input.promos : [],
    rooms,
  };
}

function floorKeyFor(floor) {
  return String(floor) === '3' ? 'lantai3' : 'lantai2';
}

function floorNumber(key) {
  return key === 'lantai3' ? '3' : '2';
}

function rateFor(catalog, floor, periode) {
  return Number(catalog.pricing?.[floorKeyFor(floor)]?.[periode]) || 0;
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

function normalizePromoCode(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 24);
}

function findPromo(catalog, code) {
  const normalized = normalizePromoCode(code);
  if (!normalized) return null;
  return (
    (catalog.promos || []).find(
      (promo) => normalizePromoCode(promo.code) === normalized,
    ) || null
  );
}

function promoRemaining(promo) {
  if (!promo) return 0;
  const max = Math.max(0, Number(promo.maxUses) || 0);
  if (!max) return Infinity;
  return Math.max(0, max - (Number(promo.usedCount) || 0));
}

/**
 * Quote using the *published* price list so visitors see the same price that
 * the admin panel will use later. Mirrors the rules in services/pricing.js.
 */
function quoteFor(catalog, { floor, periode, startDate, endDate, promo, car }) {
  const period = PERIODS.find((item) => item.key === String(periode)) || PERIODS[2];
  const start = startDate || todayISO();
  let resolvedEnd = '';

  if (period.kind === 'months') {
    resolvedEnd = addMonths(start, period.months);
  } else if (period.kind === 'days') {
    resolvedEnd = endDate && daysBetween(start, endDate) > 0 ? endDate : addDays(start, 1);
  } else {
    resolvedEnd = endDate && daysBetween(start, endDate) > 0 ? endDate : addDays(start, 7);
  }

  const rate = rateFor(catalog, floor, period.key);
  if (!rate) return { error: 'Tarif untuk durasi ini belum tersedia. Hubungi admin.' };

  let units = 1;
  if (period.kind === 'months') units = period.months;
  else {
    const days = Math.max(1, daysBetween(start, resolvedEnd));
    units = period.kind === 'days' ? days : Math.max(1, Math.ceil(days / 7));
  }

  const base = period.kind === 'months' ? rate : rate * units;
  const chargedMonths = period.kind === 'months' ? period.months : 1;

  const grossDiscount = !promo
    ? 0
    : promo.type === 'persen'
      ? (base * toNumber(promo.value)) / 100
      : toNumber(promo.value) * chargedMonths;
  const discount = Math.min(base, Math.max(0, Math.round(grossDiscount)));
  const carTotal = car ? CAR_FEE * chargedMonths : 0;
  const total = Math.max(0, base - discount) + carTotal;

  return {
    period,
    start,
    end: resolvedEnd,
    units,
    base,
    discount,
    carTotal,
    total,
    promo,
  };
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function hero(catalog) {
  const property = catalog.property;
  const first = catalog.gallery[0];
  const stats = [
    { label: 'Total kamar', value: catalog.availability.total ?? catalog.rooms.length },
    { label: 'Terisi', value: catalog.availability.occupied ?? 0 },
    { label: 'Tersisa', value: catalog.availability.available ?? 0, accent: true },
  ];

  return `
    <div class="relative rounded-[2rem] overflow-hidden bg-brand shadow-xl aspect-[4/3] lg:aspect-[5/4]">
      ${
        first
          ? `<img src="${esc(first.url)}" alt="${esc(first.caption || `Galeri ${property.name}`)}" class="w-full h-full object-cover" />`
          : `<div class="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand via-brand-700 to-brand-600 text-white">
              ${brandMark('w-16 h-16 rounded-2xl', { light: true })}
              <p class="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">Galeri segera hadir</p>
              <p class="text-sm text-stone-300 max-w-xs text-center px-6">Foto kamar dan suasana Casa Ramire akan tampil di sini.</p>
            </div>`
      }
      <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent">
        <p class="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">${esc(property.name)} · Kos Deluxe</p>
        <p class="text-white font-black text-xl sm:text-2xl mt-1">${esc(first?.caption || 'Suasana kamar & area Casa Ramire')}</p>
        <div class="grid grid-cols-3 gap-2 mt-4">
          ${stats
            .map(
              (stat) => `
              <div class="rounded-xl bg-white/10 border border-white/15 px-2.5 py-2 backdrop-blur">
                <p class="text-[8px] font-extrabold uppercase tracking-wider ${stat.accent ? 'text-gold' : 'text-stone-300'}">${stat.label}</p>
                <p class="text-lg font-black ${stat.accent ? 'text-gold' : 'text-white'} leading-tight">${stat.value}</p>
              </div>`,
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function availabilitySection(catalog) {
  const total = Number(catalog.availability.total) || catalog.rooms.length || 0;
  const available = Number(catalog.availability.available) || 0;
  const occupied = Number(catalog.availability.occupied) || 0;
  const booked = Number(catalog.availability.booked) || 0;
  const percent = total ? Math.round((available / total) * 100) : 0;

  const availableByFloor = ['2', '3'].map((floor) => ({
    floor,
    rooms: catalog.rooms.filter(
      (room) => room.status === 'kosong' && String(room.lantai) === floor,
    ),
  }));

  return `
    <section id="ketersediaan" class="scroll-mt-20 py-12 sm:py-16 bg-white border-y border-line">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
          <div class="card rounded-3xl p-6 sm:p-8 flex flex-col">
            <span class="badge-gold">Ketersediaan Kamar</span>
            <h2 class="page-title mt-3">Satu tipe kamar, banyak pilihan durasi.</h2>
            <p class="page-subtitle max-w-xl">
              Semua kamar bertipe Deluxe dengan fasilitas yang sama. Pilih lantai dan durasi sewa saat booking —
              admin akan mengonfirmasi nomor kamar sesuai ketersediaan.
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div class="rounded-2xl border border-line bg-cream/60 p-3">
                <p class="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Total</p>
                <p class="text-2xl font-black text-stone-800 mt-1">${total}</p>
              </div>
              <div class="rounded-2xl border border-rose-200 bg-rose-50 p-3">
                <p class="text-[9px] font-extrabold uppercase tracking-wider text-rose-700">Terisi</p>
                <p class="text-2xl font-black text-rose-800 mt-1">${occupied}</p>
              </div>
              <div class="rounded-2xl border border-indigo-200 bg-indigo-50 p-3">
                <p class="text-[9px] font-extrabold uppercase tracking-wider text-indigo-700">Booking</p>
                <p class="text-2xl font-black text-indigo-800 mt-1">${booked}</p>
              </div>
              <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                <p class="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">Tersisa</p>
                <p class="text-2xl font-black text-emerald-800 mt-1">${available}</p>
              </div>
            </div>

            <div class="mt-5">
              <div class="flex items-center justify-between text-[11px] font-bold text-stone-600 mb-1.5">
                <span>Kamar tersedia</span>
                <span>${percent}% dari ${total} kamar</span>
              </div>
              <div class="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div class="h-full rounded-full bg-emerald-500" style="width:${Math.max(0, Math.min(100, percent))}%"></div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 mt-6">
              <button type="button" class="btn-primary px-5 py-3" data-book>${icon('CalendarClock', 'w-4 h-4')} Booking Sekarang</button>
              ${
                waHref(catalog.property, `Halo Admin ${catalog.property.name}, saya mau tanya ketersediaan kamar.`)
                  ? `<a href="${waHref(catalog.property, `Halo Admin ${catalog.property.name}, saya mau tanya ketersediaan kamar.`)}" target="_blank" rel="noopener" class="btn-outline px-5 py-3 text-emerald-700">${icon('MessageCircle', 'w-4 h-4')} Tanya Admin</a>`
                  : ''
              }
            </div>
          </div>

          <div class="card rounded-3xl p-6 sm:p-8">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Nomor kamar yang masih kosong</p>
            <div class="space-y-4 mt-4">
              ${availableByFloor
                .map(
                  (group) => `
                  <div>
                    <p class="text-xs font-bold text-stone-700 mb-2">Lantai ${group.floor}</p>
                    ${
                      group.rooms.length
                        ? `<div class="flex flex-wrap gap-1.5">${group.rooms
                            .map(
                              (room) =>
                                `<span class="badge-green normal-case tracking-normal">Kamar ${esc(room.nomor)}</span>`,
                            )
                            .join('')}</div>`
                        : `<p class="text-xs text-stone-500 italic">Tidak ada kamar kosong di lantai ini.</p>`
                    }
                  </div>`,
                )
                .join('')}
            </div>
            <div class="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 mt-5 text-[11px] text-amber-900 leading-relaxed">
              <b>Membawa mobil?</b> Ada tambahan parkir ${rupiah(CAR_FEE)}/bulan. Pilih opsi mobil di form booking —
              biaya otomatis masuk ke estimasi.
            </div>
            <div class="rounded-2xl border border-line bg-cream/60 p-3.5 mt-3 text-[11px] text-stone-600 leading-relaxed">
              Deposit ${rupiah(catalog.property.deposit || 0)} dibayarkan saat check-in dan dikembalikan sesuai ketentuan.
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function priceRows(catalog, floorKey, floor) {
  const data = catalog.pricing?.[floorKey] || {};
  const monthly = Number(data['1']) || 0;

  return PERIODS.filter((period) => Number(data[period.key]) > 0)
    .map((period) => {
      const value = Number(data[period.key]) || 0;
      const perMonth = period.months > 1 ? Math.round(value / period.months) : value;
      const saving = monthly && period.months > 1 ? Math.max(0, monthly * period.months - value) : 0;

      return `
        <div class="flex items-center justify-between gap-3 py-2.5 border-b border-line-soft last:border-0">
          <div>
            <p class="text-sm font-bold text-stone-800">${period.label}</p>
            <p class="text-[10px] text-stone-500">
              ${period.months > 1 ? `≈ ${rupiah(perMonth)} / bulan` : period.months === 1 ? 'Tarif bulanan' : 'Paket singkat'}
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <div class="text-right">
              <p class="text-sm font-black text-stone-800">${rupiah(value)}</p>
              ${saving > 0 ? `<p class="text-[10px] font-bold text-emerald-700">Hemat ${rupiah(saving)}</p>` : ''}
            </div>
            <button type="button" class="btn-outline btn-xs" data-book-floor="${floor}" data-book-period="${period.key}">Pilih</button>
          </div>
        </div>
      `;
    })
    .join('');
}

function priceCard(catalog, floorKey) {
  const floor = floorNumber(floorKey);
  const data = catalog.pricing?.[floorKey] || {};

  return `
    <div class="card rounded-3xl p-5 sm:p-6 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="badge-gold">Lantai ${floor}</span>
          <h3 class="text-xl font-black text-stone-800 mt-3">Tipe Deluxe · Lantai ${floor}</h3>
          <p class="text-xs text-stone-500 mt-1">Fasilitas sama, harga menyesuaikan lantai.</p>
        </div>
        <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">${icon('Building2', 'w-5 h-5')}</span>
      </div>

      <div class="mt-4">
        ${priceRows(catalog, floorKey, floor) || '<p class="text-sm text-stone-500">Hubungi admin untuk harga terbaru.</p>'}
      </div>

      <button type="button" class="btn-primary btn-sm mt-5 w-full" data-book-floor="${floor}">
        ${icon('CalendarClock', 'w-4 h-4')} Booking Lantai ${floor}
      </button>
    </div>
  `;
}

function galleryGrid(catalog) {
  if (!catalog.gallery.length) {
    return `
      <div class="card p-10 text-center">
        <span class="w-14 h-14 rounded-2xl bg-brand-50 text-brand flex items-center justify-center mx-auto">${icon('Image', 'w-7 h-7')}</span>
        <p class="font-extrabold text-stone-700 mt-4">Galeri foto sedang disiapkan</p>
        <p class="text-sm text-stone-500 mt-1 max-w-md mx-auto">Admin Casa Ramire akan menambahkan foto kamar dan area bersama. Sementara itu, silakan hubungi admin untuk jadwal survei.</p>
      </div>
    `;
  }

  return `
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
      ${catalog.gallery
        .map(
          (item, index) => `
          <button type="button" data-gallery-index="${index}" class="group relative rounded-2xl overflow-hidden bg-brand-50 ${
            index === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'
          }">
            <img src="${esc(item.url)}" alt="${esc(item.caption || `Galeri Casa Ramire ${index + 1}`)}" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
            <span class="absolute inset-x-0 bottom-0 p-3 text-left bg-gradient-to-t from-stone-950/75 to-transparent">
              <span class="text-white text-xs font-bold">${esc(item.caption || `Foto ${index + 1}`)}</span>
            </span>
          </button>`,
        )
        .join('')}
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
        <span class="font-semibold text-stone-200">Mode pratinjau admin — perubahan galeri dan profil baru terlihat publik setelah dipublikasikan.</span>
        <div class="ml-auto flex items-center gap-2">
          <button type="button" class="btn-gold btn-xs" data-action="open-settings">${icon('UploadCloud', 'w-3.5 h-3.5')} Publikasikan</button>
          <a href="#/dashboard" class="btn-outline btn-xs border-white/20 bg-white/5 text-white hover:bg-white/10">Dashboard</a>
        </div>
      </div>
    </div>
  `;
}

function pageHtml(catalog, { preview }) {
  const property = catalog.property;
  const wa = waHref(
    property,
    `Halo Admin ${property.name}, saya mau tanya ketersediaan kamar di Casa Ramire.`,
  );
  const adminHref = getActiveUser() ? '#/dashboard' : '#/login';
  const adminLabel = getActiveUser() ? 'Dashboard' : 'Masuk Admin';
  const mapsUrl = String(property.mapsUrl || '').trim();
  const mapsEmbedUrl = String(property.mapsEmbedUrl || '').trim();
  const email = String(property.email || '').trim();

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
            <button type="button" class="btn-ghost btn-sm" data-scroll="ketersediaan">Ketersediaan</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="galeri">Galeri</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="harga">Harga</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="fasilitas">Fasilitas</button>
            <button type="button" class="btn-ghost btn-sm" data-scroll="lokasi">Lokasi</button>
          </nav>

          <div class="ml-auto flex items-center gap-2">
            <a href="${adminHref}" class="btn-outline btn-sm hidden sm:inline-flex">${icon('LockKeyhole', 'w-4 h-4')} ${adminLabel}</a>
            <button type="button" class="btn-primary btn-sm" data-book>${icon('CalendarClock', 'w-4 h-4')} <span class="hidden sm:inline">Booking</span></button>
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
                  <button type="button" class="btn-primary px-5 py-3" data-book>
                    ${icon('CalendarClock', 'w-4 h-4')} Booking Kamar
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
                    <dd class="text-xl font-black text-stone-800 mt-1">${catalog.availability.total ?? catalog.rooms.length}</dd>
                  </div>
                  <div class="rounded-2xl bg-white border border-line p-3.5">
                    <dt class="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Terisi</dt>
                    <dd class="text-xl font-black text-rose-700 mt-1">${catalog.availability.occupied ?? 0}</dd>
                  </div>
                  <div class="rounded-2xl bg-white border border-line p-3.5">
                    <dt class="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Tersisa</dt>
                    <dd class="text-xl font-black text-emerald-700 mt-1">${catalog.availability.available ?? 0}</dd>
                  </div>
                </dl>

                <p class="text-[11px] text-stone-500 mt-4 flex items-center gap-1.5">
                  ${icon('MapPin', 'w-3.5 h-3.5 text-gold-700')}
                  ${esc(property.address || 'Lokasi Casa Ramire')}
                </p>
              </div>

              <div class="animate-in">${hero(catalog)}</div>
            </div>
          </div>
        </section>

        ${availabilitySection(catalog)}

        <section id="galeri" class="scroll-mt-20 py-12 sm:py-16">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div class="max-w-2xl">
                <span class="badge-gold">Galeri Casa Ramire</span>
                <h2 class="page-title mt-3">Lihat suasananya sebelum memutuskan.</h2>
                <p class="page-subtitle">
                  Foto asli kamar dan area properti. Semua kamar bertipe sama, jadi kamu sudah bisa membayangkan kenyamanannya.
                </p>
              </div>
              <button type="button" class="btn-primary btn-sm" data-book>${icon('CalendarClock', 'w-4 h-4')} Booking setelah lihat</button>
            </div>
            <div class="mt-7">${galleryGrid(catalog)}</div>
          </div>
        </section>

        <section id="harga" class="scroll-mt-20 py-12 sm:py-16 bg-white border-y border-line">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="max-w-2xl">
              <span class="badge-gold">Harga & Paket Sewa</span>
              <h2 class="page-title mt-3">Pilih durasi, harga langsung terlihat.</h2>
              <p class="page-subtitle">
                Semakin lama, semakin hemat per bulan. Kode promo bisa dipakai saat booking.
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mt-7">
              ${priceCard(catalog, 'lantai2')}
              ${priceCard(catalog, 'lantai3')}
            </div>

            <p class="hint mt-4">
              * Harga dapat berubah sewaktu-waktu. Tambahan parkir mobil ${rupiah(CAR_FEE)}/bulan.
              Deposit ${rupiah(property.deposit || 0)} dibayar saat check-in.
            </p>
          </div>
        </section>

        <section id="fasilitas" class="scroll-mt-20 py-12 sm:py-16">
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

        <section id="lokasi" class="scroll-mt-20 py-12 sm:py-16 bg-white border-y border-line">
          <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
              <div>
                <span class="badge-gold">Lokasi</span>
                <h2 class="page-title mt-3">Cek titik lokasi Casa Ramire.</h2>
                <p class="page-subtitle">
                  Lihat posisi kos di Google Maps, lalu atur jadwal survei dengan admin.
                </p>
                <div class="space-y-2 mt-5">
                  <div class="card rounded-2xl p-4 flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">${icon('MapPin', 'w-4 h-4')}</span>
                    <div>
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Alamat</p>
                      <p class="text-sm font-semibold text-stone-800 mt-0.5">${esc(property.address || 'Casa Ramire')}</p>
                    </div>
                  </div>
                  <div class="card rounded-2xl p-4 flex items-start gap-3">
                    <span class="w-9 h-9 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">${icon('Clock', 'w-4 h-4')}</span>
                    <div>
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Survei</p>
                      <p class="text-sm font-semibold text-stone-800 mt-0.5">Atur jadwal dengan admin</p>
                    </div>
                  </div>
                </div>
                ${
                  mapsUrl
                    ? `<a href="${esc(mapsUrl)}" target="_blank" rel="noopener" class="btn-primary btn-sm mt-4">${icon('ExternalLink', 'w-4 h-4')} Buka di Google Maps</a>`
                    : ''
                }
              </div>
              <div class="rounded-3xl overflow-hidden border border-line bg-stone-100 shadow-sm">
                ${
                  mapsEmbedUrl
                    ? `<iframe src="${esc(mapsEmbedUrl)}" width="100%" height="380" style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="Peta lokasi ${esc(property.name)}"></iframe>`
                    : `<div class="h-[380px] flex flex-col items-center justify-center gap-2 text-stone-500">
                        ${icon('MapPin', 'w-8 h-8')}
                        <p class="text-sm font-bold">Peta belum diatur</p>
                      </div>`
                }
              </div>
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
                    Suka dengan kamarnya? Booking sekarang.
                  </h2>
                  <p class="text-sm text-stone-300 mt-3 max-w-xl leading-relaxed">
                    Isi form booking online, admin akan menghubungi kamu untuk konfirmasi kamar dan jadwal check-in.
                  </p>
                  <div class="flex flex-wrap gap-2.5 mt-6">
                    <button type="button" class="btn-gold px-5 py-3" data-book>${icon('CalendarClock', 'w-4 h-4')} Booking Kamar</button>
                    ${
                      wa
                        ? `<a href="${wa}" target="_blank" rel="noopener" class="btn-outline border-white/20 bg-white/5 text-white hover:bg-white/10 px-5 py-3">${icon('MessageCircle', 'w-4 h-4')} Chat WhatsApp</a>`
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
                    <span class="w-9 h-9 rounded-xl bg-white/10 text-gold flex items-center justify-center shrink-0">${icon('Send', 'w-4 h-4')}</span>
                    <div class="min-w-0">
                      <p class="text-[10px] font-extrabold uppercase tracking-wider text-gold">Email</p>
                      ${
                        email
                          ? `<a href="mailto:${esc(email)}" class="text-sm font-semibold text-white mt-0.5 hover:text-gold break-all">${esc(email)}</a>`
                          : `<p class="text-sm font-semibold text-white mt-0.5">Belum diatur</p>`
                      }
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
            <button type="button" class="hover:text-brand" data-scroll="galeri">Galeri</button>
            <button type="button" class="hover:text-brand" data-scroll="harga">Harga</button>
            <button type="button" class="hover:text-brand" data-scroll="lokasi">Lokasi</button>
            <button type="button" class="hover:text-brand" data-scroll="kontak">Kontak</button>
            <a href="${adminHref}" class="hover:text-brand">${adminLabel}</a>
          </div>
          <p class="text-[10px] text-stone-400">© ${new Date().getFullYear()} ${esc(property.name)}</p>
        </div>
      </footer>
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/* Booking modal                                                       */
/* ------------------------------------------------------------------ */

function summaryHtml(quote, deposit) {
  if (quote.error) {
    return `<div class="flex items-start gap-2 text-rose-700">${icon('CircleAlert', 'w-4 h-4 shrink-0 mt-0.5')}<span class="font-semibold">${esc(quote.error)}</span></div>`;
  }

  return `
    <div class="flex justify-between gap-3"><span class="text-stone-500">Sewa (${quote.units} ${quote.period.unit})</span><span class="font-bold">${rupiah(quote.base)}</span></div>
    ${
      quote.discount > 0
        ? `<div class="flex justify-between gap-3 text-rose-700"><span>Diskon${quote.promo ? ` (${esc(quote.promo.name)})` : ''}</span><span class="font-bold">−${rupiah(quote.discount)}</span></div>`
        : ''
    }
    ${
      quote.carTotal > 0
        ? `<div class="flex justify-between gap-3 text-amber-800"><span>Parkir mobil</span><span class="font-bold">${rupiah(quote.carTotal)}</span></div>`
        : ''
    }
    <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="font-bold text-stone-700">Total sewa</span><span class="font-extrabold text-stone-800">${rupiah(quote.total)}</span></div>
    <div class="flex justify-between gap-3"><span class="text-stone-500">Deposit (dibayar saat check-in)</span><span class="font-bold">${rupiah(deposit)}</span></div>
    <p class="text-[10px] text-stone-600 pt-1">Periode: ${formatDate(quote.start)} — ${formatDate(quote.end)}</p>
  `;
}

function openBookingModal(catalog, { floor = '2', periode = '1' } = {}) {
  let appliedCode = '';
  let initialFloor = String(floor);
  let initialPeriode = String(periode);
  const deposit = Number(catalog.property.deposit) || 0;

  const instance = openModal({
    title: 'Booking Kamar',
    subtitle: `${catalog.property.name} · isi data, admin akan mengonfirmasi ketersediaan.`,
    size: 'lg',
    body: `
      <form id="hm-form" class="space-y-5" novalidate>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="label" for="hm-name">Nama lengkap <span class="text-rose-500">*</span></label>
            <input id="hm-name" type="text" class="input" placeholder="Nama lengkap" required />
          </div>
          <div>
            <label class="label" for="hm-phone">No. WhatsApp <span class="text-rose-500">*</span></label>
            <input id="hm-phone" type="tel" class="input" placeholder="cth: 08123456789" required />
          </div>
          <div>
            <label class="label" for="hm-email">Email <span class="text-rose-500">*</span></label>
            <input id="hm-email" type="email" class="input" placeholder="nama@email.com" required />
            <p class="hint mt-1">Untuk konfirmasi & tagihan.</p>
          </div>
          <div>
            <label class="label" for="hm-job">Pekerjaan / instansi</label>
            <input id="hm-job" type="text" class="input" placeholder="Mahasiswa / Karyawan" />
          </div>
        </div>

        <div class="grid sm:grid-cols-3 gap-3">
          <div>
            <label class="label" for="hm-floor">Lantai</label>
            <select id="hm-floor" class="select">
              <option value="2" ${initialFloor === '2' ? 'selected' : ''}>Lantai 2</option>
              <option value="3" ${initialFloor === '3' ? 'selected' : ''}>Lantai 3</option>
            </select>
          </div>
          <div>
            <label class="label" for="hm-periode">Durasi sewa</label>
            <select id="hm-periode" class="select">
              ${PERIODS.map((period) => `<option value="${period.key}" ${period.key === initialPeriode ? 'selected' : ''}>${period.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="label" for="hm-start">Tanggal mulai</label>
            <input id="hm-start" type="date" class="input" value="${todayISO()}" />
          </div>
        </div>

        <div id="hm-end-wrap" class="hidden">
          <label class="label" for="hm-end">Tanggal selesai</label>
          <input id="hm-end" type="date" class="input" />
        </div>

        <label class="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 cursor-pointer">
          <input id="hm-car" type="checkbox" class="w-4 h-4 accent-brand mt-0.5" />
          <span>
            <span class="block text-xs font-bold text-stone-800">Saya membawa mobil</span>
            <span class="block text-[11px] text-stone-600 mt-0.5">Tambahan parkir ${rupiah(CAR_FEE)}/bulan.</span>
          </span>
        </label>

        <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Kode promo</p>
            <span class="badge-gold">Opsional</span>
          </div>
          <div class="flex gap-2">
            <input id="hm-promo" type="text" class="input font-mono uppercase" placeholder="cth: MAHASISWA5" maxlength="24" autocomplete="off" />
            <button type="button" class="btn-outline btn-sm shrink-0" data-apply-promo>Terapkan</button>
          </div>
          <p id="hm-promo-status" class="text-[11px] text-stone-500">
            ${catalog.promos.length ? 'Masukkan kode promo dari admin, lalu klik Terapkan.' : 'Belum ada kode promo aktif saat ini.'}
          </p>
        </div>

        <div class="rounded-2xl border border-line bg-stone-50/60 p-4 space-y-3">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Kontak darurat (opsional)</p>
          <div class="grid sm:grid-cols-3 gap-2">
            <input id="hm-ec-name" type="text" class="input input-sm" placeholder="Nama kontak" />
            <input id="hm-ec-relation" type="text" class="input input-sm" placeholder="Hubungan" />
            <input id="hm-ec-phone" type="tel" class="input input-sm" placeholder="No. telepon" />
          </div>
        </div>

        <div>
          <label class="label" for="hm-notes">Catatan / permintaan khusus</label>
          <textarea id="hm-notes" rows="2" class="input" placeholder="cth: minta kamar dekat jendela, rencana survei"></textarea>
        </div>

        <div id="hm-summary" class="rounded-2xl border border-line bg-cream/70 p-4 text-xs space-y-2"></div>
      </form>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Batal</button>
      <button type="submit" form="hm-form" class="btn-primary btn-sm" data-submit>${icon('Send', 'w-4 h-4')} Kirim Booking</button>
    `,
    onMount(el, close) {
      const value = (selector) => el.querySelector(selector)?.value.trim() ?? '';
      const summary = el.querySelector('#hm-summary');
      const promoInput = el.querySelector('#hm-promo');
      const promoStatus = el.querySelector('#hm-promo-status');
      const periodeSelect = el.querySelector('#hm-periode');
      const startInput = el.querySelector('#hm-start');
      const endInput = el.querySelector('#hm-end');
      const endWrap = el.querySelector('#hm-end-wrap');
      const submitButton = el.querySelector('[data-submit]');
      const isShortPeriod = (periode) => periode === 'harian' || periode === 'mingguan';

      const toggleEnd = () => {
        const short = isShortPeriod(periodeSelect.value);
        endWrap.classList.toggle('hidden', !short);
        if (short) {
          const minimum = periodeSelect.value === 'harian' ? 1 : 7;
          const start = startInput.value || todayISO();
          if (!endInput.value || endInput.value <= start) {
            endInput.value = addDays(start, minimum);
          }
        }
      };

      const currentQuote = () => {
        const promo = findPromo(catalog, appliedCode);
        if (appliedCode && !promo) {
          return { error: 'Kode promo tidak ditemukan atau sudah tidak aktif.' };
        }
        if (promo && promoRemaining(promo) <= 0) {
          return { error: 'Kode promo ini sudah habis dipakai.' };
        }
        return quoteFor(catalog, {
          floor: el.querySelector('#hm-floor').value,
          periode: periodeSelect.value,
          startDate: startInput.value,
          endDate: endInput.value,
          promo,
          car: Boolean(el.querySelector('#hm-car').checked),
        });
      };

      const paintSummary = () => {
        const quote = currentQuote();
        summary.innerHTML = summaryHtml(quote, deposit);
        return quote;
      };

      const paintPromoStatus = () => {
        if (!appliedCode) {
          promoStatus.className = 'text-[11px] text-stone-500';
          promoStatus.textContent = catalog.promos.length
            ? 'Masukkan kode promo dari admin, lalu klik Terapkan.'
            : 'Belum ada kode promo aktif saat ini.';
          return;
        }
        const promo = findPromo(catalog, appliedCode);
        if (!promo) {
          promoStatus.className = 'text-[11px] font-bold text-rose-700';
          promoStatus.textContent = 'Kode promo tidak ditemukan atau sudah tidak aktif.';
          return;
        }
        const remaining = promoRemaining(promo);
        if (remaining <= 0) {
          promoStatus.className = 'text-[11px] font-bold text-rose-700';
          promoStatus.textContent = 'Kode promo ini sudah habis dipakai.';
          return;
        }
        const value = promo.type === 'persen' ? `${toNumber(promo.value)}%` : rupiah(promo.value);
        promoStatus.className = 'text-[11px] font-bold text-emerald-700';
        promoStatus.textContent = `Promo ${promo.name} (${value}) diterapkan.${Number.isFinite(remaining) ? ` Sisa kuota: ${remaining}.` : ''}`;
      };

      el.querySelector('[data-apply-promo]')?.addEventListener('click', () => {
        const code = normalizePromoCode(promoInput.value);
        if (!code) {
          appliedCode = '';
          paintPromoStatus();
          paintSummary();
          return;
        }
        const promo = findPromo(catalog, code);
        if (!promo) {
          appliedCode = code;
          paintPromoStatus();
          paintSummary();
          toast('Kode promo tidak ditemukan.', 'error');
          return;
        }
        if (promoRemaining(promo) <= 0) {
          appliedCode = code;
          paintPromoStatus();
          paintSummary();
          toast('Kode promo sudah habis dipakai.', 'error');
          return;
        }
        appliedCode = normalizePromoCode(promo.code);
        promoInput.value = appliedCode;
        paintPromoStatus();
        paintSummary();
        toast('Kode promo diterapkan.');
      });

      promoInput.addEventListener('input', () => {
        if (normalizePromoCode(promoInput.value) !== appliedCode) {
          appliedCode = '';
          paintPromoStatus();
          paintSummary();
        }
      });

      el.querySelector('#hm-car').addEventListener('change', paintSummary);
      el.querySelector('#hm-floor').addEventListener('change', paintSummary);
      periodeSelect.addEventListener('change', () => {
        toggleEnd();
        paintSummary();
      });
      startInput.addEventListener('change', () => {
        if (isShortPeriod(periodeSelect.value)) {
          const minimum = periodeSelect.value === 'harian' ? 1 : 7;
          if (!endInput.value || endInput.value <= startInput.value) {
            endInput.value = addDays(startInput.value, minimum);
          }
        }
        paintSummary();
      });
      endInput.addEventListener('change', paintSummary);

      toggleEnd();
      paintPromoStatus();
      paintSummary();

      el.querySelector('#hm-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const quote = paintSummary();
        if (quote.error) {
          toast(quote.error, 'error');
          return;
        }

        const name = value('#hm-name');
        const phone = value('#hm-phone');
        const email = value('#hm-email');
        if (name.length < 2) return toast('Nama lengkap wajib diisi.', 'warning');
        if (phone.replace(/\D/g, '').length < 8) return toast('Nomor WhatsApp tidak valid.', 'warning');
        if (!isValidEmail(email)) return toast('Alamat email tidak valid.', 'warning');

        const payload = {
          name,
          phone,
          email,
          job: value('#hm-job'),
          notes: value('#hm-notes'),
          emergencyContact: {
            name: value('#hm-ec-name'),
            relation: value('#hm-ec-relation'),
            phone: value('#hm-ec-phone'),
          },
          floor: el.querySelector('#hm-floor').value,
          periode: periodeSelect.value,
          startDate: startInput.value || todayISO(),
          endDate: isShortPeriod(periodeSelect.value) ? endInput.value : '',
          car: Boolean(el.querySelector('#hm-car').checked),
          promoCode: appliedCode,
          estimate: quote.total,
        };

        submitButton.disabled = true;
        try {
          const request = await submitBookingRequest(payload);
          close();
          openBookingSuccessModal(catalog, request, quote);
        } catch (error) {
          toast(error.message, 'error');
        } finally {
          submitButton.disabled = false;
        }
      });
    },
  });

  void instance;
}

function openBookingSuccessModal(catalog, request, quote) {
  const property = catalog.property;
  const message = `Halo Admin ${property.name}, saya sudah mengirim booking online dengan kode ${request.code} atas nama ${request.name}. Mohon konfirmasi ketersediaan kamar.`;
  const wa = waHref(property, message);

  openModal({
    title: 'Booking Berhasil Dikirim',
    subtitle: 'Admin akan menghubungi kamu untuk konfirmasi.',
    size: 'md',
    body: `
      <div class="space-y-4">
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <span class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">${icon('CheckCircle2', 'w-6 h-6')}</span>
          <p class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 mt-3">Kode booking</p>
          <p class="text-2xl font-black text-emerald-900 font-mono">${esc(request.code)}</p>
          <p class="text-[11px] text-emerald-800 mt-1">Simpan kode ini untuk komunikasi dengan admin.</p>
        </div>

        <div class="rounded-2xl border border-line bg-cream/60 p-4 text-xs space-y-2">
          <div class="flex justify-between gap-3"><span class="text-stone-500">Nama</span><b class="text-stone-800">${esc(request.name)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Email</span><b class="text-stone-800 break-all text-right">${esc(request.email)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Lantai</span><b class="text-stone-800">Lantai ${esc(request.floor || '—')}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Durasi</span><b class="text-stone-800">${esc(quote.period.label)}</b></div>
          <div class="flex justify-between gap-3"><span class="text-stone-500">Periode</span><b class="text-stone-800 text-right">${formatDate(quote.start)} — ${formatDate(quote.end)}</b></div>
          ${request.car ? `<div class="flex justify-between gap-3"><span class="text-stone-500">Parkir mobil</span><b class="text-stone-800">${rupiah(CAR_FEE)}/bulan</b></div>` : ''}
          <div class="flex justify-between gap-3 pt-2 border-t border-line"><span class="text-stone-500">Estimasi total sewa</span><b class="text-stone-800">${rupiah(quote.total)}</b></div>
          <p class="text-[10px] text-stone-500">Deposit ${rupiah(catalog.property.deposit || 0)} dibayar saat check-in. Total final dikonfirmasi admin.</p>
        </div>

        ${
          request.offline
            ? `<div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900">Mode lokal: API booking belum tersedia. Permintaan tersimpan di perangkat ini dan bisa diproses dari menu Booking Online.</div>`
            : `<div class="rounded-xl border border-line bg-white px-3 py-2.5 text-[11px] text-stone-600 leading-relaxed">Admin akan mengirim konfirmasi ke <b>${esc(request.email)}</b> atau menghubungi WhatsApp <b>${esc(request.phone)}</b>.</div>`
        }
      </div>
    `,
    footer: `
      <button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>
      ${
        wa
          ? `<a href="${wa}" target="_blank" rel="noopener" class="btn-primary btn-sm">${icon('MessageCircle', 'w-4 h-4')} Konfirmasi ke Admin</a>`
          : ''
      }
    `,
  });
}

/* ------------------------------------------------------------------ */
/* Binding                                                             */
/* ------------------------------------------------------------------ */

function openLightbox(catalog, index) {
  const item = catalog.gallery[index];
  if (!item) return;
  openModal({
    title: item.caption || `Galeri ${catalog.property.name}`,
    size: 'full',
    body: `<img src="${esc(item.url)}" alt="${esc(item.caption || 'Foto galeri')}" class="w-full h-auto rounded-xl" />`,
    footer: `<button type="button" class="btn-outline btn-sm" data-modal-close>Tutup</button>`,
  });
}

function bindLanding(root, catalog) {
  root.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.scroll;
      const target = id ? root.querySelector(`#${id}`) : null;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  root.querySelectorAll('[data-book]').forEach((button) => {
    button.addEventListener('click', () => openBookingModal(catalog));
  });

  root.querySelectorAll('[data-book-floor]').forEach((button) => {
    button.addEventListener('click', () =>
      openBookingModal(catalog, {
        floor: button.dataset.bookFloor,
        periode: button.dataset.bookPeriod || '1',
      }),
    );
  });

  root.querySelectorAll('[data-gallery-index]').forEach((button) => {
    button.addEventListener('click', () =>
      openLightbox(catalog, Number(button.dataset.galleryIndex)),
    );
  });

  root.querySelector('[data-action="open-settings"]')?.addEventListener('click', () => {
    openSettingsModal();
  });

  const property = catalog.property;
  document.title = `${property.name} — Kos Deluxe Yogyakarta`;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      'content',
      property.description || `${property.name} — kos deluxe, galeri foto, harga sewa, dan booking online.`,
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

  (async () => {
    try {
      const published = await fetchPublishedCatalog().catch((error) => {
        console.warn('[home] gagal memuat katalog publik, memakai data lokal', error);
        return null;
      });

      if (root.dataset.homeRenderId !== renderId || !root.querySelector('[data-view="home"]')) {
        return;
      }

      let catalog = published ? normalizeCatalog(published) : localCatalog;
      if (published) {
        paint(root, catalog, { preview: false, source: 'published' });
      }

      const live = await fetchLiveAvailability();
      if (
        !live ||
        root.dataset.homeRenderId !== renderId ||
        !root.querySelector('[data-view="home"]')
      ) {
        return;
      }

      catalog = {
        ...catalog,
        availability: live.availability,
        rooms: live.rooms.length ? live.rooms : catalog.rooms,
      };
      paint(root, catalog, { preview: false, source: published ? 'published' : 'local' });
    } catch (error) {
      console.warn('[home] gagal memuat data ketersediaan', error);
    }
  })();
}
