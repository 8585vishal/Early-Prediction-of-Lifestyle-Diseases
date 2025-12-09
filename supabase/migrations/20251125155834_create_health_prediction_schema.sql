/*
  # Health Prediction System Database Schema

  ## Overview
  Complete database schema for the Early Prediction of Lifestyle Diseases application.
  
  ## Tables Created
  
  ### 1. profiles
  - Stores extended user profile information
  - Links to auth.users via user_id
  - Includes role (user/admin), personal details
  
  ### 2. health_records
  - Stores user health assessment data
  - All vital health metrics (BMI, BP, glucose, etc.)
  - Lifestyle factors (activity, sleep, diet, smoking, alcohol)
  - Family history and stress levels
  
  ### 3. predictions
  - Stores ML model prediction results
  - Disease risk scores and confidence levels
  - Links to health_records
  
  ### 4. recommendations
  - Personalized health recommendations
  - Fitness, diet, sleep, stress management tips
  - Links to predictions
  
  ### 5. admin_analytics
  - Aggregated analytics data
  - System metrics and insights
  
  ## Security
  - RLS enabled on all tables
  - Separate policies for users and admins
  - Users can only access their own data
  - Admins have read-only access to aggregated data
  
  ## Notes
  - All timestamps use timestamptz for proper timezone handling
  - Numeric fields use appropriate precision
  - Foreign keys ensure data integrity
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  age integer NOT NULL CHECK (age >= 1 AND age <= 120),
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height_cm numeric(5,2) NOT NULL CHECK (height_cm > 0),
  weight_kg numeric(5,2) NOT NULL CHECK (weight_kg > 0),
  bmi numeric(4,2) NOT NULL CHECK (bmi > 0),
  systolic_bp integer NOT NULL CHECK (systolic_bp > 0),
  diastolic_bp integer NOT NULL CHECK (diastolic_bp > 0),
  glucose_level numeric(5,2) NOT NULL CHECK (glucose_level > 0),
  cholesterol_total numeric(5,2) NOT NULL CHECK (cholesterol_total > 0),
  cholesterol_hdl numeric(5,2) CHECK (cholesterol_hdl > 0),
  cholesterol_ldl numeric(5,2) CHECK (cholesterol_ldl > 0),
  heart_rate integer NOT NULL CHECK (heart_rate > 0 AND heart_rate < 300),
  activity_level text NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  sleep_hours numeric(3,1) NOT NULL CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  stress_score integer NOT NULL CHECK (stress_score >= 1 AND stress_score <= 10),
  smoking_status text NOT NULL CHECK (smoking_status IN ('never', 'former', 'current')),
  alcohol_consumption text NOT NULL CHECK (alcohol_consumption IN ('none', 'occasional', 'moderate', 'heavy')),
  dietary_habits text NOT NULL CHECK (dietary_habits IN ('poor', 'fair', 'good', 'excellent')),
  family_history_diabetes boolean DEFAULT false,
  family_history_heart_disease boolean DEFAULT false,
  family_history_hypertension boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  health_record_id uuid REFERENCES health_records(id) ON DELETE CASCADE NOT NULL,
  diabetes_risk numeric(5,2) NOT NULL CHECK (diabetes_risk >= 0 AND diabetes_risk <= 100),
  diabetes_confidence numeric(5,2) NOT NULL CHECK (diabetes_confidence >= 0 AND diabetes_confidence <= 100),
  heart_disease_risk numeric(5,2) NOT NULL CHECK (heart_disease_risk >= 0 AND heart_disease_risk <= 100),
  heart_disease_confidence numeric(5,2) NOT NULL CHECK (heart_disease_confidence >= 0 AND heart_disease_confidence <= 100),
  hypertension_risk numeric(5,2) NOT NULL CHECK (hypertension_risk >= 0 AND hypertension_risk <= 100),
  hypertension_confidence numeric(5,2) NOT NULL CHECK (hypertension_confidence >= 0 AND hypertension_confidence <= 100),
  obesity_risk numeric(5,2) NOT NULL CHECK (obesity_risk >= 0 AND obesity_risk <= 100),
  obesity_confidence numeric(5,2) NOT NULL CHECK (obesity_confidence >= 0 AND obesity_confidence <= 100),
  overall_risk_level text NOT NULL CHECK (overall_risk_level IN ('low', 'moderate', 'high', 'very_high')),
  model_version text DEFAULT 'v1.0',
  created_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id uuid REFERENCES predictions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fitness_plan jsonb NOT NULL,
  diet_plan jsonb NOT NULL,
  sleep_optimization jsonb NOT NULL,
  stress_management jsonb NOT NULL,
  weekly_schedule jsonb NOT NULL,
  priority_actions text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create admin_analytics table
CREATE TABLE IF NOT EXISTS admin_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date date NOT NULL UNIQUE,
  total_users integer DEFAULT 0,
  total_predictions integer DEFAULT 0,
  active_users_today integer DEFAULT 0,
  high_risk_count integer DEFAULT 0,
  moderate_risk_count integer DEFAULT 0,
  low_risk_count integer DEFAULT 0,
  diabetes_predictions integer DEFAULT 0,
  heart_disease_predictions integer DEFAULT 0,
  hypertension_predictions integer DEFAULT 0,
  obesity_predictions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Health records policies
CREATE POLICY "Users can view own health records"
  ON health_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health records"
  ON health_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health records"
  ON health_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health records"
  ON health_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Predictions policies
CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Recommendations policies
CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admin analytics policies
CREATE POLICY "Admins can view analytics"
  ON admin_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert analytics"
  ON admin_analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can update analytics"
  ON admin_analytics FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_created_at ON health_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_health_record_id ON predictions(health_record_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_prediction_id ON recommendations(prediction_id);
CREATE INDEX IF NOT EXISTS idx_admin_analytics_date ON admin_analytics(metric_date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_analytics_updated_at
  BEFORE UPDATE ON admin_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();