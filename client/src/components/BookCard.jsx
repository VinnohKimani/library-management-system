import { Link } from 'react-router-dom';

function BookCard({ book }) {
  if (!book) return null;

  const isAvailable = (book.availableCopies ?? 0) > 0;
  const genreName = book.genre?.name || 'General';

  return (
    <article className="book-card" data-testid={`book-card-${book.id}`}>
      <div className="book-card-header">
        <div className="book-cover-art">
          <span className="book-cover-icon" aria-hidden="true">📖</span>
        </div>
        <div className="book-badges">
          <span
            className={`status-badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}
            title={`${book.availableCopies} available out of ${book.totalCopies}`}
          >
            {isAvailable ? `${book.availableCopies} Available` : 'Unavailable'}
          </span>
          <span className="genre-badge">{genreName}</span>
        </div>
      </div>

      <div className="book-card-content">
        <h3 className="book-title" title={book.title}>
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="book-author">by {book.author}</p>

        <div className="book-meta">
          <span className="book-isbn">
            <strong>ISBN:</strong> {book.isbn}
          </span>
          <span className="book-copies">
            {book.availableCopies} / {book.totalCopies} copies in library
          </span>
        </div>
      </div>

      <div className="book-card-actions">
        <Link
          to={`/books/${book.id}`}
          className="btn-view-details"
          aria-label={`View details for ${book.title}`}
        >
          View Details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default BookCard;
