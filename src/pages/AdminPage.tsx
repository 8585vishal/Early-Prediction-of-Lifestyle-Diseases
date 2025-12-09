import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../components/Router';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import { Users, Activity, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalPredictions: number;
  lowRisk: number;
  moderateRisk: number;
  highRisk: number;
  veryHighRisk: number;
  diabetesPredictions: number;
  heartDiseasePredictions: number;
  hypertensionPredictions: number;
  obesityPredictions: number;
}

export function AdminPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPredictions: 0,
    lowRisk: 0,
    moderateRisk: 0,
    highRisk: 0,
    veryHighRisk: 0,
    diabetesPredictions: 0,
    heartDiseasePredictions: 0,
    hypertensionPredictions: 0,
    obesityPredictions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchStats();
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { data: predictions } = await supabase
        .from('predictions')
        .select('*');

      const totalPredictions = predictions?.length || 0;

      const riskCounts = predictions?.reduce(
        (acc, pred) => {
          acc[pred.overall_risk_level] = (acc[pred.overall_risk_level] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const diseaseCounts = predictions?.reduce(
        (acc, pred) => {
          if (pred.diabetes_risk > 50) acc.diabetes++;
          if (pred.heart_disease_risk > 50) acc.heartDisease++;
          if (pred.hypertension_risk > 50) acc.hypertension++;
          if (pred.obesity_risk > 50) acc.obesity++;
          return acc;
        },
        { diabetes: 0, heartDisease: 0, hypertension: 0, obesity: 0 }
      );

      setStats({
        totalUsers: usersCount || 0,
        totalPredictions,
        lowRisk: riskCounts?.low || 0,
        moderateRisk: riskCounts?.moderate || 0,
        highRisk: riskCounts?.high || 0,
        veryHighRisk: riskCounts?.very_high || 0,
        diabetesPredictions: diseaseCounts?.diabetes || 0,
        heartDiseasePredictions: diseaseCounts?.heartDisease || 0,
        hypertensionPredictions: diseaseCounts?.hypertension || 0,
        obesityPredictions: diseaseCounts?.obesity || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">System analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Predictions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalPredictions}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg per User</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalUsers > 0
                    ? (stats.totalPredictions / stats.totalUsers).toFixed(1)
                    : '0'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Risk Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.highRisk + stats.veryHighRisk}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Risk Distribution
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="success">Low Risk</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.lowRisk} users
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalPredictions > 0
                    ? ((stats.lowRisk / stats.totalPredictions) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="warning">Moderate Risk</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.moderateRisk} users
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalPredictions > 0
                    ? ((stats.moderateRisk / stats.totalPredictions) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="danger">High Risk</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.highRisk} users
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalPredictions > 0
                    ? ((stats.highRisk / stats.totalPredictions) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="danger">Very High Risk</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.veryHighRisk} users
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalPredictions > 0
                    ? ((stats.veryHighRisk / stats.totalPredictions) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Disease Predictions (High Risk)
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Diabetes</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.diabetesPredictions}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Heart Disease
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.heartDiseasePredictions}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Hypertension
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.hypertensionPredictions}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Obesity</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.obesityPredictions}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}