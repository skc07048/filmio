import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, IMAGE_BASE_URL } from '../../api/tmdb';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 검색어가 없으면 API 요청(=바깥 시스템과의 통신) 자체를 시작하지 않음
    if (!query.trim()) {
      return; // ⭐ setMovies 호출 없이 그냥 종료
    }

    let isCancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- API 요청 시작을 화면에 알리는 정상적인 패턴 (react.dev 공식 예제와 동일)
    setIsLoading(true);
    setError(null);

    searchMovies(query)
      .then((results) => {
        if (!isCancelled) setMovies(results);
      })
      .catch((err) => {
        if (!isCancelled) setError(err.message);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [query]);

  // ⭐ "검색어가 없을 때 결과 목록을 뭘로 보여줄지"는 렌더링 시점에 바로 계산
  const displayedMovies = query.trim() ? movies : [];

  return (
    <main className='search-page'>
      <h1>
        {query ? (
          <>
            <span className='query'>"{query}"</span> 검색 결과
          </>
        ) : (
          '검색어를 입력해주세요'
        )}
      </h1>

      {isLoading && <p className='status'>검색 중...</p>}
      {error && <p className='status error'>에러: {error}</p>}
      {!isLoading && !error && query && displayedMovies.length === 0 && (
        <p className='status'>"{query}"에 대한 검색 결과가 없어요.</p>
      )}

      <div className='search-grid'>
        {displayedMovies.map((movie) => (
          <article className='search-card' key={movie.id}>
            <div className='poster'>
              {movie.poster_path ? (
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={`${movie.title} 포스터`}
                />
              ) : (
                <div className='no-poster'>포스터 없음</div>
              )}
            </div>
            <h3>{movie.title}</h3>
            <p className='year'>
              {movie.release_date
                ? movie.release_date.slice(0, 4)
                : '개봉일 미정'}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Search;
