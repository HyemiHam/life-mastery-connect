import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await logout();
      
      // 로그아웃 후 홈페이지로 이동
      navigate('/', { replace: true });
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleLogout };
}; 