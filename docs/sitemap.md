# Sitemap — APM Jambi

```text
APM JAMBI WEBSITE SITEMAP

├── Public Website (PublicLayout)
│   ├── / (Home)
│   ├── /tentang (About)
│   ├── /program (Programs & Activities)
│   ├── /berita (News List & Search)
│   │   └── /berita/:slug (News Article Detail)
│   ├── /galeri (Photo Gallery & Lightbox)
│   └── /kontak (Contact & Location)
│
└── Admin Dashboard (AdminLayout & ProtectedRoute)
    ├── /admin/login (Admin Login Form)
    ├── /admin/dashboard (Dashboard Overview)
    ├── /admin/news (News List & Status Toggle)
    │   ├── /admin/news/create (Create Article)
    │   └── /admin/news/:id/edit (Edit Article)
    ├── /admin/gallery (Gallery Media Management)
    │   ├── /admin/gallery/create (Upload Photo)
    │   └── /admin/gallery/:id/edit (Edit Photo Caption)
    ├── /admin/profile (Profile Settings Management)
    └── /admin/contact (Contact Settings Management)
```
