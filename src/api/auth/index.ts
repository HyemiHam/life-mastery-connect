import axios from 'axios';
import { supabaseAuthApi, handleApiError } from '../axios';
import supabase from './supabase-client';

// 사용자 타입 정의
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    username?: string;
    avatar_url?: string;
    fullname?: string;
  };
}

// 회원가입 요청 타입
export interface SignupRequest {
  email: string;
  password: string;
  username: string;
  fullname?: string;
  adhd_diagnosis?: boolean;
  diagnosis_date?: string | null;
  interests?: string | null;
  avatar_url?: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  code?: string | number;
}

/**
 * 회원가입 API - Supabase 클라이언트 사용
 */
export const signup = async (data: SignupRequest): Promise<ApiResponse<User>> => {
  try {
    // Supabase 클라이언트를 사용한 회원가입
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          fullname: data.fullname,
          adhd_diagnosis: data.adhd_diagnosis,
          diagnosis_date: data.diagnosis_date,
          interests: data.interests,
          avatar_url: data.avatar_url
        }
      }
    });

    if (error) throw error;

    return {
      success: true,
      message: '회원가입 성공! 이메일 인증을 완료해주세요.',
      data: authData.user as User
    };
  } catch (error) {
    console.error('회원가입 오류:', error);
    
    // Supabase 에러 처리
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || '회원가입에 실패했습니다.',
      };
    }
    
    return handleApiError(error);
  }
};

/**
 * 로그인 API - Supabase 클라이언트 사용
 */
export const login = async (data: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
  try {
    // Supabase 클라이언트를 사용한 로그인
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    if (!authData.session || !authData.user) {
      throw new Error('로그인 후 세션 정보를 찾을 수 없습니다.');
    }

    const { access_token, refresh_token } = authData.session;
    
    // 토큰 로컬 스토리지에 저장
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    return {
      success: true,
      message: '로그인 성공',
      data: { 
        user: authData.user as User, 
        token: access_token 
      }
    };
  } catch (error) {
    console.error('로그인 오류:', error);
    
    // Supabase 에러 처리
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || '로그인에 실패했습니다.',
      };
    }
    
    return handleApiError(error);
  }
};

/**
 * 로그아웃 API - Supabase 클라이언트 사용
 */
export const logout = async (): Promise<ApiResponse> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    return {
      success: true,
      message: '로그아웃 완료'
    };
  } catch (error) {
    console.error('로그아웃 오류:', error);
    
    // 로그아웃 실패해도 토큰은 제거
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Supabase 에러 처리
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || '로그아웃 중 오류가 발생했습니다.',
      };
    }
    
    return handleApiError(error);
  }
};

/**
 * 현재 사용자 정보 조회 - Supabase 클라이언트 사용
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (!session) {
      return {
        success: false,
        message: '로그인이 필요합니다.'
      };
    }
    
    // 현재 사용자 정보 조회
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    
    if (!user) {
      return {
        success: false,
        message: '사용자 정보를 찾을 수 없습니다.'
      };
    }
    
    return {
      success: true,
      message: '사용자 정보를 성공적으로 가져왔습니다.',
      data: user as User
    };
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    
    // Supabase 에러 처리
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || '사용자 정보 조회 중 오류가 발생했습니다.',
      };
    }
    
    return handleApiError(error);
  }
}; 