import { Link } from '../components/Router';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Activity, Heart, Brain, TrendingUp, Shield, Zap } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Activity,
      title: 'Comprehensive Health Analysis',
      description: 'Advanced ML models analyze multiple health indicators to provide accurate disease risk predictions.',
    },
    {
      icon: Heart,
      title: 'Multiple Disease Detection',
      description: 'Predict risk for diabetes, heart disease, hypertension, and obesity with high confidence scores.',
    },
    {
      icon: Brain,
      title: 'Personalized Recommendations',
      description: 'Get custom fitness plans, diet suggestions, and lifestyle modifications tailored to your needs.',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Monitor your health metrics over time and see how your lifestyle changes impact your risk levels.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with enterprise-grade security measures.',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get immediate predictions and recommendations powered by state-of-the-art machine learning.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">HealthPredict</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Predict Lifestyle Diseases
            <span className="block text-blue-600 dark:text-blue-400 mt-2">Before They Happen</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Leverage advanced machine learning to assess your health risks and receive personalized recommendations for a healthier life.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg">Start Free Assessment</Button>
            </Link>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} variant="glass" hover>
              <div className="p-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-fit mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are proactively managing their health with our AI-powered platform.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Activity className="w-6 h-6" />
              <span className="text-lg font-semibold">HealthPredict</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 HealthPredict. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}