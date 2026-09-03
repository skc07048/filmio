import { IMAGE_BASE_URL } from '../../api/tmdb';
import './FeaturedMovies.css';

function FeaturedMovies({ movies, isLoading, error }) {
  if (isLoading) {
    return <section className='featured-movies'>불러오는 중...</section>;
  }

  if (error) {
    return <section className='featured-movies'>에러 발생: {error}</section>;
  }

  return (
    <section className='featured-movies'>
      <h2>이번 주, 가장 많이 회자된 영화</h2>
      <p className='sub'>
        filmio 사용자들이 직접 남긴 리뷰를 기준으로 골랐어요.
      </p>

      <div className='movie-grid'>
        {movies.slice(0, 6).map((movie) => (
          <article className='movie-card' key={movie.id}>
            <div className='poster'>
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={`${movie.title} 포스터`}
              />
              <span className='rating'>{movie.vote_average.toFixed(1)}</span>
            </div>
            <h3>{movie.title}</h3>
            <div className='stat'>
              <span className='count'>{movie.vote_count.toLocaleString()}</span>
              개의 리뷰
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedMovies;
