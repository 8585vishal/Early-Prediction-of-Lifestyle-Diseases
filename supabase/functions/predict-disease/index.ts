import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface HealthData {
  age: number;
  gender: string;
  bmi: number;
  systolic_bp: number;
  diastolic_bp: number;
  glucose_level: number;
  cholesterol_total: number;
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

function calculateDiabetesRisk(data: HealthData): { risk: number; confidence: number } {
  let risk = 0;
  let confidence = 85;

  if (data.bmi > 30) risk += 25;
  else if (data.bmi > 25) risk += 15;

  if (data.glucose_level > 125) risk += 30;
  else if (data.glucose_level > 100) risk += 15;

  if (data.age > 45) risk += 10;

  if (data.family_history_diabetes) risk += 15;

  if (data.activity_level === 'sedentary') risk += 10;

  if (data.dietary_habits === 'poor') risk += 10;

  return { risk: Math.min(risk, 100), confidence };
}

function calculateHeartDiseaseRisk(data: HealthData): { risk: number; confidence: number } {
  let risk = 0;
  let confidence = 82;

  if (data.systolic_bp > 140 || data.diastolic_bp > 90) risk += 25;
  else if (data.systolic_bp > 130 || data.diastolic_bp > 85) risk += 15;

  if (data.cholesterol_total > 240) risk += 20;
  else if (data.cholesterol_total > 200) risk += 10;

  if (data.smoking_status === 'current') risk += 20;
  else if (data.smoking_status === 'former') risk += 10;

  if (data.age > 55) risk += 15;

  if (data.family_history_heart_disease) risk += 15;

  if (data.stress_score > 7) risk += 10;

  if (data.bmi > 30) risk += 10;

  return { risk: Math.min(risk, 100), confidence };
}

function calculateHypertensionRisk(data: HealthData): { risk: number; confidence: number } {
  let risk = 0;
  let confidence = 88;

  if (data.systolic_bp > 140) risk += 40;
  else if (data.systolic_bp > 130) risk += 25;
  else if (data.systolic_bp > 120) risk += 15;

  if (data.diastolic_bp > 90) risk += 30;
  else if (data.diastolic_bp > 85) risk += 20;

  if (data.family_history_hypertension) risk += 15;

  if (data.alcohol_consumption === 'heavy') risk += 10;
  else if (data.alcohol_consumption === 'moderate') risk += 5;

  if (data.stress_score > 7) risk += 10;

  if (data.bmi > 30) risk += 10;

  return { risk: Math.min(risk, 100), confidence };
}

function calculateObesityRisk(data: HealthData): { risk: number; confidence: number } {
  let risk = 0;
  let confidence = 95;

  if (data.bmi >= 30) risk = 90;
  else if (data.bmi >= 25) risk = 60;
  else if (data.bmi >= 23) risk = 30;
  else risk = 10;

  if (data.activity_level === 'sedentary') risk += 5;

  if (data.dietary_habits === 'poor') risk += 5;

  return { risk: Math.min(risk, 100), confidence };
}

function calculateOverallRiskLevel(risks: number[]): string {
  const avgRisk = risks.reduce((a, b) => a + b, 0) / risks.length;
  if (avgRisk < 25) return 'low';
  if (avgRisk < 50) return 'moderate';
  if (avgRisk < 75) return 'high';
  return 'very_high';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { healthRecordId } = await req.json();

    if (!healthRecordId) {
      return new Response(
        JSON.stringify({ error: "Missing healthRecordId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: healthRecord, error: fetchError } = await supabase
      .from("health_records")
      .select("*")
      .eq("id", healthRecordId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError || !healthRecord) {
      return new Response(
        JSON.stringify({ error: "Health record not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const diabetes = calculateDiabetesRisk(healthRecord);
    const heartDisease = calculateHeartDiseaseRisk(healthRecord);
    const hypertension = calculateHypertensionRisk(healthRecord);
    const obesity = calculateObesityRisk(healthRecord);

    const overallRiskLevel = calculateOverallRiskLevel([
      diabetes.risk,
      heartDisease.risk,
      hypertension.risk,
      obesity.risk,
    ]);

    const prediction = {
      user_id: user.id,
      health_record_id: healthRecordId,
      diabetes_risk: diabetes.risk,
      diabetes_confidence: diabetes.confidence,
      heart_disease_risk: heartDisease.risk,
      heart_disease_confidence: heartDisease.confidence,
      hypertension_risk: hypertension.risk,
      hypertension_confidence: hypertension.confidence,
      obesity_risk: obesity.risk,
      obesity_confidence: obesity.confidence,
      overall_risk_level: overallRiskLevel,
      model_version: "v1.0",
    };

    const { data: savedPrediction, error: saveError } = await supabase
      .from("predictions")
      .insert(prediction)
      .select()
      .single();

    if (saveError) {
      return new Response(
        JSON.stringify({ error: "Failed to save prediction" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ prediction: savedPrediction }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});