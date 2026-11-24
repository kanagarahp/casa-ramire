# Draft Email Invoice Casa Ramire

Semua email invoice menyertakan **lampiran PDF** dengan format invoice Casa
Ramire (header hijau, logo, data klien, item, total, tanggal, dan nomor order).
Email juga dikirim sebagai salinan ke inbox admin (`NOTIFICATION_EMAIL`).

## 1. Email tagihan / invoice belum dibayar

**Subjek:** `Invoice {nomor} - Casa Ramire`

```text
Halo {nama},

Berikut invoice {nomor} untuk {item}.

Nomor invoice : {nomor}
Jenis         : {item}
Nominal       : {nominal}
Jatuh tempo   : {tanggal jatuh tempo}
Kamar         : {nomor kamar}

Silakan transfer ke:
{bank}
No. Rekening: {nomor rekening}
a.n. {nama pemilik rekening}

Setelah transfer, kirim bukti pembayaran ke WhatsApp admin Casa Ramire.

Invoice resmi dalam format PDF terlampir.

Casa Ramire
{alamat}
WhatsApp: {whatsapp}
Email: {email}
```

Jika DOKU aktif, bagian transfer diganti dengan tombol/link pembayaran DOKU.

## 2. Email pengingat H-3

**Subjek:** `Pengingat H-3: {item} - Casa Ramire`

```text
Halo {nama},

Kami ingatkan bahwa tagihan berikut akan jatuh tempo dalam 3 hari.

Nomor invoice : {nomor}
Jenis         : {item}
Nominal       : {nominal}
Jatuh tempo   : {tanggal}
Kamar         : {nomor kamar}

Silakan transfer ke:
{bank}
No. Rekening: {nomor rekening}
a.n. {nama pemilik rekening}

Invoice resmi dalam format PDF terlampir.

Casa Ramire
{alamat}
WhatsApp: {whatsapp}
Email: {email}
```

Cron harian mengirim pengingat untuk tagihan/invoice yang belum dibayar dan
jatuh tempo (atau periode sewanya berakhir) 3 hari lagi.

## 3. Email ucapan terima kasih setelah pembayaran divalidasi

Dikirim otomatis setelah owner menekan **Verifikasi** pada tagihan, invoice
manual, atau invoice POS. Untuk POS yang langsung dibayar di kasir, email
dikirim saat transaksi disimpan (jika email pelanggan diisi/dicentang).

**Subjek:** `Terima kasih, pembayaran {nomor} sudah diterima - Casa Ramire`

```text
Halo {nama},

Terima kasih! Pembayaran Anda sudah kami terima dan verifikasi.

Nomor invoice : {nomor}
Jenis         : {item}
Nominal       : {nominal}
Metode        : {metode}
Tanggal       : {tanggal}
Kamar         : {nomor kamar}

Invoice resmi dalam format PDF terlampir. Simpan email ini sebagai bukti pembayaran.

Kami senang Anda menjadi bagian dari Casa Ramire. Jika ada pertanyaan, hubungi
WhatsApp admin di {whatsapp} atau balas email ini.

Salam hangat,
Casa Ramire
{alamat}
{email}
```

## Alur preview, download, cetak, dan kirim

- Setelah invoice manual dibuat, **preview invoice** langsung terbuka.
- Tombol **Tampilkan Invoice** tersedia pada:
  - daftar tagihan sewa (Bills),
  - daftar invoice manual (Financial → Invoice Manual),
  - riwayat POS dan struk POS.
- Dari preview:
  - **Download PDF** mengunduh file `Invoice-{nomor}.pdf`.
  - **Cetak** membuka PDF di tab baru untuk dicetak/di-save.
  - **Kirim Email** mengirim PDF + teks email di atas ke alamat yang diisi.
- Setelah verifikasi pembayaran, preview otomatis terbuka dan email ucapan
  terima kasih sudah dikirim (jika email tersedia).
