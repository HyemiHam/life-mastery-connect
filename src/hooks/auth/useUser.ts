import { useAuth } from '@/contexts/AuthContext';

export const useUser = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  return {
    user,
    isLoading,
    isAuthenticated,
  };
}; 