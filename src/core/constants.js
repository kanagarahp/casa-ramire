/**
 * Application-wide constants and defaults.
 * Keeping them in one module avoids magic strings scattered across the app.
 */

export const APP_NAME = 'Casa Ramire';
export const APP_TAGLINE = 'Property Management OS';
export const STORAGE_KEY = 'casa-ramire:state';
export const SCHEMA_VERSION = 5;

/** Flat monthly surcharge for tenants who bring a car. */
export const CAR_FEE = 130000;
export const CAR_ADDON_NAME = 'Parkir Mobil';
export const SESSION_KEY = 'casa-ramire:session';

export const ROLES = {
  owner: { label: 'Owner / Super Admin', short: 'SUPER ADMIN' },
  staff: { label: 'Staf Operasional', short: 'STAFF ADMIN' },
};

export const ROOM_STATUS = {
  kosong: { label: 'Kosong', badge: 'badge-amber' },
  booking: { label: 'Booking', badge: 'badge-blue' },
  terisi: { label: 'Terisi', badge: 'badge-green' },
};

export const BILL_STATUS = {
  unpaid: { label: 'Belum Bayar', badge: 'badge-amber' },
  paid: { label: 'Lunas', badge: 'badge-green' },
};

export const PERIODS = [
  { key: 'harian', label: 'Harian', unit: 'hari', kind: 'days' },
  { key: 'mingguan', label: 'Mingguan', unit: 'minggu', kind: 'weeks' },
  { key: '1', label: '1 Bulan', unit: 'bulan', kind: 'months', months: 1 },
  { key: '3', label: '3 Bulan', unit: 'bulan', kind: 'months', months: 3 },
  { key: '6', label: '6 Bulan', unit: 'bulan', kind: 'months', months: 6 },
  { key: '12', label: '12 Bulan (1 Tahun)', unit: 'bulan', kind: 'months', months: 12 },
];

export const PERIOD_KEYS = PERIODS.map((p) => p.key);

export const PAYMENT_METHODS = [
  'Virtual Account BCA',
  'Virtual Account Mandiri',
  'QRIS All Payment',
  'Transfer Bank',
  'Tunai / Cash',
];

export const DEFAULT_USERS = [
  {
    name: 'Owner Casa Ramire',
    username: 'owner',
    password: '123456',
    role: 'owner',
  },
  {
    name: 'Admin (Staf Kasir)',
    username: 'admin',
    password: '123456',
    role: 'staff',
  },
];

export const DEFAULT_PRICING = {
  lantai2: {
    harian: 150000,
    mingguan: 850000,
    '1': 2200000,
    '3': 6300000,
    '6': 12000000,
    '12': 23000000,
  },
  lantai3: {
    harian: 140000,
    mingguan: 800000,
    '1': 2100000,
    '3': 6000000,
    '6': 11500000,
    '12': 22000000,
  },
};

export const DEFAULT_ADDONS = [
  { name: CAR_ADDON_NAME, price: CAR_FEE, active: true },
  { name: 'Kulkas Dalam Kamar', price: 75000, active: true },
  { name: 'Dispenser & Aqua', price: 50000, active: true },
];

/**
 * Promo codes are redeemed by prospective tenants on the landing page.
 * `maxUses: 0` means the code can be used unlimited times.
 */
export const DEFAULT_PROMOS = [
  {
    name: 'Diskon Awal Tahun',
    code: 'AWALTAHUN',
    type: 'rupiah',
    value: 200000,
    active: true,
    maxUses: 1,
    usedCount: 0,
  },
  {
    name: 'Promo Mahasiswa 5%',
    code: 'MAHASISWA5',
    type: 'persen',
    value: 5,
    active: true,
    maxUses: 0,
    usedCount: 0,
  },
];

export const BOOKING_REQUEST_STATUS = {
  pending: { label: 'Menunggu', badge: 'badge-amber' },
  confirmed: { label: 'Dikonversi', badge: 'badge-green' },
  rejected: { label: 'Ditolak', badge: 'badge-gray' },
};

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Gaji HK / Kebersihan',
  'Listrik',
  'WiFi / Internet',
  'Sampah & Keamanan',
  'Maintenance',
  'Lain-lain',
];

