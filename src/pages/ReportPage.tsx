import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Award, Target, TrendingUp } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import modules from '../data/modules.json';

export default function ReportPage() {
  const answers = useProgressStore((s) => s.answers);
  const diagnosticsResult = useProgressStore((s) => s.diagnosticsResult);
  const examResult = useProgressStore((s) => s.examResult);
  const xp = useProgressStore((s) => s.xp);

  const totalAnswered = Object.values(answers).filter((a) => a.status !== 'pending').length;
  const totalCorrect = Object.values(answers).filter((a) => a.status === 'correct').length;
  const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const getModuleProgress = (moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return { answered: 0, correct: 0, pct: 0 };
    const modAnswers = Object.entries(answers).filter(
      ([id, a]) => id.startsWith(moduleId) && a.status !== 'pending'
    );
    const correct = modAnswers.filter(([, a]) => a.status === 'correct').length;
    return {
      answered: modAnswers.length,
      correct,
      pct: modAnswers.length > 0 ? Math.round((correct / modAnswers.length) * 100) : 0,
    };
  };

  const weakModules = modules
    .filter((m) => m.id !== 'module-0')
    .map((m) => ({ ...m, ...getModuleProgress(m.id) }))
    .filter((m) => m.pct < 70 && m.answered > 0)
    .sort((a, b) => a.pct - b.pct);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">На главную</span>
      </Link>

      <h1 className="text-2xl font-bold text-text-primary">Отчёт о прогрессе</h1>

      {/* Overall stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Всего ответов', value: totalAnswered, icon: BarChart3, color: 'text-primary' },
          { label: 'Правильных', value: totalCorrect, icon: Target, color: 'text-success' },
          { label: 'Точность', value: `${overallPct}%`, icon: TrendingUp, color: 'text-secondary' },
          { label: 'XP', value: xp, icon: Award, color: 'text-warning' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-bg-surface rounded-xl border border-border p-4 text-center">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-xs text-text-secondary mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Diagnostics result */}
      {diagnosticsResult && (
        <div className="p-4 rounded-xl bg-bg-surface border border-border">
          <h3 className="font-semibold text-text-primary mb-2">Результат диагностики</h3>
          <p className="text-text-secondary">
            Уровень: <span className="text-primary font-bold text-lg">{diagnosticsResult.level}</span>
          </p>
        </div>
      )}

      {/* Exam result */}
      {examResult && (
        <div className="p-4 rounded-xl bg-bg-surface border border-border">
          <h3 className="font-semibold text-text-primary mb-2">Финальный экзамен</h3>
          <p className="text-text-secondary">
            Результат:{' '}
            <span className="text-primary font-bold text-lg">
              {Math.round((examResult.score / examResult.total) * 100)}%
            </span>{' '}
            ({examResult.score}/{examResult.total})
          </p>
        </div>
      )}

      {/* Module breakdown */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Прогресс по модулям</h2>
        <div className="space-y-3">
          {modules
            .filter((m) => m.id !== 'module-0')
            .map((mod) => {
              const { answered, pct } = getModuleProgress(mod.id);
              return (
                <div key={mod.id} className="p-4 rounded-xl bg-bg-surface border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary font-medium text-sm">{mod.title}</span>
                    <span className="text-text-muted text-xs">
                      {answered}/{mod.questionCount}
                    </span>
                  </div>
                  <div className="w-full bg-bg-elevated rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-600 ${
                        pct >= 80
                          ? 'bg-success'
                          : pct >= 50
                          ? 'bg-warning'
                          : 'bg-error'
                      }`}
                      style={{ width: `${answered > 0 ? pct : 0}%` }}
                    />
                  </div>
                  {answered > 0 && (
                    <span className="text-xs text-text-muted mt-1 block">{pct}% правильных</span>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      {/* Weak spots */}
      {weakModules.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Слабые места</h2>
          <div className="space-y-2">
            {weakModules.slice(0, 3).map((mod) => (
              <Link
                key={mod.id}
                to={`/modules/${mod.id}`}
                className="block p-4 rounded-xl bg-error/5 border border-error/20 hover:bg-error/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-text-primary font-medium">{mod.title}</span>
                  <span className="text-error font-semibold">{mod.pct}%</span>
                </div>
                <p className="text-text-muted text-sm mt-1">Рекомендуем повторить этот модуль</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {totalAnswered === 0 && (
        <div className="text-center py-12 text-text-muted">
          Пока нет данных. Начните отвечать на вопросы!
        </div>
      )}
    </div>
  );
}
