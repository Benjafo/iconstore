import { createFileRoute, redirect } from '@tanstack/react-router';

interface RouteContext {
  auth: {
    isAuthenticated: boolean;
  };
}
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { useState } from 'react';

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: Auth,
});

function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {isLoginMode ? (
          <LoginForm onSwitchToRegister={() => setIsLoginMode(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLoginMode(true)} />
        )}
      </div>
    </div>
  );
}
