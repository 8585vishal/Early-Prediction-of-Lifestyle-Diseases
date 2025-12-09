import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../components/Router';
import { PredictionResults } from '../components/PredictionResults';
import { RecommendationsDisplay } from '../components/RecommendationsDisplay';
import { Button } from '../components/ui/Button';
import { supabase, Prediction, Recommendation } from '../lib/supabase';
import { ArrowLeft, Download } from 'lucide-react';

export function ResultsPage() {
  const { user } = useAuth();
  const { currentPath, navigate } = useRouter();
  const predictionId = currentPath.split('/').pop();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'predictions' | 'recommendations'>('predictions');

  useEffect(() => {
    if (user && predictionId) {
      fetchData();
    }
  }, [user, predictionId]);

  const fetchData = async () => {
    try {
      const { data: predictionData, error: predError } = await supabase
        .from('predictions')
        .select('*')
        .eq('id', predictionId)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (predError) throw predError;
      setPrediction(predictionData);

      const { data: recommendationData, error: recError } = await supabase
        .from('recommendations')
        .select('*')
        .eq('prediction_id', predictionId)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (recError) throw recError;
      setRecommendation(recommendationData);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  if (!prediction) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Prediction not found
        </h2>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>
        <Button variant="outline">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'predictions'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('predictions')}
        >
          Prediction Results
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'recommendations'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('recommendations')}
          disabled={!recommendation}
        >
          Recommendations
        </button>
      </div>

      {activeTab === 'predictions' && <PredictionResults prediction={prediction} />}
      {activeTab === 'recommendations' && recommendation && (
        <RecommendationsDisplay recommendation={recommendation} />
      )}
    </div>
  );
}