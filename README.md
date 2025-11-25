# Early Prediction of Lifestyle Diseases

A production-ready web application that predicts lifestyle disease risks using machine learning models and provides personalized health recommendations.

## Features

### Core Functionality
- **AI-Powered Risk Prediction**: Predict risks for Diabetes, Heart Disease, Hypertension, and Obesity
- **Personalized Recommendations**: Get custom fitness plans, diet suggestions, and lifestyle modifications
- **User Dashboard**: Track health assessments and monitor progress over time
- **Admin Analytics**: Comprehensive system analytics and user insights
- **Light/Dark Mode**: Full theme support with smooth transitions

### Disease Predictions
- **Diabetes Risk Assessment** with confidence scoring
- **Heart Disease Risk Assessment** with detailed analysis
- **Hypertension Risk Evaluation** based on vital signs
- **Obesity Risk Analysis** with BMI calculations

### Health Recommendations
- **Fitness Plans**: Personalized exercise routines based on risk level
- **Diet Plans**: Meal suggestions and nutritional guidelines
- **Sleep Optimization**: Sleep improvement strategies
- **Stress Management**: Techniques and daily practices
- **Weekly Schedule**: Structured 7-day health improvement plan

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **Lucide React** - Beautiful icons

### Backend
- **Supabase** - Database and authentication
- **PostgreSQL** - Relational database
- **Edge Functions** - Serverless prediction API
- **Row Level Security** - Data protection

### ML/AI
- **Custom ML Models** - Disease risk prediction algorithms
- **Edge Computing** - Real-time inference
- **Multi-Factor Analysis** - Comprehensive health assessment

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── RiskGauge.tsx
│   │   │   └── CircularProgress.tsx
│   │   ├── HealthAssessmentForm.tsx
│   │   ├── PredictionResults.tsx
│   │   ├── RecommendationsDisplay.tsx
│   │   ├── Layout.tsx
│   │   └── Router.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AssessmentPage.tsx
│   │   ├── ResultsPage.tsx
│   │   └── AdminPage.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── functions/
│       ├── predict-disease/
│       └── generate-recommendations/
└── package.json
```

## Database Schema

### Tables
- **profiles** - Extended user information and roles
- **health_records** - User health assessment data
- **predictions** - ML prediction results and risk scores
- **recommendations** - Personalized health recommendations
- **admin_analytics** - Aggregated system metrics

### Security
- Row Level Security (RLS) enabled on all tables
- User-specific data access policies
- Admin-only analytics access
- Secure authentication flow

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd project

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

The database migrations have been applied automatically. The schema includes:
- User profiles with role-based access
- Health records with comprehensive metrics
- Prediction results with confidence scores
- Personalized recommendations
- Admin analytics

### 4. Edge Functions

Two Edge Functions are deployed:
- **predict-disease** - Generates disease risk predictions
- **generate-recommendations** - Creates personalized health plans

These are automatically configured and ready to use.

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## Usage Guide

### For Users

1. **Sign Up**: Create an account with email and password
2. **Complete Assessment**: Fill out the comprehensive health assessment form
3. **View Predictions**: See your disease risk predictions with confidence scores
4. **Get Recommendations**: Receive personalized fitness, diet, and lifestyle plans
5. **Track Progress**: Monitor your health assessments over time

### For Admins

1. **Access Admin Panel**: Navigate to `/admin` (requires admin role)
2. **View Analytics**: See system-wide metrics and insights
3. **Monitor Risk Distribution**: Track user risk levels
4. **Analyze Trends**: Review disease prediction patterns

## Health Assessment Form

### Basic Information
- Age, Gender, Height, Weight (BMI auto-calculated)

### Vital Signs
- Blood Pressure (Systolic/Diastolic)
- Heart Rate
- Glucose Level
- Total Cholesterol
- HDL/LDL Cholesterol (optional)

### Lifestyle Factors
- Physical Activity Level
- Sleep Hours
- Dietary Habits
- Stress Score (1-10)
- Smoking Status
- Alcohol Consumption

### Family History
- Diabetes
- Heart Disease
- Hypertension

## Prediction Models

### Algorithm Overview
The prediction models use multi-factor risk assessment:

1. **Risk Factor Analysis**: Evaluate each health metric against clinical thresholds
2. **Weight Assignment**: Apply evidence-based weights to risk factors
3. **Confidence Scoring**: Calculate prediction confidence based on data completeness
4. **Overall Risk Level**: Aggregate individual disease risks

### Risk Levels
- **Low Risk** (0-25%): Maintain healthy lifestyle
- **Moderate Risk** (25-50%): Consider lifestyle improvements
- **High Risk** (50-75%): Consult healthcare professionals
- **Very High Risk** (75-100%): Seek immediate medical attention

## API Documentation

### Predict Disease Endpoint
```
POST /functions/v1/predict-disease
Authorization: Bearer <token>
Content-Type: application/json

{
  "healthRecordId": "uuid"
}

Response:
{
  "prediction": {
    "id": "uuid",
    "diabetes_risk": 45.5,
    "diabetes_confidence": 85.0,
    "heart_disease_risk": 32.0,
    "heart_disease_confidence": 82.0,
    "hypertension_risk": 55.0,
    "hypertension_confidence": 88.0,
    "obesity_risk": 60.0,
    "obesity_confidence": 95.0,
    "overall_risk_level": "moderate"
  }
}
```

### Generate Recommendations Endpoint
```
POST /functions/v1/generate-recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "predictionId": "uuid"
}

Response:
{
  "recommendation": {
    "fitness_plan": {...},
    "diet_plan": {...},
    "sleep_optimization": {...},
    "stress_management": {...},
    "weekly_schedule": {...},
    "priority_actions": [...]
  }
}
```

## Design System

### Color Palette
- **Primary**: Blue gradient (600-700)
- **Secondary**: Emerald gradient (600-700)
- **Success**: Green (100-800)
- **Warning**: Yellow/Orange (100-800)
- **Danger**: Red (100-800)
- **Info**: Blue (100-800)

### Components
- Glass morphism effects
- Smooth transitions and animations
- Responsive design (mobile-first)
- Accessible form controls
- Loading states and error handling

### Typography
- System font stack
- Consistent sizing scale
- Proper hierarchy
- Readable line heights

## Security Best Practices

- Email/password authentication
- JWT-based session management
- Row Level Security (RLS)
- Data encryption at rest
- HTTPS-only communication
- CORS protection on Edge Functions
- Input validation and sanitization

## Performance Optimization

- Code splitting
- Lazy loading
- Optimized images
- Minimal bundle size
- Fast build times with Vite
- Edge function caching

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and build
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Contact support team
- Check documentation

## Future Enhancements

- Export health reports to PDF
- Integration with wearable devices
- Advanced data visualization
- Multi-language support
- Mobile app versions
- Telemedicine integration
- Machine learning model improvements

---

**Built with React, TypeScript, Supabase, and Machine Learning**