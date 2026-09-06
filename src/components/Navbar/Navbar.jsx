import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';

gsap.registerPlugin(ScrollTrigger);

function Navbar() {
  const navRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMenuOpenRef = useRef(false); // GSAP 콜백 안에서 최신 상태를 읽기 위한 참조
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      isMenuOpenRef.current = !prev;
      return !prev;
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    isMenuOpenRef.current = false;
  };

  // 메뉴가 열려있는 동안 배경 스크롤 잠그기
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const nav = navRef.current;

      ScrollTrigger.create({
        start: 'top -80',
        toggleClass: { targets: nav, className: 'navbar--scrolled' },
      });

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (isMenuOpenRef.current) return; // 모바일 메뉴 열려있으면 숨김/등장 로직 건너뜀

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
        <a className='filmio-logo' href='/' aria-label='filmio home'>
          filmio<span>.</span>
        </a>
      </h1>

      <nav
        id='navbar-nav'
        className={`navbar-nav ${isMenuOpen ? 'is-open' : ''}`}
        aria-label='Main Navigation'
      >
        <ul>
          <li>
            <Link to='/' onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to='/movies' onClick={closeMenu}>
              Movies
            </Link>
          </li>
          <li>
            <Link to='/series' onClick={closeMenu}>
              Series
            </Link>
          </li>
          <li>
            <Link to='/mypage' onClick={closeMenu}>
              My List
            </Link>
          </li>
        </ul>
      </nav>

      <div className='navbar-actions'>
        <SearchBar />
        {user ? (
          <button
            type='button'
            className='login-btn login-btn--desktop'
            onClick={logout}
          >
            로그아웃
          </button>
        ) : (
          <Link to='/login' className='login-btn login-btn--desktop'>
            Login
          </Link>
        )}
        <button
          type='button'
          className={`menu-toggle ${isMenuOpen ? 'is-active' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls='navbar-nav'
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
