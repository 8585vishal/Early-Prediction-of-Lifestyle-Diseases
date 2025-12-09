import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: string;
  user_id: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height_cm: number;
  weight_kg: number;
  bmi: number;
  systolic_bp: number;
  diastolic_bp: number;
  glucose_level: number;
  cholesterol_total: number;
  cholesterol_hdl?: number;
  cholesterol_ldl?: number;
  heart_rate: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  sleep_hours: number;
  stress_score: number;
  smoking_status: 'never' | 'former' | 'current';
  alcohol_consumption: 'none' | 'occasional' | 'moderate' | 'heavy';
  dietary_habits: 'poor' | 'fair' | 'good' | 'excellent';
  family_history_diabetes: boolean;
  family_history_heart_disease: boolean;
  family_history_hypertension: boolean;
  created_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  health_record_id: string;
  diabetes_risk: number;
  diabetes_confidence: number;
  heart_disease_risk: number;
  heart_disease_confidence: number;
  hypertension_risk: number;
  hypertension_confidence: number;
  obesity_risk: number;
  obesity_confidence: number;
  overall_risk_level: 'low' | 'moderate' | 'high' | 'very_high';
  model_version: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  prediction_id: string;
  user_id: string;
  fitness_plan: {
    exercises: Array<{ name: string; duration: string; frequency: string }>;
    goals: string[];
  };
  diet_plan: {
    meals: Array<{ type: string; suggestions: string[] }>;
    guidelines: string[];
  };
  sleep_optimization: {
    target_hours: number;
    tips: string[];
  };
  stress_management: {
    techniques: string[];
    daily_practices: string[];
  };
  weekly_schedule: {
    days: Array<{ day: string; activities: string[] }>;
  };
  priority_actions: string[];
  created_at: string;
}

export interface AdminAnalytics {
  id: string;
  metric_date: string;
  total_users: number;
  total_predictions: number;
  active_users_today: number;
  high_risk_count: number;
  moderate_risk_count: number;
  low_risk_count: number;
  diabetes_predictions: number;
  heart_disease_predictions: number;
  hypertension_predictions: number;
  obesity_predictions: number;
  created_at: string;
  updated_at: string;
}