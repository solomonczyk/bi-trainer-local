import { useState } from 'react';
import type { Question } from '../../types/question';

interface NumberInputQuestionProps {
  question: Question;
  onAnswer: (answer: number) => void;
  disabled?: boolean;
}

export default function NumberInputQuestion({
  question,
  onAnswer,
  disabled,
}: NumberInputQuestionProps) {
  const [value, setValue] = useState<string>('');

  const handleSubmit = () => {
    const num = Number(value);
    if (!isNaN(num)) onAnswer(num);
  };

  return (
    <div className="space-y-3">
      {question.description && (
        <p className="text-text-secondary text-sm mb-2">{question.description}</p>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Введите число..."
        className="w-full p-4 rounded-xl bg-bg-surface border border-border text-text-primary text-lg font-mono focus:outline-none focus:border-primary transition-colors disabled:opacity-60 placeholder:text-text-muted"
      />
      <button
        onClick={handleSubmit}
        disabled={value === '' || disabled}
        className="w-full mt-4 py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        Ответить
      </button>
    </div>
  );
}
