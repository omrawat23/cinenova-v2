import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import HomePage from "./components/HomePage";
import MoviesHomePage from "./components/Movies/MoviesHomePage";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import WatchList from './components/WatchList';

import MovieVideoPage from './components/Movies/MovieVideoPage';
import WatchHistory from './components/History';
import TvHomePage from './components/Tv/TvHomePage';
import TvVideoPage from './components/Tv/TvVideoPage';
import Anime from './components/Anime';

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesHomePage />} />
            <Route path="/videopage/:movieId" element={<MovieVideoPage />} />

            <Route path="/tv-series" element={<TvHomePage />} />
            <Route path="/tv-videopage/:movieId" element={<TvVideoPage />} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/history" element={<WatchHistory />} />

            <Route path="/anime" element={<Anime />} />



          </Routes>
        </Layout>
        {/* Include the Toaster component */}
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
