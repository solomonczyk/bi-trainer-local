import { useState } from 'react';
import type { Question } from '../../types/question';

interface MatchingQuestionProps {
  question: Question;
  onAnswer: (answer: Record<string, string>) => void;
  disabled?: boolean;
}

export default function MatchingQuestion({
  question,
  onAnswer,
  disabled,
}: MatchingQuestionProps) {
  const pairs = question.data.pairs as { left: string; right: string }[] | undefined;
  if (!pairs) return <p className="text-error">Ошибка: нет пар для сопоставления</p>;

  const [matches, setMatches] = useState<Record<string, string>>({});

  const leftItems = pairs.map((p) => p.left);
  const rightItems = [...pairs.map((p) => p.right)].sort(() => Math.random() - 0.5);

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm">Сопоставьте элементы из левого столбца с правым:</p>
      <div className="space-y-3">
        {leftItems.map((left, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="flex-1 p-3 rounded-lg bg-bg-surface border border-border text-text-primary text-sm">
              {left}
            </div>
            <select
              value={matches[left] || ''}
              onChange={(e) => setMatches((prev) => ({ ...prev, [left]: e.target.value }))}
              disabled={disabled}
              className="flex-1 p-3 rounded-lg bg-bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-primary disabled:opacity-60"
            >
              <option value="">—</option>
              {rightItems.map((right, ri) => (
                <option key={ri} value={right} disabled={Object.values(matches).includes(right) && matches[left] !== right}>
                  {right}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => onAnswer(matches)}
        disabled={Object.keys(matches).length < leftItems.length || disabled}
        className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 disabled:opacity-40 active:scale-[0.98]"
      >
        Ответить
      </button>
    </div>
  );
}
