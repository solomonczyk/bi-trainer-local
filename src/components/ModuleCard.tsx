import { Link } from 'react-router-dom';
import type { Module } from '../types/question';
import ProgressRing from './ProgressRing';
import {
  ClipboardCheck, Users, BookOpen, Search, FileText, GitBranch,
  LayoutDashboard, BarChart3, MessageCircle, Terminal, Briefcase, GraduationCap,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'clipboard-check': <ClipboardCheck size={20} className="text-primary" />,
  users: <Users size={20} className="text-primary" />,
  'book-open': <BookOpen size={20} className="text-primary" />,
  search: <Search size={20} className="text-primary" />,
  'file-text': <FileText size={20} className="text-primary" />,
  'git-branch': <GitBranch size={20} className="text-primary" />,
  'layout-dashboard': <LayoutDashboard size={20} className="text-primary" />,
  'bar-chart-3': <BarChart3 size={20} className="text-primary" />,
  'message-circle': <MessageCircle size={20} className="text-primary" />,
  terminal: <Terminal size={20} className="text-primary" />,
  briefcase: <Briefcase size={20} className="text-primary" />,
  'graduation-cap': <GraduationCap size={20} className="text-primary" />,
};

interface ModuleCardProps {
  mod: Module;
  progress: number;
  isDiagnostics?: boolean;
}

export default function ModuleCard({ mod, progress, isDiagnostics }: ModuleCardProps) {
  const content = (
    <div
      className={`corner-sweep bg-bg-surface rounded-xl border border-border p-5 hover:border-border-light hover:bg-bg-hover transition-all duration-300 cursor-pointer group ${
        progress === 100 ? 'border-success/20' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {iconMap[mod.icon] || <BookOpen size={20} className="text-primary" />}
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
