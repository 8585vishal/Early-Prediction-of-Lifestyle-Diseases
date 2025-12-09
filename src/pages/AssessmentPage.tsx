import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../components/Router';
import { HealthAssessmentForm, HealthFormData } from '../components/HealthAssessmentForm';
import { supabase } from '../lib/supabase';

export function AssessmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: HealthFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const healthRecordData = {
        user_id: user.id,
        ...formData,
      };

      const { data: healthRecord, error: healthError } = await supabase
        .from('health_records')
        .insert(healthRecordData)
        .select()
        .single();

      if (healthError) throw healthError;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(`${supabaseUrl}/functions/v1/predict-disease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ healthRecordId: healthRecord.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prediction');
      }

      const { prediction } = await response.json();

      const recommendationsResponse = await fetch(`${supabaseUrl}/functions/v1/generate-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ predictionId: prediction.id }),
      });

      if (!recommendationsResponse.ok) {
        throw new Error('Failed to generate recommendations');
      }

      navigate(`/results/${prediction.id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process health assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Health Assessment
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Fill out your health information to get personalized risk predictions
        </p>
      </div>

      <HealthAssessmentForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}