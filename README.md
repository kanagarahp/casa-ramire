# Casa Ramire — Property Management

Sistem manajemen properti kos untuk **Casa Ramire**. Aplikasi ini menggantikan
file `index.html` tunggal yang lama dengan arsitektur modul yang lebih rapi,
mudah dirawat, dan siap dikembangkan.

Aplikasi berjalan sepenuhnya di browser (*local-first*): tidak membutuhkan
server, database, atau koneksi internet setelah halaman dimuat. Data disimpan di
`localStorage` perangkat dan dapat dicadangkan ke file JSON.

## Fitur

| Modul | Kemampuan |
| --- | --- |
| **Landing Page** | Katalog kamar publik di `casaramire.com`, foto kamar, harga per lantai, fasilitas, dan tombol WhatsApp admin |
| **Dashboard** | KPI okupansi, antrean check-in, **Akan Berakhir** (≤ 7 hari), **Menunggak** (tagihan lewat jatuh tempo + lama tunggakan), arus kas 6 bulan, okupansi per lantai, tagihan aktif |
| **Status Kamar** | 42 kamar (201–221, 301–321), filter lantai/status, pencarian, tampilan grid/daftar, tambah/hapus kamar, unggah foto kamar |
| **Booking & Check-in** | Booking kamar, check-in langsung, edit booking, pembayaran DP/lunas, deposit terpisah dari pendapatan |
| **Kontrak** | Perpanjangan kontrak, pindah kamar dengan riwayat hunian, check-out, tambah tagihan, invoice layanan |
| **Pricelist & Promo** | Tarif harian/mingguan/1/3/6/12 bulan per lantai, promo rupiah atau persen |
| **Add-On** | Layanan tambahan bulanan (parkir, kulkas, dispenser, dll.) |
| **Penghuni** | Direktori, biodata, kontak darurat, riwayat kamar, riwayat pembayaran, tunggakan |
| **Financial** | Jurnal pengeluaran + kategori, invoice layanan, pendapatan accrual, laba rugi |
| **Sewa & Kas** | Daftar tagihan, filter status, verifikasi/batal verifikasi pembayaran, pengingat WhatsApp, **link pembayaran DOKU** |
| **Pembayaran DOKU** | Link QRIS/VA/e-wallet per tagihan, invoice, dan perpanjangan; status lunas otomatis lewat webhook; perpanjangan otomatis setelah dibayar |
| **Sinkronisasi** | State operasional dibagikan lewat `/api/state` agar status pembayaran dari webhook langsung terlihat di dashboard |
| **Konten WA** | Editor template tagihan, invoice, pengingat; preview WhatsApp; variabel otomatis |
| **Akun** | Manajemen pengguna khusus owner, role owner/staf, reset password, aktif/nonaktif |
| **Pengaturan** | Ganti password, backup/restore JSON, reset operasional, factory reset |

### Aturan pembukuan

- **Deposit** dicatat sebagai kewajiban (bukan pendapatan).
- **Pendapatan sewa** diakui sebesar biaya bulanan kontrak (*accrual*).
- Pembayaran sewa di atas biaya bulanan dicatat sebagai **pendapatan dimuka**.
- Diskon rupiah dihitung per bulan kontrak; diskon persen dihitung dari total sewa.
- Add-on dihitung per bulan dan masuk ke biaya bulanan penghuni.
- Tagihan yang sudah diverifikasi dapat dibatalkan; saldo penghuni ikut disesuaikan.

## Landing page & katalog publik

Halaman publik ada di `#/home` dan otomatis menjadi halaman pertama saat
pengunjung membuka `casaramire.com` tanpa sesi login. Halaman ini menampilkan:

- katalog kamar beserta status ketersediaan,
- harga per lantai untuk paket 1/3/6/12 bulan,
- fasilitas dan deposit,
- tombol **Chat Admin** ke WhatsApp.

Alur publikasi dari akun admin:

1. Buka **Status Kamar → Foto** pada kamar yang ingin dilengkapi fotonya.
2. Buka **Pengaturan → Landing page & katalog publik**.
3. Isi nomor WhatsApp admin, alamat, deskripsi, dan fasilitas.
4. Masukkan **Kunci publikasi katalog**.
5. Klik **Publikasikan katalog**.

Data operasional tetap disimpan di `localStorage` perangkat. Saat publikasi,
aplikasi mengirim *snapshot* katalog yang aman (tanpa data penghuni/tagihan) ke
`/api/catalog`. Foto diunggah ke `/api/catalog/photo`. Kedua endpoint adalah
Vercel Function yang menyimpan data di Postgres, sehingga pengunjung di
perangkat lain bisa melihat katalog yang sama.

Environment yang dibutuhkan di Vercel:

