import { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Activity, Heart, Moon, Brain, Apple, Cigarette, Wine, Users } from 'lucide-react';

interface HealthAssessmentFormProps {
  onSubmit: (data: HealthFormData) => Promise<void>;
  loading: boolean;
}

export interface HealthFormData {
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  systolic_bp: number;
  diastolic_bp: number;
  glucose_level: number;
  cholesterol_total: number;
  cholesterol_hdl?: number;
  cholesterol_ldl?: number;
  heart_rate: number;
  activity_level: string;
  sleep_hours: number;
  stress_score: number;
  smoking_status: string;
  alcohol_consumption: string;
  dietary_habits: string;
  family_history_diabetes: boolean;
  family_history_heart_disease: boolean;
  family_history_hypertension: boolean;
}

export function HealthAssessmentForm({ onSubmit, loading }: HealthAssessmentFormProps) {
  const [formData, setFormData] = useState<HealthFormData>({
    age: 30,
    gender: 'male',
    height_cm: 170,
    weight_kg: 70,
    systolic_bp: 120,
    diastolic_bp: 80,
    glucose_level: 90,
    cholesterol_total: 180,
    heart_rate: 72,
    activity_level: 'moderate',
    sleep_hours: 7,
    stress_score: 5,
    smoking_status: 'never',
    alcohol_consumption: 'none',
    dietary_habits: 'good',
    family_history_diabetes: false,
    family_history_heart_disease: false,
    family_history_hypertension: false,
  });

  const [bmi, setBmi] = useState<number>(0);

  const calculateBMI = (height: number, weight: number) => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(2)));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    }));

    if (name === 'height_cm' || name === 'weight_kg') {
      const height = name === 'height_cm' ? parseFloat(value) : formData.height_cm;
      const weight = name === 'weight_kg' ? parseFloat(value) : formData.weight_kg;
      calculateBMI(height, weight);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, bmi });
  };

  const getBMICategory = () => {
    if (bmi === 0) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              name="age"
              label="Age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              required
            />
            <Select
              name="gender"
              label="Gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
            <div className="md:col-span-1"></div>
            <Input
              type="number"
              name="height_cm"
              label="Height (cm)"
              value={formData.height_cm}
              onChange={handleChange}
              min="50"
              max="250"
              step="0.1"
              required
            />
            <Input
              type="number"
              name="weight_kg"
              label="Weight (kg)"
              value={formData.weight_kg}
              onChange={handleChange}
              min="20"
              max="300"
              step="0.1"
              required
            />
            <div className="flex flex-col justify-end">
              {bmi > 0 && (
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">BMI</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{bmi}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{getBMICategory()}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Vital Signs</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              name="systolic_bp"
              label="Systolic BP (mmHg)"
              value={formData.systolic_bp}
              onChange={handleChange}
              min="70"
              max="200"
              required
            />
            <Input
              type="number"
              name="diastolic_bp"
              label="Diastolic BP (mmHg)"
              value={formData.diastolic_bp}
              onChange={handleChange}
              min="40"
              max="130"
              required
            />
            <Input
              type="number"
              name="heart_rate"
              label="Heart Rate (bpm)"
              value={formData.heart_rate}
              onChange={handleChange}
              min="40"
              max="200"
              required
            />
            <Input
              type="number"
              name="glucose_level"
              label="Glucose Level (mg/dL)"
              value={formData.glucose_level}
              onChange={handleChange}
              min="50"
              max="400"
              step="0.1"
              required
            />
            <Input
              type="number"
              name="cholesterol_total"
              label="Total Cholesterol (mg/dL)"
              value={formData.cholesterol_total}
              onChange={handleChange}
              min="100"
              max="400"
              step="0.1"
              required
            />
            <Input
              type="number"
              name="cholesterol_hdl"
              label="HDL Cholesterol (optional)"
              value={formData.cholesterol_hdl || ''}
              onChange={handleChange}
              min="20"
              max="100"
              step="0.1"
            />
          </div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lifestyle Factors</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              name="activity_level"
              label="Activity Level"
              icon={<Activity className="w-5 h-5" />}
              value={formData.activity_level}
              onChange={handleChange}
              options={[
                { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
                { value: 'light', label: 'Light (1-3 days/week)' },
                { value: 'moderate', label: 'Moderate (3-5 days/week)' },
                { value: 'active', label: 'Active (6-7 days/week)' },
                { value: 'very_active', label: 'Very Active (athlete)' },
              ]}
              required
            />
            <div className="flex items-end">
              <Input
                type="number"
                name="sleep_hours"
                label="Sleep Hours (per night)"
                icon={<Moon className="w-5 h-5" />}
                value={formData.sleep_hours}
                onChange={handleChange}
                min="0"
                max="24"
                step="0.5"
                required
              />
            </div>
            <Select
              name="dietary_habits"
              label="Dietary Habits"
              icon={<Apple className="w-5 h-5" />}
              value={formData.dietary_habits}
              onChange={handleChange}
              options={[
                { value: 'poor', label: 'Poor' },
                { value: 'fair', label: 'Fair' },
                { value: 'good', label: 'Good' },
                { value: 'excellent', label: 'Excellent' },
              ]}
              required
            />
            <div className="flex items-end">
              <Input
                type="number"
                name="stress_score"
                label="Stress Level (1-10)"
                icon={<Brain className="w-5 h-5" />}
                value={formData.stress_score}
                onChange={handleChange}
                min="1"
                max="10"
                required
              />
            </div>
            <Select
              name="smoking_status"
              label="Smoking Status"
              icon={<Cigarette className="w-5 h-5" />}
              value={formData.smoking_status}
              onChange={handleChange}
              options={[
                { value: 'never', label: 'Never' },
                { value: 'former', label: 'Former Smoker' },
                { value: 'current', label: 'Current Smoker' },
              ]}
              required
            />
            <Select
              name="alcohol_consumption"
              label="Alcohol Consumption"
              icon={<Wine className="w-5 h-5" />}
              value={formData.alcohol_consumption}
              onChange={handleChange}
              options={[
                { value: 'none', label: 'None' },
                { value: 'occasional', label: 'Occasional' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'heavy', label: 'Heavy' },
              ]}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Family History</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                name="family_history_diabetes"
                checked={formData.family_history_diabetes}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Diabetes
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                name="family_history_heart_disease"
                checked={formData.family_history_heart_disease}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Heart Disease
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                name="family_history_hypertension"
                checked={formData.family_history_hypertension}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Hypertension
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" loading={loading} disabled={loading || bmi === 0}>
          Generate Health Prediction
        </Button>
      </div>
    </form>
  );
}