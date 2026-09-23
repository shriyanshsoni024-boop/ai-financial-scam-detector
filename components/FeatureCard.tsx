import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export default function FeatureCard({ icon: Icon, title, description, badge }: FeatureCardProps) {
  return (
    <div className="p-6 bg-[#111111] border border-[#292929] flex flex-col justify-between space-y-4 font-mono">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 bg-[#0a0a0a] border border-[#292929] flex items-center justify-center text-[#b6ff00]">
            <Icon className="w-4 h-4" />
          </div>
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#0a0a0a] text-[#888888] border border-[#292929]">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#f2f2f2]">
          {title}
        </h3>
        <p className="text-xs text-[#888888] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
