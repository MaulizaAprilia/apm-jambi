# Functional Requirements — APM Jambi

## 1. Public Website Requirements
- **FR-PUB-01 (Homepage)**: Display Hero banner, APM introduction, 3 program cards, latest news (max 3), gallery preview grid (max 6), and contact callout.
- **FR-PUB-02 (About Page)**: Render organizational profile, history, vision, mission, and structure.
- **FR-PUB-03 (Programs Page)**: Present program details and activity cards.
- **FR-PUB-04 (News Page & Detail)**: Render paginated news articles, search bar, news detail route `/berita/:slug`, and related news.
- **FR-PUB-05 (Gallery Page)**: Responsive photo grid with captions and interactive lightbox image preview.
- **FR-PUB-06 (Contact Page)**: Show address, email, WhatsApp link, social links, and embedded map preview.

## 2. Admin Portal Requirements
- **FR-ADM-01 (Authentication)**: Login with email & password, token storage, logout, protected route redirects.
- **FR-ADM-02 (Dashboard)**: Display total news count, published count, total gallery count, and quick links.
- **FR-ADM-03 (News Management)**: Create news with title, slug, featured image, content, status (`draft`/`published`), update news, delete news, toggle status.
- **FR-ADM-04 (Gallery Management)**: Upload image, title, description, update caption, delete photo.
- **FR-ADM-05 (Profile & Contact Management)**: Update profile text (history, vision, mission) and contact channels (address, WhatsApp, email, social links, map URL).
