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
| **Dashboard** | KPI okupansi, antrean check-in, kontrak akan berakhir, arus kas 6 bulan, okupansi per lantai, tagihan aktif |
| **Status Kamar** | 42 kamar (201–221, 301–321), filter lantai/status, pencarian, tampilan grid/daftar, tambah/hapus kamar |
| **Booking & Check-in** | Booking kamar, check-in langsung, edit booking, pembayaran DP/lunas, deposit terpisah dari pendapatan |
| **Kontrak** | Perpanjangan kontrak, pindah kamar dengan riwayat hunian, check-out, tambah tagihan, invoice layanan |
| **Pricelist & Promo** | Tarif harian/mingguan/1/3/6/12 bulan per lantai, promo rupiah atau persen |
| **Add-On** | Layanan tambahan bulanan (parkir, kulkas, dispenser, dll.) |
| **Penghuni** | Direktori, biodata, kontak darurat, riwayat kamar, riwayat pembayaran, tunggakan |
| **Financial** | Jurnal pengeluaran + kategori, invoice layanan, pendapatan accrual, laba rugi |
| **Sewa & Kas** | Daftar tagihan, filter status, verifikasi/batal verifikasi pembayaran, pengingat WhatsApp |
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

## Akun demo

| Username | Password | Role |
| --- | --- | --- |
| `owner` | `123456` | Owner / Super Admin |
| `rian` | `123456` | Staf Operasional |

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
```

## Struktur proyek

```
src/
├── core/            # konstanta, format, kriptografi, storage, store, router, seed
├── services/        # logika bisnis (auth, properti, billing, pricing, laporan, ...)
├── ui/              # komponen bersama, modal, toast, ikon, helper DOM
├── views/           # halaman dan modal per fitur
├── styles.css       # Tailwind v4 + design token Casa Ramire
└── main.js          # bootstrap, routing, re-render
tests/               # unit test format, kriptografi, dan perhitungan harga
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

Workflow `.github/workflows/deploy.yml` otomatis membangun dan menerbitkan situs
setiap kali `main` diperbarui.

1. Buat repositori GitHub, lalu push proyek ini.
2. Buka **Settings → Pages** dan pilih **Source: GitHub Actions**.
3. Push ke `main` (atau jalankan workflow secara manual).
4. Situs tersedia di `https://<username>.github.io/<repo>/`.

`vite.config.js` memakai `base: './'` sehingga build tetap berjalan di sub-path
GitHub Pages. Routing memakai hash (`#/dashboard`) agar tidak memerlukan
konfigurasi rewrite server.

## Lisensi

Hak cipta © Casa Ramire. Digunakan untuk keperluan internal properti.