```text
POSTGRES_URL / POSTGRES_URL_NON_POOLING   # sudah tersedia dari integrasi database
CATALOG_ADMIN_KEY                          # kunci untuk publikasi dari aplikasi
```

`CATALOG_ADMIN_KEY` **tidak** ditanam di bundle frontend. Kunci dimasukkan sekali
oleh admin melalui Pengaturan dan disimpan hanya di perangkat admin tersebut.
File `.env.catalog` (di-ignore Git) menyimpan kunci untuk referensi lokal.

## Pembayaran DOKU otomatis

Aplikasi bisa membuat **link pembayaran DOKU Checkout** untuk:

- tagihan sewa / tagihan tambahan,
- invoice layanan manual,
- perpanjangan kontrak (dari form **Perpanjang**).

Alur singkat:

1. Admin membuat tagihan / invoice / perpanjangan seperti biasa.
2. Klik **Link DOKU** (atau **Buat Link DOKU** di form perpanjangan).
3. Kirim link ke penghuni lewat WhatsApp dari modal yang muncul.
4. Penghuni membayar di halaman DOKU (QRIS / VA / e-wallet).
5. DOKU mengirim webhook ke `/api/payments/doku/notification`.
6. Webhook memverifikasi signature, menandai tagihan/invoice lunas, atau
   memperpanjang kontrak secara otomatis.
7. Aplikasi admin menyinkronkan state dari `/api/state` setiap 15 detik dan saat
   tab kembali aktif. Dashboard langsung berubah:
   - **Menunggak** hilang setelah tagihan lunas.
   - **Akan Berakhir** hilang setelah perpanjangan dibayar.
   - Riwayat pembayaran dan total kas penghuni ikut diperbarui.

Verifikasi manual tetap tersedia untuk pembayaran tunai/transfer di luar DOKU.

### Environment pembayaran

Tambahkan di Vercel Production:

```text
DOKU_MODE=production
DOKU_CLIENT_ID=BRN-...
DOKU_SECRET_KEY=SK-...
APP_URL=https://www.casaramire.com
DOKU_PAYMENT_DUE_MINUTES=10080
CATALOG_ADMIN_KEY=...          # juga dipakai untuk sinkronisasi state
POSTGRES_URL / POSTGRES_URL_NON_POOLING
```

Daftarkan notification URL di DOKU Back Office:

```text
https://www.casaramire.com/api/payments/doku/notification
```

Catatan:

- Channel DOKU harus aktif. Kalau belum, pembuatan link akan gagal dengan
  pesan `PAYMENT CHANNEL IS INACTIVE`.
- Sinkronisasi state baru aktif setelah **Kunci admin** diisi di
  **Pengaturan → Landing page & katalog publik**.
- Data operasional tetap disimpan lokal, lalu disinkronkan ke Postgres. Jika
  ada konflik versi, aplikasi akan memuat state server terbaru dan menampilkan
  peringatan.
- Foto kamar tetap dipublikasikan terpisah lewat **Publikasikan katalog**.

### Notifikasi dashboard

- **Akan Berakhir** menampilkan kontrak aktif yang masa sewanya tinggal 7 hari
  atau sudah lewat.
- **Menunggak** menampilkan penghuni aktif yang memiliki tagihan belum dibayar
  dengan jatuh tempo hari ini atau sebelumnya, beserta lama tunggakan
  (contoh: *Menunggak 2 hari*).
- Notifikasi Menunggak dihitung dari status tagihan. Setelah pembayaran
  diverifikasi (atau tagihan ditandai lunas), entri otomatis hilang.

## Akun awal

Akun default diberikan secara terpisah oleh owner dan sengaja tidak ditampilkan
di halaman login. Segera ganti password melalui **Pengaturan → Ganti password**
setelah login pertama.

Owner dapat mengakses seluruh menu. Staf tidak dapat membuka **Manajemen Akun**
dan tidak melihat aksi pemeliharaan data.

> Password disimpan sebagai hash SHA-256 bersalt di perangkat. Untuk penggunaan
> produksi dengan banyak pengguna, gunakan backend autentikasi sungguhan.

## Menjalankan aplikasi

Prasyarat: Node.js 20+ dan npm.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil produksi di dist/
npm run preview  # pratinjau hasil build
npm test         # unit test (node:test)
npm run deploy   # terbitkan dist/ ke branch gh-pages
```

## Struktur proyek

```
api/
├── catalog.js                 # GET/PUT snapshot katalog publik (Vercel Function)
├── catalog/photo.js           # unggah/ambil foto katalog (Vercel Function)
├── state.js                   # sinkronisasi state operasional (Vercel Function)
└── payments/doku/
    ├── create.js              # buat link DOKU untuk tagihan/invoice/perpanjangan
    └── notification.js        # webhook DOKU + auto-update status
