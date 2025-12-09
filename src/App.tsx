import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Router, Route } from './components/Router';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { AdminPage } from './pages/AdminPage';

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function AppRoutes() {
  return (
    <>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/assessment" component={() => <ProtectedRoute component={AssessmentPage} />} />
      <Route path="/admin" component={() => <ProtectedRoute component={AdminPage} />} />
    </>
  );
}

function ResultsRouteHandler() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <ResultsPage />
    </Layout>
  );
}

function App() {
  const currentPath = window.location.pathname;
  const isResultsRoute = currentPath.startsWith('/results/');

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          {isResultsRoute ? <ResultsRouteHandler /> : <AppRoutes />}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;