export const DEFAULT_TEMPLATES = {
  tagihan:
    'Halo Kak {nama} 👋\n\nBerikut tagihan sewa Kamar {kamar} Casa Ramire sebesar *{nominal}* (jatuh tempo: {jatuh_tempo}).\n\nPembayaran dapat dilakukan via VA / QRIS. Terima kasih!',
  manual:
    'Halo Kak {nama} (Kamar {kamar}) 👋\n\nTerbit invoice layanan #{no_invoice} untuk *{item_layanan}* sebesar *{nominal}*.\n\nMohon dapat dibayarkan via VA / QRIS. Terima kasih!',
  reminder:
    'PENGINGAT SEWA CASA RAMIRE ⚠️\n\nHalo Kak {nama}, sewa Kamar {kamar} Anda berakhir pada *{jatuh_tempo}*. Total tagihan *{nominal}*.\n\nSilakan lakukan perpanjangan agar kamar tetap nyaman untuk Anda. Terima kasih!',
};

export const TEMPLATE_VARIABLES = [
  { token: '{nama}', desc: 'Nama penghuni' },
  { token: '{kamar}', desc: 'Nomor kamar' },
  { token: '{nominal}', desc: 'Nominal (Rp)' },
  { token: '{jatuh_tempo}', desc: 'Tanggal jatuh tempo' },
  { token: '{no_invoice}', desc: 'Nomor invoice' },
  { token: '{item_layanan}', desc: 'Item layanan' },
];

export const DEFAULT_DEPOSIT = 500000;

export const PUBLIC_ROUTES = new Set(['home', 'login']);

export const DEFAULT_SETTINGS = {
  propertyName: 'Casa Ramire',
  tagline: 'Kos nyaman, tenang, dan strategis.',
  description:
    'Kamar deluxe dengan fasilitas lengkap di lingkungan yang tenang. Cocok untuk mahasiswa dan pekerja yang ingin tinggal jangka panjang.',
  address: 'Kos Casa Ramire, Yogyakarta',
  whatsapp: '081116623661',
  email: 'casaramirejogja@gmail.com',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=casa+ramire+kost+jogja',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=casa%20ramire%20kost%20jogja&z=16&output=embed',
  facilities: 'AC, WiFi, kasur, lemari, meja kerja, kamar mandi dalam',
  depositDefault: DEFAULT_DEPOSIT,
  catalogAdminKey: '',
  catalogPublishedAt: '',
};

export const NAV_ITEMS = [
  { path: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: 'bookings', label: 'Booking Online', icon: 'Inbox' },
  { path: 'rooms', label: 'Status Kamar', icon: 'Building2' },
  { path: 'gallery', label: 'Galeri Landing', icon: 'Image' },
  { path: 'pricing', label: 'Pricelist & Diskon', icon: 'Tags' },
  { path: 'addons', label: 'Master Add-On', icon: 'CirclePlus' },
  { path: 'tenants', label: 'Penghuni & Kontrak', icon: 'Users' },
  { path: 'financial', label: 'Financial & Keuangan', icon: 'Wallet' },
  { path: 'billing', label: 'Sewa & Verifikasi Kas', icon: 'ReceiptText' },
  { path: 'content', label: 'Konten & WA Preview', icon: 'MessageSquareText' },
  { path: 'users', label: 'Manajemen Akun', icon: 'UserCog', ownerOnly: true },
];

export const PAGE_META = {
  dashboard: { title: 'Dashboard', subtitle: 'Ringkasan operasional properti' },
  bookings: { title: 'Booking Online', subtitle: 'Permintaan booking dari landing page' },
  rooms: { title: 'Status Kamar', subtitle: 'Inventaris dan okupansi kamar' },
  gallery: { title: 'Galeri Landing', subtitle: 'Foto yang tampil di halaman publik' },
  pricing: { title: 'Pricelist & Diskon', subtitle: 'Strategi tarif dan promo' },
  addons: { title: 'Master Add-On', subtitle: 'Layanan tambahan berbayar' },
  tenants: { title: 'Penghuni & Kontrak', subtitle: 'Direktori dan riwayat sewa' },
  financial: { title: 'Financial & Keuangan', subtitle: 'Jurnal, invoice, dan laba rugi' },
  billing: { title: 'Sewa & Verifikasi Kas', subtitle: 'Tagihan dan konfirmasi pembayaran' },
  content: { title: 'Konten & WA Preview', subtitle: 'Template pesan otomatis' },
  users: { title: 'Manajemen Akun', subtitle: 'Akses staf dan keamanan' },
};
