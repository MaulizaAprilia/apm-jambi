# Database Design — APM Jambi

## 1. Relational Schema & Entity Relationship Overview
Engine: InnoDB | Encoding: utf8mb4_unicode_ci

```text
+-----------------------+        +-----------------------+
|        users          |        |         news          |
+-----------------------+        +-----------------------+
| id          (PK, Big) |        | id          (PK, Big) |
| name        (String)  |        | title       (String)  |
| email       (Unique)  |        | slug        (Unique)  |
| password    (Hashed)  |        | featured_img(String)  |
| role        (String)  |        | content     (Text)    |
| timestamps            |        | status      (Enum)    |
+-----------------------+        | published_at(DateTime)|
                                 | timestamps            |
                                 +-----------------------+

+-----------------------+        +-----------------------+
|       galleries       |        | organization_settings |
+-----------------------+        +-----------------------+
| id          (PK, Big) |        | id          (PK, Big) |
| title       (String)  |        | group       (String)  |
| image       (String)  |        | key         (String)  |
| description (Text)    |        | value       (Text)    |
| timestamps            |        | timestamps            |
+-----------------------+        +-----------------------+
```

## 2. Table Definitions

### `users` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| `name` | VARCHAR(255) | NOT NULL | Admin full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `role` | VARCHAR(50) | DEFAULT 'admin' | User authorization role |
| `created_at` | TIMESTAMP | NULLABLE | Creation timestamp |
| `updated_at` | TIMESTAMP | NULLABLE | Update timestamp |

---

### `news` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| `title` | VARCHAR(255) | NOT NULL | Article headline |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | URL friendly slug |
| `featured_image` | VARCHAR(255) | NULLABLE | Storage image path |
| `content` | LONGTEXT | NOT NULL | Full article body content |
| `status` | ENUM('draft', 'published') | DEFAULT 'draft', INDEX | Publication state |
| `published_at` | TIMESTAMP | NULLABLE | Publication timestamp |
| `created_at` | TIMESTAMP | NULLABLE | Creation timestamp |
| `updated_at` | TIMESTAMP | NULLABLE | Update timestamp |

---

### `galleries` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| `title` | VARCHAR(255) | NOT NULL | Photo title / activity name |
| `image` | VARCHAR(255) | NOT NULL | Storage image path |
| `description` | TEXT | NULLABLE | Photo description / caption |
| `created_at` | TIMESTAMP | NULLABLE | Creation timestamp |
| `updated_at` | TIMESTAMP | NULLABLE | Update timestamp |

---

### `organization_settings` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Primary key |
| `group` | VARCHAR(50) | NOT NULL, INDEX | Category (`profile` or `contact`) |
| `key` | VARCHAR(100) | NOT NULL, UNIQUE(group, key) | Setting key name |
| `value` | LONGTEXT | NULLABLE | Setting string / text value |
| `created_at` | TIMESTAMP | NULLABLE | Creation timestamp |
| `updated_at` | TIMESTAMP | NULLABLE | Update timestamp |
