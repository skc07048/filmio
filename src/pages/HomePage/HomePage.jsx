import HeroScene from '../../components/Hero/HeroScene';
import GenreSection from '../../components/Genre/GenreSection';
import FeaturedMovies from '../../components/Featured/FeaturedMovies';
import './HomePage.css';

function HomePage() {
  return (
    <main className='home-page'>
      <HeroScene />
      <GenreSection />
      <FeaturedMovies />
    </main>
  );
}

export default HomePage;
