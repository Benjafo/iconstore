import { createFileRoute } from '@tanstack/react-router';
import { Section } from '@/components/layout/Section';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="3xl" background="gradient" className="text-center">
        <div className="space-y-6">
          <Heading level="h1" className="text-balance">
            Welcome to IconStore
          </Heading>
          <Text
            size="lg"
            color="muted"
            className="max-w-2xl mx-auto text-balance"
          >
            Discover, collect, and manage your favorite icons. Build your
            perfect icon library with our curated collection.
          </Text>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">
              Browse Icons
            </Button>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section spacing="2xl">
        <div className="text-center mb-12">
          <Heading level="h2" className="mb-4">
            Why Choose IconStore?
          </Heading>
          <Text color="muted" className="max-w-2xl mx-auto">
            Everything you need to manage your icon collection efficiently
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Curated Collection</CardTitle>
              <CardDescription>
                High-quality icons handpicked by designers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text size="sm" color="muted">
                Access thousands of professionally designed icons that enhance
                your projects and applications.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Easy Management</CardTitle>
              <CardDescription>
                Organize your icons with smart collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text size="sm" color="muted">
                Create custom collections, tag your favorites, and find the
                perfect icon when you need it.
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multiple Formats</CardTitle>
              <CardDescription>
                Download in SVG, PNG, and more formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text size="sm" color="muted">
                Get your icons in the format you need, optimized for web,
                mobile, and print applications.
              </Text>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
