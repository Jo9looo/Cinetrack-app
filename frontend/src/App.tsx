import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DiscoverPage } from './pages/DiscoverPage';
import { SearchPage } from './pages/SearchPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { WatchlistPage } from './pages/WatchlistPage';

function App() {
  return (
    <Router>
      <WatchlistProvider>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WatchlistProvider>
    </Router>
  );
}

export default App;
