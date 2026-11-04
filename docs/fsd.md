# Functional Specification Document (FSD) — APM Jambi

## 1. Public Modules
- **Home (`/`)**:
  - Hero Section with APM identity.
  - Organization Introduction section.
  - Program & Activities preview cards.
  - Dynamic Latest News section fetched from `GET /api/news?limit=3`.
  - Dynamic Gallery Preview fetched from `GET /api/gallery?limit=6`.
  - Contact CTA Banner.
- **About (`/tentang`)**:
  - Profile section, history overview, vision & mission cards, team/organization structure overview fetched from `GET /api/profile`.
- **Programs (`/program`)**:
  - Program cards detailing advocacy, economic empowerment, and community engagement.
- **News (`/berita`)**:
  - Article list with search bar, pagination controls, status filter (`published` only). Clicking article navigates to `/berita/:slug`.
- **News Detail (`/berita/:slug`)**:
  - Fetches `GET /api/news/{slug}`, displays article title, publication date, featured image, formatted body text, and latest news sidebar.
- **Gallery (`/galeri`)**:
  - Image grid fetched from `GET /api/gallery`. Clicking an image opens a modal lightbox displaying full-resolution photo, title, and description.
- **Contact (`/kontak`)**:
  - Addresses, email, WhatsApp button, interactive Google Map embed fetched from `GET /api/contact`.

## 2. Admin Modules
- **Login (`/admin/login`)**:
  - Inputs: email, password. Submits to `POST /api/admin/login`. On success, stores token in `localStorage`, redirects to `/admin/dashboard`.
- **Dashboard (`/admin/dashboard`)**:
  - Stats cards: total news, published count, total gallery count.
- **News Management (`/admin/news`)**:
  - Table showing image preview, title, status (`draft`/`published`), published date. Actions: Edit, Delete, Toggle Publish.
  - Create (`/admin/news/create`) & Edit (`/admin/news/:id/edit`): Inputs for title, slug auto-generation, status, featured image file upload, rich text content.
- **Gallery Management (`/admin/gallery`)**:
  - Media list, upload page (`/admin/gallery/create`) supporting image file selection, title, description.
- **Profile & Contact Settings (`/admin/profile`, `/admin/contact`)**:
  - Forms to edit organizational history, vision, mission, address, email, WhatsApp, social links.
