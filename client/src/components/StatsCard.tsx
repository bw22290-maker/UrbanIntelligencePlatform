import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
}

export function StatsCard({ title, value, change, changeType, icon: Icon, iconColor }: StatsCardProps) {
  const changeColorClass = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-gray-500"
  }[changeType];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${iconColor} p-3 rounded-lg`}>
          <Icon className="text-xl" size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${changeColorClass}`}>{change}</span>
        <span className="text-gray-600 ml-2">from last month</span>
      </div>
    </div>
  );
}
