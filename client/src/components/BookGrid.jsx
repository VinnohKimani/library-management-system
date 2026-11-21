import { useState, useEffect, useMemo } from 'react';
import BookCard from './BookCard';

function BookGridSkeleton({ count = 8 }) {
  return (
    <div className="book-grid skeleton-grid" aria-label="Loading books...">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="book-card skeleton-card">
          <div className="skeleton-cover skeleton-pulse" />
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-title skeleton-pulse" />
            <div className="skeleton-line skeleton-author skeleton-pulse" />
            <div className="skeleton-line skeleton-meta skeleton-pulse" />
          </div>
          <div className="skeleton-button skeleton-pulse" />
        </div>
      ))}
    </div>
  );
}

function BookGrid({ genreId = '', search = '', sortBy = 'default' }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const baseUrl = rawApiUrl.replace(/\/+$/, '');
      const params = new URLSearchParams();

      if (genreId && genreId.trim() !== '') {
        params.append('genreId', genreId.trim());
      }

      if (search && search.trim() !== '') {
        params.append('search', search.trim());
      }

      // Fetch ample books for smooth browsing
      params.append('limit', '100');

      const queryString = params.toString();
      const url = `${baseUrl}/books${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message || 'An unexpected error occurred while loading books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [genreId, search]);

  // Client-side sorting (stretch task)
  const sortedBooks = useMemo(() => {
    if (!books || books.length === 0) return [];
    const list = [...books];

    switch (sortBy) {
      case 'title-asc':
        return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title-desc':
        return list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      case 'author-asc':
        return list.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
      case 'author-desc':
        return list.sort((a, b) => (b.author || '').localeCompare(a.author || ''));
      case 'available-desc':
        return list.sort((a, b) => (b.availableCopies ?? 0) - (a.availableCopies ?? 0));
      default:
        return list;
    }
  }, [books, sortBy]);

  // Loading State - Render Skeleton UI (Stretch task)
  if (loading) {
    return (
      <div className="book-grid-wrapper">
        <div className="loading-announcement sr-only" role="status">
          Loading books...
        </div>
        <BookGridSkeleton count={8} />
      </div>
    );
  }

  // Error State - Graceful error display with retry
  if (error) {
    return (
      <div className="state-container error-state" role="alert">
        <div className="state-icon" aria-hidden="true">⚠️</div>
        <h3 className="state-title">Unable to Load Books</h3>
        <p className="state-message">{error}</p>
        <button type="button" className="btn-retry" onClick={fetchBooks}>
          Try Again
        </button>
      </div>
    );
  }

  // Empty State - No books found
  if (sortedBooks.length === 0) {
    return (
      <div className="state-container empty-state">
        <div className="state-icon" aria-hidden="true">📚</div>
        <h3 className="state-title">No Books Found</h3>
        <p className="state-message">
          {search || genreId
            ? 'We could not find any books matching your search or selected filter. Try adjusting your search query or selecting a different genre.'
            : 'The library catalog is currently empty. Please check back later.'}
        </p>
      </div>
    );
  }

  // Loaded State - Responsive Grid of BookCards
  return (
    <div className="book-grid-wrapper">
      <div className="results-count">
        Showing <strong>{sortedBooks.length}</strong> {sortedBooks.length === 1 ? 'book' : 'books'}
      </div>
      <div className="book-grid" data-testid="book-grid">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default BookGrid;
