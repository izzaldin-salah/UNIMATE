import { Button } from './ui/button';
import { BookOpen, Brain, TrendingUp, MessageSquare } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl mb-6">
                Your Smart Study Buddy
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8">
                Get help, test yourself, and learn smarter with AI-powered assistance tailored for university students.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => onNavigate('learn-more')}
                  className="hover:scale-105 transition-transform"
                >
                  Learn More
                </Button>
                <Button
                  size="lg"
                  onClick={() => onNavigate('courses')}
                  className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-transform"
                >
                  Get Started
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758270704534-fd9715bffc0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlZHVjYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTAzNDY0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern education technology"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              UniMate combines AI technology with proven learning methods to help you excel in your studies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Brain className="w-12 h-12 text-blue-600" />}
              title="Ask AI"
              description="Get instant answers to your academic questions from our intelligent AI assistant."
            />
            <FeatureCard
              icon={<BookOpen className="w-12 h-12 text-blue-600" />}
              title="Generate Tests"
              description="Practice with AI-generated quizzes tailored to your subjects and difficulty level."
            />
            <FeatureCard
              icon={<TrendingUp className="w-12 h-12 text-blue-600" />}
              title="Track Progress"
              description="Monitor your learning journey with detailed analytics and performance insights."
            />
            <FeatureCard
              icon={<MessageSquare className="w-12 h-12 text-blue-600" />}
              title="Personalized Help"
              description="Receive customized study recommendations based on your progress and goals."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already learning smarter with UniMate.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onNavigate('courses')}
            className="hover:scale-105 transition-transform"
          >
            Start Learning Now
          </Button>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
