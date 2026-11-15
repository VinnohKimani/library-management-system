# Library Management System

## Backend Core: Catalog CRUD & Auth System

### Endpoints Implemented

- **Genres (`/genres`)**
  - `POST /genres` — Create a new genre (validated with `CreateGenreDto`)
  - `GET /genres` — List all genres with their books
  - `GET /genres/:id` — Retrieve a single genre by ID
  - `PATCH /genres/:id` — Update a genre by ID (validated with `UpdateGenreDto`)
  - `DELETE /genres/:id` — Delete a genre by ID
- **Books (`/books`)**
  - `POST /books` — Create a book (`LIBRARIAN` only, guarded by `JwtAuthGuard` + `RolesGuard`, validated with `CreateBookDto`)
  - `GET /books` — List books with query-based filtering (`genreId`), case-insensitive title/author search (`search`), and pagination (`page`, `limit`)
  - `GET /books/:id` — Retrieve a single book by ID
  - `PATCH /books/:id` — Update a book (`LIBRARIAN` only, guarded by `JwtAuthGuard` + `RolesGuard`, validated with `UpdateBookDto`)
  - `DELETE /books/:id` — Delete a book (`LIBRARIAN` only, guarded by `JwtAuthGuard` + `RolesGuard`)
- **Authentication (`/auth`)**
  - `POST /auth/register` — Register a user, hash password with `bcrypt`, and issue a JWT
  - `POST /auth/login` — Authenticate a user, rate-limited with `@nestjs/throttler`, and issue a JWT
- **Users (`/users`)**
  - `GET /users/profile` — Retrieve the authenticated user's profile via `@Req()` (`JwtAuthGuard`)

### Postman Collection

See [`docs/postman_collection.json`](../docs/postman_collection.json) for ready-to-run requests covering every endpoint built.

## Schema Decisions

### Normalized Genre Reference vs. Embedding

In this schema, the `Book` model references the `Genre` model via a foreign key (`genreId`) with a Prisma `@relation`, rather than embedding the genre as a plain string or sub-document on the book.

- **Data Integrity and Normalization:** Storing genres in an independent table prevents duplicate and inconsistent naming (e.g., "Sci-Fi" vs "Science Fiction").
- **Maintainability & Query Performance:** Updating or renaming a genre only requires modifying a single row in the database rather than updating thousands of book records.
- **Relational Aggregations:** Foreign keys allow direct database indexing and fast relational queries, such as retrieving all books under a genre or computing catalog statistics per category.

### Prisma vs. Document Databases (Stretch Reflection)

Modeling in Prisma for PostgreSQL enforces explicit relational integrity through foreign keys, strict schemas, and migrations upfront. In a document database like MongoDB, documents are often denormalized with genres embedded directly inside books to minimize joins at the expense of duplication and potential consistency drift.
