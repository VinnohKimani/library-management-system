# Library Management System

## Schema Decisions

### Normalized Genre Reference vs. Embedding

In this schema, the `Book` model references the `Genre` model via a foreign key (`genreId`) with a Prisma `@relation`, rather than embedding the genre as a plain string or sub-document on the book.

- **Data Integrity and Normalization:** Storing genres in an independent table prevents duplicate and inconsistent naming (e.g., "Sci-Fi" vs "Science Fiction").
- **Maintainability & Query Performance:** Updating or renaming a genre only requires modifying a single row in the database rather than updating thousands of book records.
- **Relational Aggregations:** Foreign keys allow direct database indexing and fast relational queries, such as retrieving all books under a genre or computing catalog statistics per category.

### Prisma vs. Document Databases (Stretch Reflection)

Modeling in Prisma for PostgreSQL enforces explicit relational integrity through foreign keys, strict schemas, and migrations upfront. In a document database like MongoDB, documents are often denormalized with genres embedded directly inside books to minimize joins at the expense of duplication and potential consistency drift.
