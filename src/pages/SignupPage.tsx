import { useState } from 'react';
import { useNavigate } from '../components/Router';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Activity, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from '../components/Router';

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card variant="glass" className="w-full max-w-md">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Start your health journey today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Full Name"
              icon={<User className="w-5 h-5" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />

            <Input
              type="email"
              label="Email Address"
              icon={<Mail className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              type="password"
              label="Password"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              icon={<Lock className="w-5 h-5" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  By signing up, you agree to receive personalized health recommendations based on your data.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}