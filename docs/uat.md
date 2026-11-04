# User Acceptance Testing (UAT) Checklist — APM Jambi

| Test ID | Module | Scenario | Expected Result | Result |
|---|---|---|---|---|
| **UAT-01** | Auth | Login with valid credentials | Redirects to `/admin/dashboard`, stores token in localStorage, displays admin topbar name. | PASS |
| **UAT-02** | Auth | Login with invalid credentials | Displays error message: "Kredensial tidak cocok dengan data kami." | PASS |
| **UAT-03** | Auth | Logout | Token removed, redirected to `/admin/login`. Direct access to `/admin/dashboard` is blocked. | PASS |
| **UAT-04** | News | Create news article with image | News article saved to database, image stored in `storage/app/public/news`, slug auto-generated. | PASS |
| **UAT-05** | News | Edit news article content | Article updated successfully, changes reflected immediately on public `/berita/:slug`. | PASS |
| **UAT-06** | News | Delete news article | Confirmation modal shown. Article and associated featured image removed. | PASS |
| **UAT-07** | News | Toggle publication status (Draft / Published) | Draft articles hidden from public website `/berita`; published articles visible immediately. | PASS |
| **UAT-08** | Gallery | Upload activity photo | Image uploader validates size/type, thumbnail rendered in admin table and public `/galeri`. | PASS |
| **UAT-09** | Gallery | Delete photo | Confirmation modal shown. Photo removed from database and public gallery view. | PASS |
| **UAT-10** | Profile | Edit organization history/vision/mission | Saved successfully in `organization_settings`. Public `/tentang` reflects new profile text. | PASS |
| **UAT-11** | Contact | Edit WhatsApp number & email | Saved successfully. Public `/kontak` and Navbar WhatsApp links point to updated number. | PASS |
| **UAT-12** | Public | View Homepage | Displays APM Hero, program preview cards, latest news (max 3), gallery grid (max 6), contact CTA. | PASS |
| **UAT-13** | Public | Lightbox Gallery Preview | Clicking any photo in `/galeri` opens interactive lightbox with title & caption. | PASS |
| **UAT-14** | Public | Mobile Navbar | Hamburger menu opens smoothly on mobile screens without horizontal scrollbar. | PASS |
| **UAT-15** | Security | Protected Route Bypass Attempt | Direct URL navigation to `/admin/news/create` without token redirects to `/admin/login`. | PASS |
