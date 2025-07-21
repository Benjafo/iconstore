import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { refreshToken, logoutUser, clearAuth } from '@/store/authSlice';
import { tokenManager } from '@/utils/tokenManager';
import { useEffect } from 'react';

/**
 * Auth hook that provides authentication state and actions
 */
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authState.token) {
      tokenManager.setAccessToken(authState.token);
    }
  }, [authState.token]);

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      tokenManager.clearAccessToken();
      dispatch(clearAuth());
    }
  };

  const refreshAuth = async () => {
    try {
      const result = await dispatch(refreshToken()).unwrap();
      tokenManager.setAccessToken(result.accessToken);
      return result;
    } catch (error) {
      tokenManager.clearAccessToken();
      dispatch(clearAuth());
      throw error;
    }
  };

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    logout,
    refreshAuth,
  };
}
