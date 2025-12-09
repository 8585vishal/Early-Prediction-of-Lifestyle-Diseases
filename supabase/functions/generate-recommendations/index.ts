import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateFitnessPlan(riskLevel: string, activityLevel: string, age: number) {
  const exercises = [];

  if (riskLevel === 'high' || riskLevel === 'very_high') {
    exercises.push(
      { name: "Walking", duration: "30 minutes", frequency: "Daily" },
      { name: "Light Stretching", duration: "15 minutes", frequency: "Daily" },
      { name: "Breathing Exercises", duration: "10 minutes", frequency: "Twice daily" }
    );
  } else if (riskLevel === 'moderate') {
    exercises.push(
      { name: "Brisk Walking", duration: "45 minutes", frequency: "5 days/week" },
      { name: "Yoga", duration: "30 minutes", frequency: "3 days/week" },
      { name: "Light Resistance Training", duration: "20 minutes", frequency: "2 days/week" }
    );
  } else {
    exercises.push(
      { name: "Jogging/Running", duration: "30 minutes", frequency: "4 days/week" },
      { name: "Strength Training", duration: "45 minutes", frequency: "3 days/week" },
      { name: "Swimming or Cycling", duration: "30 minutes", frequency: "2 days/week" }
    );
  }

  const goals = [
    "Maintain a healthy weight",
    "Improve cardiovascular health",
    "Increase muscle strength and flexibility",
    "Reduce stress levels",
  ];

  return { exercises, goals };
}

function generateDietPlan(bmi: number, glucose: number, cholesterol: number) {
  const meals = [
    {
      type: "Breakfast",
      suggestions: [
        "Oatmeal with berries and nuts",
        "Greek yogurt with chia seeds",
        "Whole grain toast with avocado",
      ],
    },
    {
      type: "Lunch",
      suggestions: [
        "Grilled chicken salad with olive oil",
        "Quinoa bowl with vegetables",
        "Lentil soup with whole grain bread",
      ],
    },
    {
      type: "Dinner",
      suggestions: [
        "Baked salmon with steamed vegetables",
        "Lean turkey with brown rice",
        "Vegetable stir-fry with tofu",
      ],
    },
    {
      type: "Snacks",
      suggestions: [
        "Mixed nuts and seeds",
        "Fresh fruit",
        "Vegetable sticks with hummus",
      ],
    },
  ];

  const guidelines = [
    "Eat 5-6 small meals throughout the day",
    "Limit sodium intake to less than 2,300mg per day",
    "Include fiber-rich foods in every meal",
    "Stay hydrated with 8-10 glasses of water daily",
    "Avoid processed and fried foods",
    "Reduce sugar and refined carbohydrates",
  ];

  if (glucose > 100) {
    guidelines.push("Monitor carbohydrate intake and choose low glycemic index foods");
  }

  if (cholesterol > 200) {
    guidelines.push("Limit saturated fats and increase omega-3 fatty acids");
  }

  if (bmi > 25) {
    guidelines.push("Focus on portion control and calorie-dense foods");
  }

  return { meals, guidelines };
}

function generateSleepOptimization(sleepHours: number, stressScore: number) {
  const targetHours = sleepHours < 7 ? 7.5 : sleepHours > 9 ? 8 : sleepHours;

  const tips = [
    "Establish a consistent sleep schedule",
    "Create a relaxing bedtime routine",
    "Keep your bedroom cool, dark, and quiet",
    "Avoid screens 1 hour before bedtime",
    "Limit caffeine after 2 PM",
    "Practice relaxation techniques before bed",
  ];

  if (stressScore > 7) {
    tips.push("Try meditation or deep breathing exercises before sleep");
    tips.push("Consider journaling to clear your mind");
  }

  return { target_hours: targetHours, tips };
}

function generateStressManagement(stressScore: number) {
  const techniques = [
    "Mindfulness meditation (15 minutes daily)",
    "Deep breathing exercises",
    "Progressive muscle relaxation",
    "Regular physical activity",
    "Social connection and support",
  ];

  const dailyPractices = [
    "Start your day with 5 minutes of gratitude",
    "Take short breaks every 2 hours",
    "Practice mindful eating",
    "Limit news and social media consumption",
    "Spend time in nature",
  ];

  if (stressScore > 7) {
    techniques.push("Consider professional counseling or therapy");
    dailyPractices.push("Keep a stress journal to identify triggers");
  }

  return { techniques, daily_practices: dailyPractices };
}

