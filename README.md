# Website Resmi & Portal CMS Aliansi Perempuan Mandiri (APM) Jambi

Website profil kelembagaan dan portal Content Management System (CMS) resmi **Aliansi Perempuan Mandiri (APM) Jambi** — perkumpulan perempuan yang bergerak dalam pemberdayaan, pendampingan hukum berbasis GEDSI, penguatan ekonomi komunitas, dan jejaring 33 Community Center di Provinsi Jambi.

---

## 🏛️ Arsitektur Teknologi

* **Frontend**:
  * [React](https://react.dev/) + [Vite](https://vitejs.dev/)
  * [Tailwind CSS v4](https://tailwindcss.com/)
  * [Lucide React](https://lucide.dev/) (Ikonografi Standar & Konsisten)
  * [SweetAlert2](https://sweetalert2.github.io/) (Interaksi & Notifikasi Halus)
  * [Axios](https://axios-http.com/)
* **Backend**:
  * [Laravel 12](https://laravel.com/) REST API
  * [Laravel Sanctum](https://laravel.com/docs/sanctum) (Bearer Token Authentication)
  * Rate Limiting Brute-Force Shield pada Portal Admin
  * MySQL Database
* **Legalitas & Dokumen Resmi**:
  * SK Kemenkumham RI No. AHU-0001146.AH.01.08.TAHUN 2025
  * AD/ART APM Jambi (Musyawarah Besar Luar Biasa 14 Desember 2024)
  * 16 Prinsip Pedoman Perilaku / Kode Etik Organisasi
  * Bagan Struktur Organisasi 2023–2028

---

## 🚀 Panduan Menjalankan Proyek (Lokal)

### 1. Persiapan Backend (Laravel API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```
> **Catatan Windows**: Jika menggunakan Laragon / Windows OS, pastikan folder storage publik terhubung via NTFS junction:
> `cmd /c mklink /J "backend\public\storage" "backend\storage\app\public"`

### 2. Persiapan Frontend (React Vite)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Aplikasi frontend akan berjalan pada `http://localhost:3000` (atau `http://localhost:3001`).

---

## 🔐 Akses Portal Admin CMS

* **URL Login**: `/admin/login` (Akses langsung internal pengurus; tidak dicantumkan di navigasi publik)
* **Kredensial Default**:
  * Email: `admin@apmjambi.or.id`
  * Password: `password`

### Fitur Portal Admin:
1. **Dashboard Eksekutif**: Metrik statistik real-time (Berita, Galeri, 33 Community Center, Dokumen SK, Program, Akun Staf).
2. **Publikasi Berita**: Form berita dengan identitas reporter otomatis (`readOnly`) berbasis sesi autentikasi pengguna.
3. **Galeri Dokumentasi**: Manajemen arsip foto lapangan dengan filter kategori dan Lightbox preview.
4. **Dokumen & SK Organisasi**: Unggah dan kelola berkas legalitas, AD/ART, dan profil PDF/gambar.
5. **Program & Layanan**: Manajemen 9 klaster program kerja APM Jambi.
6. **Struktur Organisasi**: Manajemen susunan pengurus 2023–2028 (Badan Pengawas, Pengurus, Pelaksana) dengan foto profil yang langsung terhubung ke bagan interaktif publik.
7. **Jejaring Community Center**: Direktori 33 pos dampingan akar rumput (Merangin, Bungo, Sarolangun).
8. **Kelola Akun & Hak Akses**: Manajemen pengguna pengurus (Super Admin, Administrator, Staf Program) dengan toggle aktif/nonaktif.
9. **Kontak & Peta**: Pengaturan kontak WhatsApp pengaduan, email, live Google Maps preview, dan media sosial.

---

## 🌐 Rekomendasi Domain & Produksi

Gunakan domain organisasi resmi yang kredibel:
* Domain Publik: `https://apmjambi.or.id` (atau `https://www.apmjambi.or.id`)
* API Backend: `https://api.apmjambi.or.id`

Hindari penggunaan domain murah (seperti `.xyz` atau `.my.id`) demi menjaga kredibilitas organisasi publik dan mencegah salah tanggap phishing/spam.

---

## 📄 Lisensi

Hak Cipta © 2026 Aliansi Perempuan Mandiri (APM) Jambi.
Semua hak dilindungi undang-undang.

