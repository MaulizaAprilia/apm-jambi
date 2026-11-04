# API Specification — APM Jambi REST API

Base URL: `http://localhost:8000/api` (or configured `VITE_API_URL`)

## 1. Response Structure Standard
All API responses follow a uniform JSON schema:

**Success Response (HTTP 200 / 201)**:
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {}
}
```

**Validation Error Response (HTTP 422)**:
```json
{
  "success": false,
  "message": "Data tidak valid",
  "errors": {
    "title": ["Judul berita wajib diisi."]
  }
}
```

**Unauthorized Response (HTTP 401)**:
```json
{
  "success": false,
  "message": "Sesi tidak valid atau telah berakhir."
}
```

---

## 2. Public Endpoints (Unauthenticated)

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/news` | List published news | `search`, `limit`, `page` |
| `GET` | `/api/news/{slug}` | Get published news detail | - |
| `GET` | `/api/gallery` | List activity photo gallery | `limit`, `page` |
| `GET` | `/api/profile` | Get organization profile settings | - |
| `GET` | `/api/contact` | Get contact information settings | - |

---

## 3. Admin Endpoints (Sanctum Protected)

| Method | Endpoint | Description | Request Payload |
|---|---|---|---|
| `POST` | `/api/admin/login` | Admin login | `email`, `password` |
| `POST` | `/api/admin/logout` | Admin logout | Header: `Authorization: Bearer <token>` |
| `GET` | `/api/admin/me` | Current admin profile | Header: `Authorization: Bearer <token>` |
| `GET` | `/api/admin/news` | Admin news list (all statuses) | `search`, `status`, `page` |
| `POST` | `/api/admin/news` | Create news article | multipart/form-data (`title`, `content`, `status`, `featured_image`) |
| `GET` | `/api/admin/news/{id}` | Get news detail for editing | - |
| `POST/PUT` | `/api/admin/news/{id}` | Update news article | multipart/form-data (`title`, `content`, `status`, `featured_image`) |
| `DELETE` | `/api/admin/news/{id}` | Delete news article | - |
| `GET` | `/api/admin/gallery` | Admin gallery list | `page` |
| `POST` | `/api/admin/gallery` | Upload photo to gallery | multipart/form-data (`title`, `description`, `image`) |
| `GET` | `/api/admin/gallery/{id}` | Get photo detail | - |
| `POST/PUT` | `/api/admin/gallery/{id}` | Update photo detail | multipart/form-data (`title`, `description`, `image`) |
| `DELETE` | `/api/admin/gallery/{id}` | Delete photo | - |
| `GET` | `/api/admin/profile` | Get profile settings form data | - |
| `PUT` | `/api/admin/profile` | Update profile settings | JSON (`history`, `vision`, `mission`) |
| `GET` | `/api/admin/contact` | Get contact settings form data | - |
| `PUT` | `/api/admin/contact` | Update contact settings | JSON (`address`, `whatsapp`, `email`, `facebook`, `instagram`, `youtube`, `maps_embed`) |
