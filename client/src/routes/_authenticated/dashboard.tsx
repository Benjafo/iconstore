import { createFileRoute } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { logoutUser } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Section } from '@/components/layout/Section';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="page-container">
      <Section spacing="lg">
        <div className="content-header animate-fade-in">
          <div>
            <Heading level="h1" className="text-section-title">
              Welcome back, {user?.username}!
            </Heading>
            <Text color="muted" className="mt-2">
              Manage your icon collection and account settings
            </Text>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="hover:border-destructive hover:text-destructive transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="card-elevated animate-slide-up">
            <CardHeader>
              <CardTitle className="text-card-title flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                Profile Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <Text size="sm" color="muted">
                  Username
                </Text>
                <Text size="sm" weight="medium">
                  {user?.username}
                </Text>
              </div>
              <div className="flex justify-between items-center">
                <Text size="sm" color="muted">
                  Email
                </Text>
                <Text size="sm" weight="medium">
                  {user?.email}
                </Text>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/20">
                <Text size="sm" color="muted">
                  Status
                </Text>
                <span className="status-online">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Currency Balance Card */}
          <Card
            className="card-elevated animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <CardHeader>
              <CardTitle className="text-card-title flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                Currency Balance
              </CardTitle>
              <CardDescription>Available credits for purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Text
                  size="xl"
                  weight="bold"
                  className="text-2xl text-green-600 dark:text-green-400"
                >
                  ${user?.currency_balance || 0}
                </Text>
                <Text size="sm" color="muted">
                  credits
                </Text>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Add Credits
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card
            className="card-elevated animate-slide-up md:col-span-2 lg:col-span-1"
            style={{ animationDelay: '0.2s' }}
          >
            <CardHeader>
              <CardTitle className="text-card-title flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Browse Icons
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                My Collections
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Favorites
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
