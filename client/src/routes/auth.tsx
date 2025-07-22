import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { CenteredLayout } from '@/components/layout/CenteredLayout';
import { Heading, Text } from '@/components/ui/typography';
import { useState } from 'react';

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (
      (context as { auth?: { isAuthenticated: boolean } })?.auth
        ?.isAuthenticated
    ) {
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
    <CenteredLayout
      background="gradient"
      containerSize="md"
      header={
        <div className="space-y-2">
          <Heading level="h1" className="text-center">
            IconStore
          </Heading>
          <p className="text-muted-foreground">
            {isLoginMode ? 'Welcome back' : 'Create your account'}
          </p>
        </div>
      }
    >
      {isLoginMode ? (
        <LoginForm onSwitchToRegister={() => setIsLoginMode(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLoginMode(true)} />
      )}
    </CenteredLayout>
  );
}
