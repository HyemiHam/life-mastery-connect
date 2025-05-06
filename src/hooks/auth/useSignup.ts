import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SignupRequest } from '@/api/auth';

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (userData: {
    email: string;
    password: string;
    username: string;
    fullname?: string;
    adhd_diagnosis?: boolean;
    diagnosis_date?: string | null;
    interests?: string | null;
    avatar_url?: string | null;
    user_type_id?: number;
  }) => {
    if (!userData.email || !userData.password || !userData.username) {
      setError('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const signupData: SignupRequest = {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        fullname: userData.fullname,
        adhd_diagnosis: userData.adhd_diagnosis,
        diagnosis_date: userData.diagnosis_date,
        interests: userData.interests,
        avatar_url: userData.avatar_url,
        user_type_id: userData.user_type_id || 2 // 기본값 2 (일반 사용자)
      };

      const result = await signup(signupData);

      if (result.success) {
        // 회원가입 성공 시 로그인 페이지로 이동하고 성공 메시지 전달
        navigate('/login', {
          replace: true,
          state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' },
        });
      } else {
        setError(result.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error('회원가입 에러:', err);
      setError('회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleSignup };
}; 