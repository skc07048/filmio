import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useScrollReset from './hooks/useScrollReset';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import HomePage from './pages/HomePage/HomePage';
import Search from './pages/Search/Search';
import MyPage from './pages/MyPage/MyPage';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';

function App() {
  useScrollReset();

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/search' element={<Search />} />
        <Route
          path='/mypage'
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
