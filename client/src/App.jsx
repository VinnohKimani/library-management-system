import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetail from './pages/BookDetail';

function App() {
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-container">
          <Link to="/" className="brand-logo" aria-label="Library Home">
            <span className="logo-icon" aria-hidden="true">📚</span>
            <div className="brand-text">
              <span className="brand-title">Athenaeum</span>
              <span className="brand-subtitle">Patron Catalog</span>
            </div>
          </Link>

          <nav className="nav-links">
            <Link to="/" className="nav-link active">Catalog</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} Library Management System. Patron-facing Catalog.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
