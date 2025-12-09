import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../components/Router';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { supabase, Prediction, HealthRecord } from '../lib/supabase';
import { Activity, TrendingUp, Calendar, AlertCircle, Plus } from 'lucide-react';

export function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<(Prediction & { health_records: HealthRecord })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPredictions();
    }
  }, [user]);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*, health_records(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'low':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'high':
      case 'very_high':
        return 'danger';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.full_name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your health overview
          </p>
        </div>
        <Button size="lg" onClick={() => navigate('/assessment')}>
          <Plus className="w-5 h-5 mr-2" />
          New Assessment
        </Button>
      </div>

      {predictions.length === 0 ? (
        <Card variant="gradient">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Activity className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No Health Assessments Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start your health journey by completing your first health assessment. Get personalized insights and recommendations.
            </p>
            <Button size="lg" onClick={() => navigate('/assessment')}>
              Start First Assessment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Assessments</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {predictions.length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Latest Risk Level</p>
                    <div className="mt-2">
                      <Badge variant={getRiskBadgeVariant(predictions[0]?.overall_risk_level)} size="lg">
                        {predictions[0]?.overall_risk_level.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Assessment</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {predictions[0] ? formatDate(predictions[0].created_at) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card variant="glass">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Assessments</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/results/${prediction.id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={getRiskBadgeVariant(prediction.overall_risk_level)}>
                            {prediction.overall_risk_level.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(prediction.created_at)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Diabetes</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {prediction.diabetes_risk}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Heart Disease</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {prediction.heart_disease_risk}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hypertension</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {prediction.hypertension_risk}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Obesity</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {prediction.obesity_risk}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}