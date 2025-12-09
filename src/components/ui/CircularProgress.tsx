interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
}: CircularProgressProps) {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage <= 30) return '#10b981';
    if (percentage <= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}%</span>
        {label && <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</span>}
      </div>
    </div>
  );
}