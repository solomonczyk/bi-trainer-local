import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import modules from '../data/modules.json';
import { useProgressStore } from '../store/useProgressStore';

// Импортируем вопросы (будут загружены из JSON в Phase 6)
import questionsData from '../data/questions.json';

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const answers = useProgressStore((s) => s.answers);

  const mod = modules.find((m) => m.id === moduleId);
  const moduleQuestions = (questionsData as any[]).filter((q) => q.moduleId === moduleId);

  const getQuestionStatus = (qId: string) => {
    const a = answers[qId];
    if (!a || a.status === 'pending') return 'pending';
    return a.status;
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircle size={16} className="text-success flex-shrink-0" />;
      case 'incorrect':
        return <AlertCircle size={16} className="text-error flex-shrink-0" />;
      case 'partial':
        return <AlertCircle size={16} className="text-warning flex-shrink-0" />;
      default:
        return <Circle size={16} className="text-text-muted flex-shrink-0" />;
    }
  };

  const sorted = [...moduleQuestions].sort((a, b) => a.order - b.order);

  if (!mod) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Модуль не найден</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">На главную</span>
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-text-primary">{mod.title}</h1>
        <p className="text-text-secondary mt-1">{mod.description}</p>
      </div>

      <div className="space-y-2">
        {sorted.map((q) => {
          const status = getQuestionStatus(q.id);
          return (
            <Link
              key={q.id}
              to={`/modules/${moduleId}/${q.id}`}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                status !== 'pending'
                  ? 'border-border-light bg-bg-surface'
                  : 'border-border bg-bg-surface hover:border-border-light hover:bg-bg-hover'
              }`}
            >
              {statusIcon(status)}
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm truncate">{q.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-bg-elevated text-text-muted">
                    {q.level}
                  </span>
                  <span className="text-xs text-text-muted">{q.type}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
