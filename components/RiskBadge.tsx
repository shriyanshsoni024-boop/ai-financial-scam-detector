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
      label: 'LOW CONCERN',
      bgColor: 'bg-[#111111]',
      borderColor: 'border-[#b6ff00]',
      textColor: 'text-[#b6ff00]',
      dotColor: 'bg-[#b6ff00]',
      icon: ShieldCheck
    },
    NEEDS_CAUTION: {
      label: 'NEEDS CAUTION',
      bgColor: 'bg-[#111111]',
      borderColor: 'border-amber-500/80',
      textColor: 'text-amber-400',
      dotColor: 'bg-amber-400',
      icon: AlertTriangle
    },
    HIGH_RISK: {
      label: 'HIGH RISK',
      bgColor: 'bg-[#111111]',
      borderColor: 'border-red-500/80',
      textColor: 'text-red-400',
      dotColor: 'bg-red-400',
      icon: ShieldAlert
    }
  };

  const current = config[level];
  const IconComponent = current.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1.5 font-mono tracking-widest',
    md: 'px-3 py-1 text-xs gap-2 font-mono tracking-widest',
    lg: 'px-4 py-1.5 text-xs sm:text-sm gap-2 font-mono font-bold tracking-widest'
  };

  return (
    <div
      className={`inline-flex items-center border ${current.bgColor} ${current.borderColor} ${current.textColor} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 ${current.dotColor} shrink-0`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span className="font-bold">{current.label}</span>
    </div>
  );
}
