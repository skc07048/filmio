import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './GenreSection.css';

gsap.registerPlugin(ScrollTrigger);

const genres = [
  {
    id: 28,
    tag: 'GENRE 01',
    title: '액션',
    desc: '심장을 붙잡는 속도감. 스크린 밖으로 튀어나올 듯한 몰입.',
    accent: '#e76545',
  },
  {
    id: 10749,
    tag: 'GENRE 02',
    title: '로맨스',
    desc: '사소한 순간이 오래 남는 이야기.',
    accent: '#2f6b63',
  },
  {
    id: 53,
    tag: 'GENRE 03',
    title: '스릴러',
    desc: '끝까지 예측할 수 없는 긴장감.',
    accent: '#6d93d9',
  },
];

function GenreSection({ movies }) {
  const pinRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, pinRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className='genre-pin' ref={pinRef}>
      <div className='genre-track' ref={trackRef}>
        {genres.map((g) => {
          const genreMovies = movies.filter((m) => m.genre_ids?.includes(g.id));
          const bgMovie = genreMovies[0];

          return (
            <div
              key={g.title}
              className='genre-panel'
              style={{
                '--panel-accent': g.accent,
                backgroundImage: bgMovie
                  ? `linear-gradient(to top, rgba(20,16,15,0.9), rgba(20,16,15,0.4)), url(https://image.tmdb.org/t/p/w1280${bgMovie.backdrop_path})`
                  : 'none',
              }}
            >
              <p className='tag'>{g.tag}</p>
              <h2>{g.title}</h2>
              <p className='desc'>{g.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default GenreSection;
