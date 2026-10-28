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
| **Landing Page** | Galeri foto properti (bukan katalog per kamar), statistik kamar tersedia/terisi/tersisa, pricelist per lantai, fasilitas, titik Google Maps, dan **booking online** |
| **Booking Online** | Permintaan booking dari landing page: nama, WhatsApp, email, durasi, tanggal, kontak darurat, opsi bawa mobil (+Rp130.000/bln), dan kode promo |
| **Dashboard** | KPI okupansi, antrean check-in, **Akan Berakhir** (≤ 7 hari), **Menunggak** (tagihan lewat jatuh tempo + lama tunggakan), arus kas 6 bulan, okupansi per lantai, tagihan aktif |
| **Galeri Landing** | Unggah, ganti, hapus, dan urutkan foto galeri landing page; publikasi otomatis ke CDN foto katalog |
| **Status Kamar** | 42 kamar (201–221, 301–321), filter lantai/status, pencarian, tampilan grid/daftar, tambah/hapus kamar, unggah foto kamar |
| **Booking & Check-in** | Booking kamar, check-in langsung, edit booking, pembayaran DP/lunas, deposit terpisah dari pendapatan, **email penghuni** |
| **Kontrak** | Perpanjangan kontrak, pindah kamar dengan riwayat hunian, check-out, tambah tagihan, invoice layanan |
| **Pricelist & Promo** | Tarif harian/mingguan/1/3/6/12 bulan per lantai, promo rupiah/persen, **kode promo sekali/multi pakai** |
| **Add-On** | Layanan tambahan bulanan (parkir, kulkas, dispenser, dll.) |
| **Penghuni** | Direktori, biodata + email, kontak darurat, **lama tinggal sejak check-in**, riwayat kamar/pindah, riwayat pembayaran + pembayaran terakhir, tunggakan |
| **Financial** | Jurnal pengeluaran + kategori, invoice layanan untuk **tenant/non-tenant**, pendapatan accrual, laba rugi |
| **Sewa & Kas** | Daftar tagihan, filter status, verifikasi/batal verifikasi pembayaran, pengingat WhatsApp, **link pembayaran DOKU + kirim tagihan ke email** |
| **Pembayaran DOKU** | Link QRIS/VA/e-wallet per tagihan, invoice, dan perpanjangan; status lunas otomatis lewat webhook; perpanjangan otomatis setelah dibayar |
| **Email Tagihan** | Kirim link pembayaran/tagihan ke email penghuni melalui Resend, dengan fallback ke aplikasi email perangkat |
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

## Landing page, galeri & booking online

Halaman publik ada di `#/home` dan otomatis menjadi halaman pertama saat
pengunjung membuka `casaramire.com` tanpa sesi login. Karena Casa Ramire hanya
memiliki satu tipe kamar, halaman ini **tidak menampilkan katalog per kamar**.
Isinya:

- galeri foto properti (hero + grid + lightbox),
- statistik **total kamar, terisi, booking, dan tersisa** (live dari state),
- daftar nomor kamar yang masih kosong per lantai,
- pricelist per lantai untuk paket harian/mingguan/1/3/6/12 bulan,
- fasilitas, deposit, dan titik Google Maps `casa ramire kost jogja`,
- tombol WhatsApp, email properti (`casaramirejogja@gmail.com`), dan
  **form booking online**.

Form booking berisi nama, WhatsApp, email, pekerjaan, lantai, durasi sewa,
tanggal mulai, kontak darurat, catatan, **opsi membawa mobil (+Rp130.000/bln)**,
dan **kode promo**. Estimasi total langsung dihitung dari pricelist yang
dipublikasikan. Setelah dikirim, calon penghuni menerima kode booking
(`CRB-…`) dan admin dapat memprosesnya dari menu **Booking Online**.

### Alur galeri & publikasi

1. Buka **Galeri Landing**.
2. Klik **Tambah Foto**, pilih satu/beberapa foto, atur urutan dan keterangan.
3. Isi **Kunci admin** di **Pengaturan** bila belum.
4. Klik **Publikasikan** (atau **Pengaturan → Publikasikan katalog**).

Saat publikasi, foto lokal diunggah ke `/api/catalog/photo`, lalu snapshot aman
(tanpa data penghuni/tagihan) dikirim ke `/api/catalog`. Foto pertama menjadi
gambar utama hero. Data operasional tetap disimpan di `localStorage` perangkat
dan disinkronkan ke `/api/state`.

### Kode promo

Buat/edit promo di **Pricelist & Diskon**. Setiap promo punya **kode unik** dan
**kuota pemakaian**:

- `1` = sekali pakai,
- `0` = tanpa batas.

Kode hanya bisa dipakai calon penghuni saat booking di landing page. Kuota
dikunci dan dikurangi secara atomik di server (`casa_promo_codes`), sehingga dua
orang tidak bisa memakai kode sekali-pakai secara bersamaan. Jika booking
ditolak admin, kuota dikembalikan. Publikasikan katalog setelah mengubah promo
agar kode terbaru aktif di landing page.

