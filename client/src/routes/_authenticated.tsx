import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

interface RouteContext {
  auth: {
    isAuthenticated: boolean;
  };
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
      });
    }
  },
  component: () => <Outlet />,
});
