import { Card, CardHeader, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { RiskGauge } from './ui/RiskGauge';
import { CircularProgress } from './ui/CircularProgress';
import { Prediction } from '../lib/supabase';
import { Activity, Heart, Droplet, Weight, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface PredictionResultsProps {
  prediction: Prediction;
}

export function PredictionResults({ prediction }: PredictionResultsProps) {
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

  const getRiskMessage = (level: string) => {
    switch (level) {
      case 'low':
        return 'Your overall health indicators are good. Continue maintaining your healthy lifestyle.';
      case 'moderate':
        return 'Some risk factors detected. Consider making lifestyle improvements to reduce risk.';
      case 'high':
        return 'Multiple risk factors identified. Consult with healthcare professionals for guidance.';
      case 'very_high':
        return 'Significant health risks detected. Seek medical consultation as soon as possible.';
      default:
        return '';
    }
  };

  const diseaseCards = [
    {
      name: 'Diabetes',
      icon: Droplet,
      risk: prediction.diabetes_risk,
      confidence: prediction.diabetes_confidence,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Heart Disease',
      icon: Heart,
      risk: prediction.heart_disease_risk,
      confidence: prediction.heart_disease_confidence,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      name: 'Hypertension',
      icon: Activity,
      risk: prediction.hypertension_risk,
      confidence: prediction.hypertension_confidence,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      name: 'Obesity',
      icon: Weight,
      risk: prediction.obesity_risk,
      confidence: prediction.obesity_confidence,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <Card variant="gradient">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1 mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                {prediction.overall_risk_level === 'low' ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                )}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Overall Risk Assessment
                </h2>
              </div>
              <Badge variant={getRiskBadgeVariant(prediction.overall_risk_level)} size="lg">
                {prediction.overall_risk_level.replace('_', ' ').toUpperCase()} RISK
              </Badge>
              <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl">
                {getRiskMessage(prediction.overall_risk_level)}
              </p>
              <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>Model Version: {prediction.model_version}</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <CircularProgress
                value={Math.round(
                  (prediction.diabetes_risk +
                    prediction.heart_disease_risk +
                    prediction.hypertension_risk +
                    prediction.obesity_risk) /
                    4
                )}
                size={160}
                strokeWidth={12}
                label="Average Risk"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diseaseCards.map((disease) => (
          <Card key={disease.name} variant="glass" hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 ${disease.bgColor} rounded-xl`}>
                    <disease.icon className={`w-6 h-6 ${disease.textColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {disease.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {disease.risk}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Risk Score</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RiskGauge value={disease.risk} label="Risk Level" />
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Confidence Score
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {disease.confidence}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}