### Environment publikasi

```text
POSTGRES_URL / POSTGRES_URL_NON_POOLING   # database katalog, state, booking, promo
CATALOG_ADMIN_KEY                          # kunci publikasi & sinkronisasi
```

`CATALOG_ADMIN_KEY` **tidak** ditanam di bundle frontend. Kunci dimasukkan sekali
oleh admin melalui Pengaturan dan disimpan hanya di perangkat admin tersebut.
File `.env.catalog` (di-ignore Git) menyimpan kunci untuk referensi lokal.

Endpoint publik terkait:

```text
GET  /api/catalog               # snapshot galeri/profil/pricelist
GET  /api/availability          # hitungan kamar live (tanpa data pribadi)
POST /api/bookings              # kirim booking dari landing page
GET/PATCH /api/bookings         # daftar & status booking (butuh kunci admin)
```

## Email tagihan & link DOKU

Tagihan sewa dan invoice layanan bisa dikirim langsung ke email penghuni:

1. Pastikan email penghuni terisi (form booking, check-in, atau detail penghuni).
2. Dari **Sewa & Verifikasi Kas** atau **Financial → Invoice Manual**, klik
   **Kirim Tagihan**. Aplikasi membuat link DOKU lalu mengirimkannya via email.
3. Dari modal link pembayaran juga tersedia tombol **Kirim via Email**.

Pengiriman memakai [Resend](https://resend.com). Tambahkan environment:

```text
RESEND_API_KEY=re_...
EMAIL_FROM="Casa Ramire <no-reply@casaramire.com>"
```

`EMAIL_FROM` harus memakai domain yang sudah diverifikasi di Resend. Email
default properti (`casaramirejogja@gmail.com`) tetap dipakai sebagai alamat
kontak di landing page. Jika `RESEND_API_KEY` belum diisi, tombol email akan
membuka aplikasi email perangkat (mailto) sebagai fallback, sehingga link
pembayaran tetap bisa dikirim manual.

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
# Opsional, isi hanya channel yang aktif di akun DOKU:
# DOKU_PAYMENT_CHANNELS=QRIS,VIRTUAL_ACCOUNT_BCA,EMONEY_DANA
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
- Foto kamar/galeri tetap dipublikasikan terpisah lewat **Publikasikan** di
  Galeri Landing atau Pengaturan.

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

### Lupa password owner?

Di halaman login ada tombol **Lupa password?**. Reset membutuhkan **kunci admin**
(nilai `CATALOG_ADMIN_KEY`, juga dipakai untuk sinkronisasi/pembayaran). Kunci
tersebut ada di file `.env.catalog` atau di environment Vercel.

Reset hanya mengubah password pada browser/perangkat yang sedang dipakai,
karena data akun disimpan di `localStorage` perangkat. Jika owner memakai
beberapa perangkat, lakukan reset di perangkat yang ingin dipakai.

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

Catatan: `npm run dev` hanya menjalankan frontend Vite. Endpoint `/api/*`
(katalog, state, pembayaran DOKU) hanya tersedia di production atau saat
menjalankan `vercel dev`. Di mode Vite murni, halaman katalog otomatis memakai
data lokal/seed dan tombol publikasi/pembayaran akan menampilkan pesan bahwa API
belum tersedia.

## Struktur proyek

```
api/
├── availability.js            # hitungan kamar live untuk landing page
├── bookings.js                # booking online publik + antrean admin
├── catalog.js                 # GET/PUT snapshot katalog publik + kode promo
├── catalog/photo.js           # unggah/ambil foto katalog & galeri
├── email/send.js              # kirim email transaksional (Resend)
├── state.js                   # sinkronisasi state operasional
└── payments/doku/
    ├── create.js              # buat link DOKU untuk tagihan/invoice/perpanjangan
    └── notification.js        # webhook DOKU + auto-update status
src/
├── core/            # konstanta, format, kriptografi, storage, store, router, seed
├── services/        # logika bisnis (auth, properti, billing, pricing, laporan, katalog, galeri, booking, email, pembayaran, sinkronisasi, ...)
├── ui/              # komponen bersama, modal, toast, ikon, helper DOM
├── views/           # halaman dan modal per fitur (home.js, gallery.js, bookings.js, ...)
├── styles.css       # Tailwind v4 + design token Casa Ramire
└── main.js          # bootstrap, routing, re-render
tests/               # unit test format, kriptografi, harga, booking, promo, notifikasi
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
Pekerjaan landing page, katalog publik, notifikasi dashboard, pembayaran DOKU
otomatis, sinkronisasi state, dan lupa password owner 27 Oktober 2026 ada di
[`docs/HANDOFF-2026-10-27.md`](docs/HANDOFF-2026-10-27.md).

Pekerjaan galeri landing, booking online, kode promo, email tagihan, dan
perbaikan invoice manual 28 Oktober 2026 ada di
[`docs/HANDOFF-2026-10-28.md`](docs/HANDOFF-2026-10-28.md).

## Lisensi

Hak cipta © Casa Ramire. Digunakan untuk keperluan internal properti.
