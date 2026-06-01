import { Link } from 'react-router-dom';
import type { Module } from '../types/question';
import ProgressRing from './ProgressRing';
import * as Icons from 'lucide-react';

const iconMap: Record<string, string> = {
  'clipboard-check': 'ClipboardCheck',
  users: 'Users',
  'book-open': 'BookOpen',
  search: 'Search',
  'file-text': 'FileText',
  'git-branch': 'GitBranch',
  'layout-dashboard': 'LayoutDashboard',
  'bar-chart-3': 'BarChart3',
  'message-circle': 'MessageCircle',
  terminal: 'Terminal',
  briefcase: 'Briefcase',
  'graduation-cap': 'GraduationCap',
};

interface ModuleCardProps {
  mod: Module;
  progress: number;
  isDiagnostics?: boolean;
}

export default function ModuleCard({ mod, progress, isDiagnostics }: ModuleCardProps) {
  const iconName = iconMap[mod.icon] || 'BookOpen';
  const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number }>>)[iconName];

  const content = (
    <div
      className={`bg-bg-surface rounded-xl border border-border p-5 hover:border-primary/30 hover:bg-bg-hover transition-all duration-300 cursor-pointer group ${
        progress === 100 ? 'border-success/20' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {IconComponent && <IconComponent size={20} className="text-primary" />}
        </div>
        <ProgressRing progress={progress} size={56} strokeWidth={5} />
      </div>
      <h3 className="text-text-primary font-semibold text-base mb-1">{mod.title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{mod.description}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-text-muted">{mod.questionCount} вопросов</span>
        {isDiagnostics && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">
            Определение уровня
          </span>
        )}
      </div>
    </div>
  );

  if (isDiagnostics) {
    return <Link to="/diagnostics">{content}</Link>;
  }

  return <Link to={`/modules/${mod.id}`}>{content}</Link>;
}
