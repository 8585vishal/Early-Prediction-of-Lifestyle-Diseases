interface RiskGaugeProps {
  value: number;
  label: string;
  max?: number;
}

export function RiskGauge({ value, label, max = 100 }: RiskGaugeProps) {
  const percentage = (value / max) * 100;

  const getColor = () => {
    if (percentage <= 30) return 'from-green-500 to-emerald-500';
    if (percentage <= 60) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  const getRiskLevel = () => {
    if (percentage <= 30) return 'Low Risk';
    if (percentage <= 60) return 'Moderate Risk';
    return 'High Risk';
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getRiskLevel()}</p>
    </div>
  );
}