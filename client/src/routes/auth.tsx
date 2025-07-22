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
        <div className="space-y-4">
          <Heading level="h1" className="text-center text-hero">
            IconStore
          </Heading>
          <Text size="lg" color="muted" className="text-center">
            {isLoginMode ? 'Welcome back to your icon collection' : 'Create your account and start collecting'}
          </Text>
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
