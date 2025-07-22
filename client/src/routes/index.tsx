import { createFileRoute, Link } from '@tanstack/react-router';
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
    <div className="page-container">
      {/* Hero Section */}
      <Section spacing="3xl" background="gradient" className="text-center">
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <Heading level="h1" className="text-hero">
              Welcome to IconStore
            </Heading>
            <Text
              size="xl"
              color="muted"
              className="max-w-3xl mx-auto text-balance leading-relaxed"
            >
              Discover, collect, and manage your favorite icons. Build your
              perfect icon library with our curated collection of
              professional-grade design assets.
            </Text>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button size="lg" className="btn-primary-enhanced w-full sm:w-auto">
              <Link to="/auth" className="flex items-center gap-2">
                Get Started
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Browse Icons
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-8 border-t border-border/20">
            <div className="text-center">
              <Text size="xl" weight="bold" className="text-primary">10K+</Text>
              <Text size="sm" color="muted">Icons</Text>
            </div>
            <div className="text-center">
              <Text size="xl" weight="bold" className="text-primary">50+</Text>
              <Text size="sm" color="muted">Categories</Text>
            </div>
            <div className="text-center">
              <Text size="xl" weight="bold" className="text-primary">1K+</Text>
              <Text size="sm" color="muted">Users</Text>
            </div>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section spacing="2xl" background="muted">
        <div className="text-center mb-16 animate-slide-up">
          <Heading level="h2" className="text-section-title mb-4">
            Why Choose IconStore?
          </Heading>
          <Text size="lg" color="muted" className="max-w-2xl mx-auto">
            Everything you need to manage your icon collection efficiently
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Curated Collection',
              description: 'High-quality icons handpicked by designers',
              content:
                'Access thousands of professionally designed icons that enhance your projects and applications.',
              icon: '⭐',
            },
            {
              title: 'Easy Management',
              description: 'Organize your icons with smart collections',
              content:
                'Create custom collections, tag your favorites, and find the perfect icon when you need it.',
              icon: '📁',
            },
            {
              title: 'Multiple Formats',
              description: 'Download in SVG, PNG, and more formats',
              content:
                'Get your icons in the format you need, optimized for web, mobile, and print applications.',
              icon: '📦',
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className={`card-interactive animate-scale-in bg-card/80 backdrop-blur-sm border-border/20`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <CardTitle className="text-card-title">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Text
                  size="sm"
                  color="muted"
                  className="text-center leading-relaxed"
                >
                  {feature.content}
                </Text>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section spacing="xl" className="text-center">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <Heading level="h2" className="text-section-title">
            Ready to Get Started?
          </Heading>
          <Text size="lg" color="muted">
            Join thousands of designers and developers who trust IconStore for
            their projects.
          </Text>
          <Button size="lg" className="btn-primary-enhanced">
            <Link to="/auth">Create Your Account</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}
