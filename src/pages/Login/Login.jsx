import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 입력값 전체를 객체 하나로 관리 (이메일, 비밀번호)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 항목별 유효성 검사 에러 메시지를 담는 객체
  const [errors, setErrors] = useState({});

  // 제출(로그인 시도) 중인지 여부 — 중복 클릭 방지 및 버튼 텍스트 전환에 사용
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 서버 응답 등으로 발생한 전체 에러 메시지 (특정 입력칸에 딸린 게 아닌 것)
  const [formError, setFormError] = useState('');

  // 입력값이 바뀔 때마다 formData의 해당 필드만 갱신
  const handleChange = (e) => {
    const { name, value } = e.target; // name="email" 또는 name="password"
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 사용자가 다시 입력을 시작하면, 그 필드의 기존 에러 메시지는 지워줌
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // 제출 전에 값들을 검사해서 에러 객체를 만들어 반환
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아니에요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 해요.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 동작(페이지 새로고침)을 막음

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // 에러가 하나라도 있으면 서버 요청 자체를 안 보냄
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      // TODO: 실제 로그인 API 연동 지점 (지금은 임시로 흉내만 냄)
      await new Promise((resolve) => setTimeout(resolve, 800));
      login(formData.email);
      navigate('/mypage'); // 로그인 성공 시 이동
    } catch (err) {
      setFormError(err.message || '로그인에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='login-page'>
      <form className='login-form' onSubmit={handleSubmit} noValidate>
        <h1>로그인</h1>

        {formError && <p className='form-error'>{formError}</p>}

        <div className='field'>
          <label htmlFor='email'>이메일</label>
          <input
            id='email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id='email-error' className='field-error'>
              {errors.email}
            </p>
          )}
        </div>

        <div className='field'>
          <label htmlFor='password'>비밀번호</label>
          <input
            id='password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p id='password-error' className='field-error'>
              {errors.password}
            </p>
          )}
        </div>

        <button type='submit' disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>

        <p className='signup-hint'>
          아직 계정이 없으신가요? <Link to='/signup'>회원가입</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
