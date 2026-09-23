import { RiskLevel } from '@/types/scam';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function RiskBadge({ level, size = 'md', showIcon = true }: RiskBadgeProps) {
  const config = {
    LOW_CONCERN: {
      label: 'Low Concern',
      bgColor: 'bg-[#0f1f0a]',
      borderColor: 'border-[#b6ff00]/40',
      textColor: 'text-[#b6ff00]',
      dotColor: 'bg-[#b6ff00]',
      icon: ShieldCheck
    },
    NEEDS_CAUTION: {
      label: 'Needs Caution',
      bgColor: 'bg-[#241705]',
      borderColor: 'border-amber-500/40',
      textColor: 'text-amber-400',
      dotColor: 'bg-amber-400',
      icon: AlertTriangle
    },
    HIGH_RISK: {
      label: 'High Risk',
      bgColor: 'bg-[#240a0a]',
      borderColor: 'border-red-500/40',
      textColor: 'text-red-400',
      dotColor: 'bg-red-400',
      icon: ShieldAlert
    }
  };

  const current = config[level];
  const IconComponent = current.icon;

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px] gap-1.5 font-medium rounded-full',
    md: 'px-3 py-1 text-xs gap-2 font-medium rounded-full',
    lg: 'px-4 py-1.5 text-sm gap-2 font-semibold rounded-full'
  };

  return (
    <div
      className={`inline-flex items-center border ${current.bgColor} ${current.borderColor} ${current.textColor} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor} shrink-0`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{current.label}</span>
    </div>
  );
}
