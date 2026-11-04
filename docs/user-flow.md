# User Flow — APM Jambi

## 1. Public Visitor Flow
```text
[ Visitor Landing ]
        │
        ├──► Browse Home Page ──► Click Program Card ──► View /program
        │
        ├──► Click "Berita" ──► Search / Filter Articles ──► Click Article Card ──► View /berita/:slug
        │
        ├──► Click "Galeri" ──► View Photo Grid ──► Click Thumbnail ──► Open Lightbox Preview
        │
        └──► Click "Kontak" ──► View Address & Contact Cards ──► Click WhatsApp/Email Link
```

## 2. Admin Content Manager Flow
```text
[ Admin Access /admin/dashboard ]
        │
        ├──► (Not Authenticated) ──► Redirected to /admin/login ──► Enter Credentials ──► Store Token
        │                                                                                     │
        ◄─────────────────────────────────────────────────────────────────────────────────────┘
        │
        ├──► Dashboard Overview ──► View Quick Stats (News & Gallery Counts)
        │
        ├──► Manage News ──► Click "Tambah Berita" ──► Fill Form & Upload Image ──► Save as Draft/Published
        │                                             ▲
        │                                             └─ Edit / Delete / Toggle Status
        │
        ├──► Manage Gallery ──► Click "Tambah Foto" ──► Upload Media & Title ──► Save to Gallery
        │
        └──► Manage Profile/Contact ──► Edit Text / Addresses ──► Save Settings ──► Live updates on Public site
```