function generateWeeklySchedule() {
  return {
    days: [
      {
        day: "Monday",
        activities: [
          "Morning: 30-min walk",
          "Afternoon: Healthy meal prep",
          "Evening: 15-min meditation",
        ],
      },
      {
        day: "Tuesday",
        activities: [
          "Morning: Yoga session",
          "Afternoon: Health check-in",
          "Evening: Early bedtime routine",
        ],
      },
      {
        day: "Wednesday",
        activities: [
          "Morning: Cardio exercise",
          "Afternoon: Stress management practice",
          "Evening: Meal planning",
        ],
      },
      {
        day: "Thursday",
        activities: [
          "Morning: Strength training",
          "Afternoon: Mindful eating practice",
          "Evening: Relaxation exercises",
        ],
      },
      {
        day: "Friday",
        activities: [
          "Morning: Light exercise",
          "Afternoon: Social activity",
          "Evening: Sleep optimization routine",
        ],
      },
      {
        day: "Saturday",
        activities: [
          "Morning: Active recreation",
          "Afternoon: Healthy cooking",
          "Evening: Self-care activities",
        ],
      },
      {
        day: "Sunday",
        activities: [
          "Morning: Gentle stretching",
          "Afternoon: Weekly health review",
          "Evening: Prep for the week ahead",
        ],
      },
    ],
  };
}

function generatePriorityActions(overallRisk: string, predictions: any, healthData: any) {
  const actions = [];

  if (predictions.diabetes_risk > 50) {
    actions.push("Schedule a blood glucose test with your healthcare provider");
  }

  if (predictions.heart_disease_risk > 50) {
    actions.push("Consult a cardiologist for a comprehensive heart health assessment");
  }

  if (predictions.hypertension_risk > 50) {
    actions.push("Monitor blood pressure daily and maintain a log");
  }

  if (healthData.bmi > 30) {
    actions.push("Start a medically supervised weight loss program");
  }

  if (healthData.smoking_status === 'current') {
    actions.push("Join a smoking cessation program immediately");
  }

  if (healthData.stress_score > 7) {
    actions.push("Consider stress counseling or therapy sessions");
  }

  if (actions.length === 0) {
    actions.push("Continue maintaining your healthy lifestyle");
    actions.push("Schedule regular health check-ups");
  }

  return actions;
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

    const { predictionId } = await req.json();

    if (!predictionId) {
      return new Response(
        JSON.stringify({ error: "Missing predictionId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: prediction, error: predError } = await supabase
      .from("predictions")
      .select("*, health_records(*)")
      .eq("id", predictionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (predError || !prediction) {
      return new Response(
        JSON.stringify({ error: "Prediction not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const healthData = prediction.health_records;

    const fitness_plan = generateFitnessPlan(
      prediction.overall_risk_level,
      healthData.activity_level,
      healthData.age
    );

    const diet_plan = generateDietPlan(
      healthData.bmi,
      healthData.glucose_level,
      healthData.cholesterol_total
    );

    const sleep_optimization = generateSleepOptimization(
      healthData.sleep_hours,
      healthData.stress_score
    );

    const stress_management = generateStressManagement(healthData.stress_score);

    const weekly_schedule = generateWeeklySchedule();

    const priority_actions = generatePriorityActions(
      prediction.overall_risk_level,
      prediction,
      healthData
    );

    const recommendation = {
      prediction_id: predictionId,
      user_id: user.id,
      fitness_plan,
      diet_plan,
      sleep_optimization,
      stress_management,
      weekly_schedule,
      priority_actions,
    };

    const { data: savedRecommendation, error: saveError } = await supabase
      .from("recommendations")
      .insert(recommendation)
      .select()
      .single();

    if (saveError) {
      return new Response(
        JSON.stringify({ error: "Failed to save recommendations" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ recommendation: savedRecommendation }),
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