const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export async function fetchPopularMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR`,
  );
  if (!res.ok) throw new Error('영화 목록을 불러오지 못했습니다');
  const data = await res.json();
  return data.results;
}

export async function fetchGenres() {
  const res = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ko-KR`,
  );
  if (!res.ok) throw new Error('장르 목록을 불러오지 못했습니다');
  const data = await res.json();
  return data.genres; // [{ id, name }, ...]
}
