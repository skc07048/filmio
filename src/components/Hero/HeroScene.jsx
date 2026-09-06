import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroScene.css';

gsap.registerPlugin(ScrollTrigger);

function HeroScene({ movies }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (movies.length === 0) return;

    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // CORS 문제를 피하기 위해 TMDB로 직접 안 가고 Vite 프록시(/tmdb-images)를 거쳐 요청
    const posterUrls = movies
      .filter((m) => m.poster_path)
      .slice(0, 8)
      .map((m) => `/tmdb-images/t/p/w500${m.poster_path}`);

    const group = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    const planeGeo = new THREE.PlaneGeometry(2.2, 3.3);
    const edgesGeo = new THREE.EdgesGeometry(planeGeo);
    const borderMat = new THREE.LineBasicMaterial({
      color: 0xaf0eef,
      transparent: true,
      opacity: 0.8,
    });

    const distance = camera.position.z;
    const vFov = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
    const visibleWidth = visibleHeight * camera.aspect;
    const SPACING = (visibleWidth * 0.85) / (posterUrls.length - 1);
    const totalWidth = (posterUrls.length - 1) * SPACING;

    posterUrls.forEach((url, i) => {
      const texture = textureLoader.load(url);
      texture.colorSpace = THREE.SRGBColorSpace;

      const imageMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
      });
      const plane = new THREE.Mesh(planeGeo, imageMat);
      const border = new THREE.LineSegments(edgesGeo, borderMat);

      const frame = new THREE.Group();
      frame.add(plane, border);

      frame.position.set(
        -totalWidth / 2 + i * SPACING,
        i % 2 === 0 ? 0.4 : -0.4,
        0,
      );

      group.add(frame);
    });

    scene.add(group);

    // 마우스가 없는 터치 기기인지 판별
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    const mouse = { x: 0 };
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const panRange = totalWidth * 0.15;

    // 히어로가 화면에 보이는 동안만 렌더링하도록 추적
    let isVisible = true;
    const visibilityTrigger = ScrollTrigger.create({
      trigger: mount,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => (isVisible = true),
      onLeave: () => (isVisible = false),
      onEnterBack: () => (isVisible = true),
      onLeaveBack: () => (isVisible = false),
    });

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const targetX = isTouchDevice ? 0 : -mouse.x * panRange;
      group.position.x += (targetX - group.position.x) * 0.06;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      visibilityTrigger.kill();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [movies]);

  return (
    <section className='hero-scene'>
      <div className='hero-canvas-mount' ref={mountRef} />
      <div className='hero-content'>
        <p className='hero-eyebrow'>FILMIO — MOVIE JOURNAL</p>
        <h1>
          당신의 다음 인생 영화,
          <br />
          <span>여기서</span> 시작됩니다
        </h1>
        <p className='hero-sub'>
          수천 편의 이야기 속에서, 오늘 당신에게 필요한 한 장면을 찾아드려요.
        </p>
      </div>
    </section>
  );
}

export default HeroScene;
