import { CheckCircle, XCircle, AlertCircle, Award } from 'lucide-react';
import type { AnswerStatus } from '../types/question';

interface AnswerRevealProps {
  status: AnswerStatus;
  explanation: string;
  correctAnswer?: string;
  userAnswer?: string;
  xpEarned?: number;
  onNext?: () => void;
  hasNext: boolean;
}

export default function AnswerReveal({
  status,
  explanation,
  correctAnswer,
  userAnswer,
  xpEarned,
  onNext,
  hasNext,
}: AnswerRevealProps) {
  const isCorrect = status === 'correct';
  const isPartial = status === 'partial';

  return (
    <div className="animate-slide-up mt-6">
      {/* Status badge */}
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border mb-4 ${
          isCorrect
            ? 'bg-success/5 border-success/20 text-success'
            : isPartial
            ? 'bg-warning/5 border-warning/20 text-warning'
            : 'bg-error/5 border-error/20 text-error'
        }`}
      >
        {isCorrect ? (
          <CheckCircle size={24} />
        ) : isPartial ? (
          <AlertCircle size={24} />
        ) : (
          <XCircle size={24} />
        )}
        <div>
          <p className="font-semibold">
            {isCorrect ? 'Верно!' : isPartial ? 'Частично верно' : 'Неверно'}
          </p>
          {xpEarned !== undefined && (
            <p className="text-sm opacity-80">+{xpEarned} XP</p>
          )}
        </div>
        {xpEarned !== undefined && xpEarned > 0 && (
          <Award size={24} className="ml-auto" />
        )}
      </div>

      {/* Correct answer */}
      {correctAnswer && !isCorrect && (
        <div className="mb-4 p-4 rounded-xl bg-bg-elevated border border-border">
          <p className="text-text-secondary text-sm font-medium mb-1">Правильный ответ:</p>
          <p className="text-text-primary">{correctAnswer}</p>
        </div>
      )}

      {/* User answer */}
      {userAnswer && (
        <div className="mb-4 p-4 rounded-xl bg-bg-elevated border border-border">
          <p className="text-text-secondary text-sm font-medium mb-1">Ваш ответ:</p>
          <p className="text-text-primary">{userAnswer}</p>
        </div>
      )}

      {/* Explanation */}
      <div className="p-4 rounded-xl bg-bg-surface border border-border">
        <p className="text-text-secondary text-sm font-medium mb-2">Разбор ответа:</p>
        <div className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
          {explanation}
        </div>
      </div>

      {/* Next button */}
      {onNext && (
        <button
          onClick={onNext}
          className="mt-6 w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 active:scale-[0.98]"
        >
          {hasNext ? 'Следующий вопрос' : 'Завершить'}
        </button>
      )}
    </div>
  );
}
