import { Link } from 'react-router-dom';
import type { Module } from '../types/question';
import rawModules from '../data/modules.json';
const modules = rawModules as Module[];
import ModuleCard from '../components/ModuleCard';
import { useProgressStore } from '../store/useProgressStore';
import { ArrowRight, Award, Zap, Target } from 'lucide-react';

export default function DashboardPage() {
  const diagnosticsResult = useProgressStore((s) => s.diagnosticsResult);
  const xp = useProgressStore((s) => s.xp);
  const answers = useProgressStore((s) => s.answers);

  const getModuleProgress = (moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return 0;
    const answered = Object.keys(answers).filter(
      (id) => id.startsWith(moduleId) && answers[id].status !== 'pending'
    ).length;
    return Math.round((answered / mod.questionCount) * 100);
  };

  const exerciseModules = modules.filter((m) => m.id !== 'module-0' && m.id !== 'module-11');
  const totalAnswered = Object.values(answers).filter((a) => a.status !== 'pending').length;
  const totalCorrect = Object.values(answers).filter((a) => a.status === 'correct').length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          BA Interview Trainer
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Подготовка к собеседованию на бизнес-аналитика. 12 модулей, 250+ заданий, 3 уровня сложности.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Всего ответов', value: totalAnswered, icon: Award, color: 'text-primary' },
          { label: 'Правильных', value: totalCorrect, icon: Target, color: 'text-success' },
          { label: 'XP', value: `${xp}`, icon: Zap, color: 'text-warning' },
          {
            label: 'Уровень',
            value: diagnosticsResult?.level || '—',
            icon: Target,
            color: 'text-secondary',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="corner-sweep bg-bg-surface rounded-xl border border-border p-5 text-center"
          >
            <Icon size={24} className={`${color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-text-primary leading-tight">{value}</p>
            <p className="text-xs text-text-secondary mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Diagnostics CTA */}
      {!diagnosticsResult && (
        <Link
          to="/diagnostics"
          className="corner-sweep block p-5 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-primary">
                Пройти входную диагностику
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Определите свой уровень и получите рекомендации
              </p>
            </div>
            <ArrowRight
              size={20}
              className="text-primary group-hover:translate-x-1 transition-transform"
            />
          </div>
        </Link>
      )}

      {/* Module grid */}
      <section>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Модули</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          <ModuleCard
            mod={modules[0]}
            progress={getModuleProgress('module-0')}
            isDiagnostics
          />
          {exerciseModules.map((mod) => (
            <ModuleCard key={mod.id} mod={mod} progress={getModuleProgress(mod.id)} />
          ))}
        </div>
      </section>

      {/* Final exam CTA */}
      <Link to="/exam" className="corner-sweep block p-6 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 hover:border-primary/40 transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/exam-btn.png" alt="" className="w-12 h-12" />
            <div className="text-left">
              <h3 className="font-semibold text-text-primary">Финальный экзамен</h3>
              <p className="text-sm text-text-secondary mt-0.5">25 вопросов с таймером. Проверьте свои знания!</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </div>
      </Link>
    </div>
  );
}
