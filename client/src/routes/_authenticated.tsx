import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!(context as { auth?: { isAuthenticated: boolean } })?.auth?.isAuthenticated) {
      throw redirect({
        to: '/auth',
      });
    }
  },
  component: () => <Outlet />,
});
