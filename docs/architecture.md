# System Architecture — APM Jambi

```text
                    APM JAMBI SYSTEM
                           │
              ┌────────────┴────────────┐
              │                         │
        PUBLIC WEBSITE            ADMIN DASHBOARD
             React                     React
              │                         │
        PublicLayout               AdminLayout
              │                         │
              └────────────┬────────────┘
                           │
                    Axios Client
                           │
                    Laravel REST API
                           │
                    Laravel Sanctum
                           │
                         MySQL
                           │
                    Laravel Storage
```

## 1. Single SPA Frontend Architecture
The frontend is built using **React 18 / 19**, **Vite**, **Tailwind CSS**, and **React Router DOM**. Both the Public site and Admin portal run within a single SPA build.

- **Layout Differentiation**:
  - `PublicLayout`: Includes APM Navbar, Hero/Content Outlet, Footer. Accessible by all visitors.
  - `AdminLayout`: Includes Admin Sidebar, Topbar, User profile dropdown, Logout trigger.
- **Route Access Control**:
  - Unprotected public routes (`/`, `/tentang`, `/program`, `/berita`, `/berita/:slug`, `/galeri`, `/kontak`).
  - Protected admin routes (`/admin/dashboard`, `/admin/news`, `/admin/gallery`, `/admin/profile`, `/admin/contact`) wrapped by `ProtectedRoute`.

---

## 2. Laravel REST API Backend Architecture
- **API Statelessness & Authentication**: Admin API endpoints are secured using Laravel Sanctum bearer tokens stored in browser `localStorage`.
- **Controllers & Routing**:
  - Public namespace `App\Http\Controllers\Public\*` for GET-only public resources.
  - Admin namespace `App\Http\Controllers\Admin\*` for CRUD and configuration operations.
- **Form Request Validation**: Every write operation is validated by dedicated Laravel Form Request classes (`NewsRequest`, `GalleryRequest`, etc.) before reaching controller logic.
- **File Upload & Storage**: Images uploaded by admins are sanitized, assigned unique filenames, stored in `storage/app/public/` directory, and exposed via the symbolic link `public/storage`.
