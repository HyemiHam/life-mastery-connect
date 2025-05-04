import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY || '';

// Supabase 클라이언트 인스턴스 생성
export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export default supabase; 