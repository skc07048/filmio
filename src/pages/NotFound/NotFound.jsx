import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <main className='not-found-page'>
      <p className='not-found-code'>404</p>
      <h1>페이지를 찾을 수 없어요</h1>
      <p className='not-found-desc'>
        주소가 잘못됐거나, 삭제된 페이지일 수 있어요.
      </p>
      <Link to='/' className='not-found-link'>
        홈으로 돌아가기
      </Link>
    </main>
  );
}

export default NotFound;
