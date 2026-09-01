import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './HeroScene.css';

function HeroScene() {
  const mountRef = useRef(null); // 캔버스를 붙일 위치를 가리키는 상자

  useEffect(() => {
    const mount = mountRef.current;

    // 1) 장면(scene), 카메라, 렌더러 — Three.js의 기본 3요소
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
    mount.appendChild(renderer.domElement); // 실제 DOM에 <canvas> 삽입

    // 2) 필름 프레임 여러 개를 만들어서 공간에 흩뿌리기
    const group = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(1.4, 0.9, 0.02);
    const edges = new THREE.EdgesGeometry(frameGeo);
    const material = new THREE.LineBasicMaterial({
      color: 0xe76545, // primary 색상 적용
      transparent: true,
      opacity: 0.55,
    });

    for (let i = 0; i < 34; i++) {
      const frame = new THREE.LineSegments(edges, material);
      frame.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 14 - 4,
      );
      frame.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      frame.userData.spin = (Math.random() - 0.5) * 0.003;
      group.add(frame);
    }
    scene.add(group);

    // 3) 마우스 움직임 → 카메라가 살짝 따라오는 패럴랙스
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 4) 매 프레임 반복 실행되는 애니메이션 루프
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      group.rotation.y += 0.0011;
      group.children.forEach((f) => (f.rotation.z += f.userData.spin));
      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    // 5) 창 크기가 바뀔 때 카메라/렌더러 크기도 같이 조정
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 6) ⭐ 클린업 — 컴포넌트가 사라질 때 반드시 실행됨
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []); // 빈 배열 → "화면에 나타날 때 한 번만" 실행하라는 뜻

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
          수천 편의 이야기 속에서, <br />
          오늘 당신에게 필요한 한 장면을 찾아드려요.
        </p>
      </div>
    </section>
  );
}

export default HeroScene;
