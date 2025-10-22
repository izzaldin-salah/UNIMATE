import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Brain, BookCheck, BarChart3, Sparkles, Database, Cpu } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LearnMorePageProps {
  onNavigate: (page: string) => void;
}

export function LearnMorePage({ onNavigate }: LearnMorePageProps) {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl mb-6">About UniMate</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              An AI-powered platform designed to revolutionize how university students learn, practice, and succeed in their academic journey.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                UniMate was created to bridge the gap between traditional learning and modern technology. We believe every student deserves personalized, accessible, and effective learning support.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                By combining artificial intelligence with proven educational methods, we help students understand complex concepts, practice effectively, and track their progress toward academic excellence.
              </p>
              <Button onClick={() => onNavigate('courses')} size="lg">
                Start Your Journey
              </Button>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758525861622-f4e7ac86a2d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBib29rcyUyMGxlYXJuaW5nfGVufDF8fHx8MTc2MTEwNDMzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="University students learning"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Core Features</h2>
            <p className="text-xl text-muted-foreground">
              Powerful tools designed for modern learners
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Ask AI</CardTitle>
                <CardDescription>
                  Get instant, accurate answers to your academic questions. Our AI understands context and provides detailed explanations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookCheck className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Generate Tests</CardTitle>
                <CardDescription>
                  Practice with AI-generated quizzes customized to your subjects, chapters, and confidence level.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your learning journey with detailed analytics, performance metrics, and improvement insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Sparkles className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Personalized Help</CardTitle>
                <CardDescription>
                  Receive study recommendations tailored to your learning style, progress, and academic goals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Database className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Subject Library</CardTitle>
                <CardDescription>
                  Access comprehensive coverage of university subjects across all years and departments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Cpu className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Smart Technology</CardTitle>
                <CardDescription>
                  Powered by advanced AI and secure cloud infrastructure for reliable, fast performance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Built with Modern Technology</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              UniMate leverages cutting-edge technologies to provide a seamless, secure, and powerful learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2">Artificial Intelligence</h3>
              <p className="text-muted-foreground">
                Advanced AI models for intelligent tutoring and question answering
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2">Supabase Backend</h3>
              <p className="text-muted-foreground">
                Secure, scalable cloud database for storing your progress and data
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2">Modern UI/UX</h3>
              <p className="text-muted-foreground">
                Beautiful, responsive interface designed for focus and productivity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-6">Experience the Future of Learning</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join UniMate today and discover a smarter way to study.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onNavigate('courses')}
            className="hover:scale-105 transition-transform"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
