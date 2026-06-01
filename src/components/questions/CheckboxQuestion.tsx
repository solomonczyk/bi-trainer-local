import { useState } from 'react';
import type { Question } from '../../types/question';

interface CheckboxQuestionProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
  disabled?: boolean;
}

export default function CheckboxQuestion({
  question,
  onAnswer,
  disabled,
}: CheckboxQuestionProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const options = question.data.options as string[] | undefined;

  if (!options) return <p className="text-error">Ошибка: нет вариантов ответа</p>;

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-text-secondary text-sm mb-2">Выберите все подходящие варианты:</p>
      {options.map((option, idx) => (
        <label
          key={idx}
          className={`block p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
            selected.includes(option)
              ? 'border-primary bg-primary/5'
              : 'border-border bg-bg-surface hover:border-border-light hover:bg-bg-hover'
          } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                selected.includes(option)
                  ? 'border-primary bg-primary'
                  : 'border-text-muted'
              }`}
            >
              {selected.includes(option) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-text-primary text-sm">{option}</span>
          </div>
        </label>
      ))}
      <button
        onClick={() => onAnswer(selected)}
        disabled={selected.length === 0 || disabled}
        className="w-full mt-4 py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        Ответить ({selected.length})
      </button>
    </div>
  );
}
