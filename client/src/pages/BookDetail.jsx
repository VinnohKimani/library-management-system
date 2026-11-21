import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function BookDetailSkeleton() {
  return (
    <div className="book-detail-skeleton">
      <div className="skeleton-back-btn skeleton-pulse" />
      <div className="detail-card skeleton-card">
        <div className="detail-cover-skeleton skeleton-pulse" />
        <div className="detail-info-skeleton">
          <div className="skeleton-line skeleton-title skeleton-pulse" />
          <div className="skeleton-line skeleton-author skeleton-pulse" />
          <div className="skeleton-line skeleton-meta skeleton-pulse" style={{ width: '60%' }} />
          <div className="skeleton-line skeleton-meta skeleton-pulse" style={{ width: '80%' }} />
          <div className="skeleton-line skeleton-meta skeleton-pulse" style={{ width: '40%' }} />
        </div>
      </div>
    </div>
  );
}

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBook = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const baseUrl = rawApiUrl.replace(/\/+$/, '');
      const response = await fetch(`${baseUrl}/books/${id}`);

      if (response.status === 404) {
        throw new Error('This book could not be found in the catalog.');
      }

      if (!response.ok) {
        throw new Error(`Failed to load book details (${response.status} ${response.statusText})`);
      }

      const data = await response.json();
      setBook(data);
    } catch (err) {
      console.error('Error fetching book detail:', err);
      setError(err.message || 'An error occurred while loading the book details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  // Loading state with Skeleton UI
  if (loading) {
    return (
      <div className="book-detail-page">
        <div className="loading-announcement sr-only" role="status">
          Loading book details...
        </div>
        <BookDetailSkeleton />
      </div>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <div className="book-detail-page">
        <div className="state-container error-state" role="alert">
          <div className="state-icon" aria-hidden="true">⚠️</div>
          <h2 className="state-title">Book Not Found</h2>
          <p className="state-message">{error || 'Unable to retrieve this book record.'}</p>
          <div className="detail-error-actions">
            <button type="button" className="btn-retry" onClick={fetchBook}>
              Retry
            </button>
            <Link to="/" className="btn-back-home">
              ← Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = (book.availableCopies ?? 0) > 0;
  const publishedDate = book.publishedAt
    ? new Date(book.publishedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  return (
    <div className="book-detail-page" data-testid="book-detail-page">
      <div className="detail-navigation">
        <Link to="/" className="btn-back-link">
          ← Back to Catalog
        </Link>
      </div>

      <article className="book-detail-card">
        <div className="detail-header-section">
          <div className="detail-cover-container">
            <div className="detail-cover-large">
              <span className="cover-icon-large" aria-hidden="true">📚</span>
            </div>
          </div>

          <div className="detail-main-info">
            <div className="detail-badges">
              <span
                className={`status-badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}
              >
                {isAvailable ? `${book.availableCopies} Copies Available` : 'Currently Unavailable'}
              </span>
              {book.genre?.name && (
                <span className="genre-badge">{book.genre.name}</span>
              )}
            </div>

            <h1 className="detail-title">{book.title}</h1>
            <p className="detail-author">Written by <strong>{book.author}</strong></p>

            {book.genre?.description && (
              <p className="detail-genre-description">
                <em>{book.genre.description}</em>
              </p>
            )}

            <div className="detail-specifications-grid">
              <div className="spec-card">
                <span className="spec-label">ISBN</span>
                <span className="spec-value mono">{book.isbn}</span>
              </div>

              <div className="spec-card">
                <span className="spec-label">Available Copies</span>
                <span className="spec-value highlight">{book.availableCopies}</span>
              </div>

              <div className="spec-card">
                <span className="spec-label">Total Inventory</span>
                <span className="spec-value">{book.totalCopies} copies</span>
              </div>

              <div className="spec-card">
                <span className="spec-label">Published Date</span>
                <span className="spec-value">{publishedDate}</span>
              </div>

              {book.id && (
                <div className="spec-card">
                  <span className="spec-label">Catalog ID</span>
                  <span className="spec-value mono text-sm">{book.id}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="detail-reviews-section" aria-label="Book Reviews">
          <h2 className="reviews-section-title">
            Patron Reviews {book.reviews?.length ? `(${book.reviews.length})` : ''}
          </h2>

          {book.reviews && book.reviews.length > 0 ? (
            <div className="reviews-list">
              {book.reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-rating" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                      {'★'.repeat(review.rating || 5)}{'☆'.repeat(Math.max(0, 5 - (review.rating || 5)))}
                    </div>
                    {review.createdAt && (
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {review.comment && (
                    <p className="review-comment">"{review.comment}"</p>
                  )}
                  {review.user?.name && (
                    <span className="review-author">— {review.user.name}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews-box">
              <p>No patron reviews yet for this title.</p>
            </div>
          )}
        </section>
      </article>
    </div>
  );
}

export default BookDetail;
