import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SearchBar from '../SearchBar/SearchBar';
import { Link } from 'react-router-dom';
import './Navbar.css';

gsap.registerPlugin(ScrollTrigger);

function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    // gsap.context()로 감싸면, 여기서 만든 ScrollTrigger들이
    // 컴포넌트가 사라질 때 ctx.revert() 한 줄로 자동 정리됨
    const ctx = gsap.context(() => {
      const nav = navRef.current;

      // 1) 80px 이상 내려가면 navbar--scrolled 클래스를 붙였다 뗐다 함
      ScrollTrigger.create({
        start: 'top -80',
        toggleClass: { targets: nav, className: 'navbar--scrolled' },
      });

      // 2) 스크롤 방향(direction)을 보고 숨김/등장 처리
      //    direction === 1 → 아래로 스크롤 중, -1 → 위로 스크롤 중
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const scrollingDown = self.direction === 1 && self.scroll() > 120;
          gsap.to(nav, {
            yPercent: scrollingDown ? -100 : 0,
            duration: 0.35,
            ease: 'power2.out',
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header className='navbar' ref={navRef}>
      <h1 className='navbar-title'>
        <a className='filmio-logo' href='#top' aria-label='filmio home'>
          filmio<span>.</span>
        </a>
      </h1>
      <nav className='navbar-nav' aria-label='Main Navigation'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/movies'>Movies</Link>
          </li>
          <li>
            <Link to='/series'>Series</Link>
          </li>
          <li>
            <Link to='/mypage'>My List</Link>
          </li>
        </ul>
      </nav>
      <SearchBar />
    </header>
  );
}

export default Navbar;
