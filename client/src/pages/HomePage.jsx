import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BookGrid from '../components/BookGrid';

function HomePage() {
  const [search, setSearch] = useState('');
  const [genreId, setGenreId] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);

  // Fetch available genres for the filter
  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const baseUrl = rawApiUrl.replace(/\/+$/, '');
        const response = await fetch(`${baseUrl}/genres`);
        if (response.ok) {
          const data = await response.json();
          setGenres(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn('Could not load genres for filter:', err);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  const handleResetFilters = () => {
    setSearch('');
    setGenreId('');
    setSortBy('default');
  };

  const hasActiveFilters = Boolean(search || genreId || sortBy !== 'default');

  return (
    <div className="home-page">
      <section className="hero-banner">
        <h1 className="hero-title">Explore Our Library Catalog</h1>
        <p className="hero-description">
          Discover thousands of titles across literature, science, history, technology, and more.
          Search by title or author, filter by genre, and check real-time branch availability.
        </p>
      </section>

      <section className="filter-controls-section" aria-label="Catalog Filters">
        <div className="search-and-sort-row">
          <div className="search-bar-wrapper">
            <SearchBar onSearch={setSearch} placeholder="Search by title or author..." />
          </div>

          <div className="sort-control-wrapper">
            <label htmlFor="sort-select" className="control-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              className="select-control sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort books"
            >
              <option value="default">Default (Newest)</option>
              <option value="title-asc">Title (A – Z)</option>
              <option value="title-desc">Title (Z – A)</option>
              <option value="author-asc">Author (A – Z)</option>
              <option value="author-desc">Author (Z – A)</option>
              <option value="available-desc">Availability (Most Available)</option>
            </select>
          </div>
        </div>

        <div className="genre-filter-row">
          <div className="genre-filter-label-group">
            <label htmlFor="genre-select" className="control-label">
              Genre Filter:
            </label>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn-clear-filters"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Accessible Select Dropdown for Genres */}
          <div className="genre-select-container">
            <select
              id="genre-select"
              className="select-control genre-select"
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              aria-label="Filter by genre"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Filter Pills */}
          <div className="genre-chips-group" role="group" aria-label="Quick genre filter buttons">
            <button
              type="button"
              className={`genre-chip ${genreId === '' ? 'active' : ''}`}
              onClick={() => setGenreId('')}
            >
              All Genres
            </button>
            {genres.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`genre-chip ${genreId === g.id ? 'active' : ''}`}
                onClick={() => setGenreId(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="catalog-content-section" aria-label="Book Catalog">
        <BookGrid genreId={genreId} search={search} sortBy={sortBy} />
      </section>
    </div>
  );
}

export default HomePage;
