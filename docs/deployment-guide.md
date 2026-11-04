# Panduan Deployment (Go-Live) Website & CMS APM Jambi

Dokumen ini berisi panduan langkah demi langkah (*step-by-step*) untuk meluncurkan (*deploy*) platform web **Aliansi Perempuan Mandiri (APM) Jambi** yang terdiri dari:
- **Backend**: Laravel 12 REST API (`backend/`)
- **Frontend**: React 19 + Vite SPA (`frontend/`)

---

## 🛠️ OPSI 1: Deploy di Shared Hosting / cPanel (Rekomendasi untuk NGO/cPanel)

Sebagian besar penyedia hosting lokal (seperti Niagahoster, Rumahweb, DomaiNesia, dll) menggunakan cPanel.

### Langkah 1: Persiapan Backend (Laravel API)
1. **Atur File `.env` Produksi** pada folder `backend/`:
   ```env
   APP_NAME="APM Jambi"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://api.apmjambi.or.id

   LOG_CHANNEL=daily

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=namauser_apmdb
   DB_USERNAME=namauser_apmuser
   DB_PASSWORD=password_database_anda

   SANCTUM_STATEFUL_DOMAINS=apmjambi.or.id,www.apmjambi.or.id
   SESSION_DOMAIN=.apmjambi.or.id
   ```

2. **Jalankan Optimasi Laravel lokal**:
   ```bash
   cd backend
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Buat File ZIP Backend**:
   - Kompres seluruh isi folder `backend/` (kecuali folder `node_modules`, `tests`, dan `.git`).

4. **Upload & Extract di cPanel**:
   - Buka **cPanel File Manager**.
   - Unggah zip backend ke folder di luar public (misal: `/home/user/apm_backend`).
   - Ekstrak berkas tersebut.

5. **Pengaturan Subdomain API (`api.apmjambi.or.id`)**:
   - Di cPanel, buat Subdomain **`api.apmjambi.or.id`**.
   - Arahkan *Document Root* subdomain ke: `/home/user/apm_backend/public`.

6. **Migrasi Database & Symlink Storage**:
   - Buka **cPanel MySQL Database Wizard**, buat database & user baru.
   - Buka **Terminal cPanel** (atau SSH) dan jalankan:
     ```bash
     cd /home/user/apm_backend
     php artisan migrate --force
     php artisan db:seed --force
     php artisan storage:link
     ```

---

### Langkah 2: Persiapan Frontend (React 19 Vite)
1. **Atur File `.env.production`** pada folder `frontend/`:
   ```env
   VITE_API_BASE_URL=https://api.apmjambi.or.id/api
   ```

2. **Jalankan Build Produksi**:
   ```bash
   cd frontend
   npm run build
   ```
   *Hasil kompilasi akan berada di folder `frontend/dist/`.*

3. **Buat File `.htaccess` di Folder `dist/`**:
   Tambahkan file `.htaccess` di dalam `frontend/dist/` untuk menangani React Client-Side Routing:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

4. **Upload ke Domain Utama (`public_html`)**:
   - Unggah seluruh isi file dalam folder `frontend/dist/` ke folder **`public_html`** domain utama (`apmjambi.or.id`).

---

## 🖥️ OPSI 2: Deploy di VPS (Linux Ubuntu 22.04 LTS + Nginx)

Jika menggunakan VPS (DigitalOcean, AWS, Biznet, Linode), gunakan konfigurasi Nginx berikut.

### 1. Konfigurasi Nginx Web Server

Buat file konfigurasi Nginx `/etc/nginx/sites-available/apmjambi.conf`:

```nginx
# 1. FRONTEND REACT SPA (apmjambi.or.id)
server {
    listen 80;
    server_name apmjambi.or.id www.apmjambi.or.id;
    root /var/www/apm-jambi/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}

# 2. BACKEND LARAVEL API (api.apmjambi.or.id)
server {
    listen 80;
    server_name api.apmjambi.or.id;
    root /var/www/apm-jambi/backend/public;
    index index.php;

    client_max_body_size 20M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

### 2. Aktifkan SSL HTTPS Gratis (Certbot Let's Encrypt)
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d apmjambi.or.id -d www.apmjambi.or.id -d api.apmjambi.or.id
```

---

## 🔒 Checklist Keamanan & Pengujian Sebelum Launching (Go-Live)
- [x] Pastikan `APP_DEBUG=false` pada `.env` produksi backend.
- [x] Pastikan `storage:link` telah dibuat agar foto galeri & berkas PDF AD/ART dapat diakses publik.
- [x] Jalankan SSL HTTPS enkripsi untuk domain utama dan subdomain API.
- [x] Uji login akun admin `admin@apmjambi.or.id` di lingkungan produksi.
