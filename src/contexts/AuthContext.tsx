import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, login as apiLogin, logout as apiLogout, signup as apiSignup } from '@/api/auth';
import { LoginRequest, SignupRequest, User } from '@/api/auth';
import { setAuthToken, setupTokenFromStorage } from '@/api/axios';
import supabase from '@/api/auth/supabase-client';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>;
  signup: (userData: SignupRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => ({ success: false, message: '구현되지 않았습니다.' }),
  signup: async () => ({ success: false, message: '구현되지 않았습니다.' }),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Supabase 인증 상태 변경 감지
  useEffect(() => {
    // 초기 인증 상태 확인
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // 토큰이 있으면 Axios 헤더에 설정
        setupTokenFromStorage();
        
        // 토큰으로 사용자 정보 조회
        const response = await getCurrentUser();
        
        if (response.success && response.data) {
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('인증 초기화 오류:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Supabase 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // 로그인 시 상태 업데이트
          setIsAuthenticated(true);
          setUser(session.user as User);
          
          // Axios 헤더에 토큰 설정
          setAuthToken(session.access_token);
          
          // 로컬 스토리지에 토큰 저장
          localStorage.setItem('access_token', session.access_token);
          localStorage.setItem('refresh_token', session.refresh_token);
          
          // 사용자 ID 저장 (게시글 작성 등에 사용)
          localStorage.setItem('user_id', session.user.id);
        } else if (event === 'SIGNED_OUT') {
          // 로그아웃 시 상태 초기화
          setIsAuthenticated(false);
          setUser(null);
          
          // Axios 헤더에서 토큰 제거
          setAuthToken(null);
          
          // 로컬 스토리지에서 토큰 제거
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_id');
        }
      }
    );

    // 클린업
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 로그인 처리
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(credentials);
      
      // API 응답 확인 (성공 시 상태 업데이트는 onAuthStateChange 리스너에서 자동으로 처리됨)
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('로그인 오류:', error);
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 처리
  const signup = async (userData: SignupRequest) => {
    setIsLoading(true);
    try {
      const response = await apiSignup(userData);
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('회원가입 오류:', error);
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      // 상태 업데이트는 onAuthStateChange 리스너에서 자동으로 처리됨
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 