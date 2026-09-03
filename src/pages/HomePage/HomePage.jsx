import { useEffect, useState } from 'react';
import { fetchPopularMovies } from '../../api/tmdb';
import HeroScene from '../../components/Hero/HeroScene';
import GenreSection from '../../components/Genre/GenreSection';
import FeaturedMovies from '../../components/Featured/FeaturedMovies';
import './HomePage.css';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularMovies()
      .then((results) => setMovies(results))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);
  return (
    <main className='home-page'>
      <HeroScene movies={movies} />
      <GenreSection movies={movies} />
      <FeaturedMovies movies={movies} isLoading={isLoading} error={error} />
    </main>
  );
}

export default HomePage;
