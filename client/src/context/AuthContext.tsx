import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { refreshToken, setCredentials, clearAuth } from '@/store/authSlice';
import { tokenManager } from '@/utils/tokenManager';

interface User {
  id: string;
  email: string;
  username: string;
  currency_balance: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth context provider that handles automatic token refresh and auth state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const checkAuthStatus = async () => {
    try {
      const result = await dispatch(refreshToken()).unwrap();
      tokenManager.setAccessToken(result.accessToken);
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
        })
      );
    } catch {
      tokenManager.clearAccessToken();
      dispatch(clearAuth());
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
