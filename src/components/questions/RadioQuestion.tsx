import { useState } from 'react';
import type { Question } from '../../types/question';

interface RadioQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export default function RadioQuestion({
  question,
  onAnswer,
  disabled,
}: RadioQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const options = question.data.options as string[] | undefined;

  if (!options) return <p className="text-error">Ошибка: нет вариантов ответа</p>;

  const handleSubmit = () => {
    if (selected) onAnswer(selected);
  };

  return (
    <div className="space-y-3">
      {options.map((option, idx) => (
        <label
          key={idx}
          onClick={() => setSelected(option)}
          className={`block p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
            selected === option
              ? 'border-primary bg-primary/5'
              : 'border-border bg-bg-surface hover:border-border-light hover:bg-bg-hover'
          } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selected === option
                  ? 'border-primary'
                  : 'border-text-muted'
              }`}
            >
              {selected === option && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
            <span className="text-text-primary text-sm">{option}</span>
          </div>
        </label>
      ))}
      <button
        onClick={handleSubmit}
        disabled={!selected || disabled}
        className="w-full mt-4 py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        Ответить
      </button>
    </div>
  );
}
