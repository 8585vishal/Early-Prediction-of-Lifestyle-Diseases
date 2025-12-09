import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useNavigate } from './Router';
import { Button } from './ui/Button';
import { Activity, Home, FileText, BarChart3, Settings, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'New Assessment', icon: FileText, path: '/assessment' },
    ...(isAdmin ? [{ name: 'Admin Panel', icon: BarChart3, path: '/admin' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                  HealthPredict
                </span>
              </Link>

              <div className="hidden md:flex space-x-4">
                {navigationItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {profile?.full_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{profile?.email}</p>
                </div>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{item.name}</span>
                    </button>
                  </Link>
                ))}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}