src/
├── core/            # konstanta, format, kriptografi, storage, store, router, seed
├── services/        # logika bisnis (auth, properti, billing, pricing, laporan, katalog, pembayaran, sinkronisasi, ...)
├── ui/              # komponen bersama, modal, toast, ikon, helper DOM
├── views/           # halaman dan modal per fitur (termasuk home.js untuk landing page)
├── styles.css       # Tailwind v4 + design token Casa Ramire
└── main.js          # bootstrap, routing, re-render
tests/               # unit test format, kriptografi, harga, dan notifikasi tunggakan
```

Prinsip utama:

- **Satu arah data**: tampilan membaca state melalui service, aksi memanggil
  service, service memutasi store, lalu store memberi sinyal re-render.
- **Service layer** memisahkan aturan bisnis dari DOM.
- **Event delegation** dipasang pada wrapper view yang dibuat ulang setiap
  render sehingga tidak ada listener ganda.
- Semua nominal disimpan sebagai angka rupiah; format tampilan memakai locale
  `id-ID`.

## Backup & pemulihan

Buka **Pengaturan → Cadangan & pemulihan data**:

- **Unduh backup JSON** menyimpan seluruh state (kamar, penghuni, tagihan,
  invoice, pengeluaran, akun, konfigurasi).
- **Pulihkan dari file** mengganti data saat ini dengan isi backup.
- **Reset data operasional** mengosongkan data operasional tetapi mempertahankan
  akun dan konfigurasi.
- **Factory reset** mengembalikan semuanya ke kondisi awal.

## Deploy ke GitHub Pages

Situs diterbitkan dari branch `gh-pages` (source: **Deploy from a branch →
`gh-pages` / root**). Setiap kali aplikasi diperbarui:

```bash
npm run deploy
```

Perintah tersebut membangun ulang `dist/` lalu mendorong hasilnya ke branch
`gh-pages`. Dengan begitu branch `main` tetap berisi kode sumber yang bersih.

`vite.config.js` memakai `base: './'` sehingga build tetap berjalan di sub-path
GitHub Pages. Routing memakai hash (`#/dashboard`) agar tidak memerlukan
konfigurasi rewrite server. Situs tersedia di:

**https://kanagarahp.github.io/casa-ramire/**

Untuk otomatisasi penuh melalui GitHub Actions, tambahkan scope `workflow` ke
kredensial GitHub (`gh auth refresh -s workflow`) lalu pulihkan workflow Pages
sesuai dokumentasi GitHub. Saat ini deployment dilakukan lewat branch
`gh-pages` agar tidak bergantung pada scope tersebut.

## Deploy ke Vercel

**Produksi:** https://www.casaramire.com/  
**Apex:** https://casaramire.com/ → `308` ke `www.casaramire.com`  
**Dashboard:** https://vercel.com/yan-dev2/casa-ramire

Project Vercel `casa-ramire` sudah terhubung ke repo GitHub ini. Setiap push ke
branch `main` otomatis memicu deployment production.

Konfigurasi `vercel.json` menetapkan:

- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Cache immutable untuk aset ber-hash di `/assets/*`
- Header keamanan dasar (`nosniff`, `Referrer-Policy`)

Tidak diperlukan rewrite SPA karena navigasi aplikasi memakai hash
(`#/dashboard`), sehingga semua rute tetap dilayani oleh `index.html`.

Folder `api/` otomatis diterbitkan sebagai Vercel Function. Endpoint katalog,
state, dan pembayaran membutuhkan environment
`POSTGRES_URL`/`POSTGRES_URL_NON_POOLING` dan `CATALOG_ADMIN_KEY` di project
Vercel. Endpoint DOKU juga membutuhkan `DOKU_MODE`, `DOKU_CLIENT_ID`,
`DOKU_SECRET_KEY`, `APP_URL`, dan `DOKU_PAYMENT_DUE_MINUTES`.

Tanpa database, landing page tetap tampil memakai data lokal/seed, tetapi
tombol **Publikasikan katalog** dan **Link DOKU** akan gagal. Tanpa channel
DOKU yang aktif, link pembayaran tidak bisa dibuat.

## Dokumentasi handoff

Catatan lengkap pekerjaan 23 Oktober 2026 (deployment, domain, aksesibilitas)
ada di [`docs/HANDOFF-2026-10-23.md`](docs/HANDOFF-2026-10-23.md).
Pekerjaan landing page, katalog publik, dan notifikasi dashboard 27 Oktober 2026
ada di [`docs/HANDOFF-2026-10-27.md`](docs/HANDOFF-2026-10-27.md).

## Lisensi

Hak cipta © Casa Ramire. Digunakan untuk keperluan internal properti.
