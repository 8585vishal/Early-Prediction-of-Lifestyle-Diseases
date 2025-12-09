import { Card, CardHeader, CardContent } from './ui/Card';
import { Recommendation } from '../lib/supabase';
import { Dumbbell, Apple, Moon, Brain, Calendar, AlertCircle } from 'lucide-react';

interface RecommendationsDisplayProps {
  recommendation: Recommendation;
}

export function RecommendationsDisplay({ recommendation }: RecommendationsDisplayProps) {
  return (
    <div className="space-y-6">
      <Card variant="gradient">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Priority Actions</h3>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendation.priority_actions.map((action, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Dumbbell className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Fitness Plan</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Recommended Exercises
                </h4>
                <div className="space-y-2">
                  {recommendation.fitness_plan.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">{exercise.name}</p>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span>{exercise.duration}</span>
                        <span>{exercise.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Goals</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {recommendation.fitness_plan.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Apple className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Diet Plan</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendation.diet_plan.meals.map((meal, index) => (
                <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {meal.type}
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {meal.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Guidelines</h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {recommendation.diet_plan.guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Moon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sleep Optimization
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Target Sleep Hours</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {recommendation.sleep_optimization.target_hours}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">hours per night</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tips</h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {recommendation.sleep_optimization.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Stress Management
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Techniques</h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {recommendation.stress_management.techniques.map((technique, index) => (
                    <li
                      key={index}
                      className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded"
                    >
                      {technique}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Daily Practices
                </h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {recommendation.stress_management.daily_practices.map((practice, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Weekly Schedule
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendation.weekly_schedule.days.map((day, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{day.day}</h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {day.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}