# Project Analysis — Website & CMS APM Jambi

## 1. Executive Summary
**Aliansi Perempuan Mandiri (APM) Jambi** is a non-governmental organization (NGO) dedicated to women's empowerment, rights advocacy, social justice, and community development in Jambi Province, Indonesia. 

This project delivers a production-ready, unified web platform consisting of:
1. **Public Website**: Modern, high-performing web portal showcasing APM Jambi's profile, history, vision & mission, programs, latest news, activity photo galleries, and contact information.
2. **Admin Dashboard / Content Management System (CMS)**: Secure, intuitive management portal enabling non-technical APM staff to manage news articles, activity galleries, organizational profile details, and contact information.
3. **Laravel REST API Backend**: Robust API layer handling data storage, authentication, file uploads, and business logic.

---

## 2. Technical Scope & Architecture Principles
- **Unified Single React Application**: Both Public Website and Admin Dashboard reside in **one React application** (`frontend/`), distinguished cleanly by layouts (`PublicLayout` vs. `AdminLayout`), route paths (`/` vs `/admin/*`), and client-side access protection (`ProtectedRoute`).
- **Laravel REST API Backend**: Fully decoupled backend API (`backend/`) powered by Laravel 11, Sanctum token authentication, and MySQL database.
- **Strict Scope Boundaries**: Features explicitly out-of-scope (e.g., online payment gateways, public member registration, WhatsApp automated API bots) are omitted to adhere strictly to the project agreement.

---

## 3. Visual & Aesthetic Guidelines
- **NGO / Social Organization Identity**: Warm, human, professional, clean, accessible, and trustworthy.
- **Official Color Palette**:
  - Primary (`#6B21A8` - Deep Purple/Magenta): Navbar, hero highlights, main headings, key brand elements.
  - Secondary (`#1E3A8A` - Royal Blue): Admin sidebar, subheadings, supporting callouts.
  - Accent / CTA (`#DC2626` - Crimson Red): Action buttons, badge highlights, active states.
  - Neutral Background (`#F8FAFC` - Slate 50).
  - Text Content (`#334155` - Slate 700).
  - Borders & Cards (`#E2E8F0` / `#FFFFFF`).

---

## 4. Key Stakeholders & Target Users
1. **General Public & Community**: Visitors seeking information about APM Jambi, reading news, viewing activity photos, or contacting the organization.
2. **APM Management & Content Staff**: Admin users managing news publications, uploading gallery media, and updating organizational information.
