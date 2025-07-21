import { createFileRoute, redirect } from '@tanstack/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  beforeLoad: ({ context }) => {
    // Redirect to dashboard if already authenticated
    if (context.auth?.isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
});
