import axios from 'axios';

// Supabase URL과 API 키
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_API_KEY || '';

// Supabase REST API용 Axios 인스턴스
export const supabaseApi = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    'apikey': SUPABASE_KEY,
    'Content-Type': 'application/json'
  }
});

// Supabase Auth API용 Axios 인스턴스
export const supabaseAuthApi = axios.create({
  baseURL: `${SUPABASE_URL}/auth/v1`,
  headers: {
    'apikey': SUPABASE_KEY,
    'Content-Type': 'application/json'
  }
});

// 인증 토큰 설정 함수
export const setAuthToken = (token: string | null) => {
  if (token) {
    supabaseApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    supabaseAuthApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete supabaseApi.defaults.headers.common['Authorization'];
    delete supabaseAuthApi.defaults.headers.common['Authorization'];
  }
};

// 로컬 스토리지에서 토큰을 가져와 설정
export const setupTokenFromStorage = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    setAuthToken(token);
  }
};

// 기본 에러 처리 함수
export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response) {
    return {
      success: false,
      message: error.response.data?.error || error.response.data?.message || '오류가 발생했습니다.',
      code: error.response.status,
      data: error.response.data
    };
  }
  return {
    success: false,
    message: (error as Error)?.message || '알 수 없는 오류가 발생했습니다.',
    code: 'UNKNOWN_ERROR'
  };
}; 