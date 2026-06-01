import { useState } from 'react';
import type { Question } from '../../types/question';

interface LikertScaleQuestionProps {
  question: Question;
  onAnswer: (answer: number) => void;
  disabled?: boolean;
}

const scales = [
  { value: 1, label: 'Совершенно не уверен' },
  { value: 2, label: 'Скорее не уверен' },
  { value: 3, label: 'Затрудняюсь ответить' },
  { value: 4, label: 'Скорее уверен' },
  { value: 5, label: 'Полностью уверен' },
];

export default function LikertScaleQuestion({
  question,
  onAnswer,
  disabled,
}: LikertScaleQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {question.description && (
        <p className="text-text-secondary text-sm">{question.description}</p>
      )}
      <div className="flex gap-2 justify-center">
        {scales.map((scale) => (
          <button
            key={scale.value}
            onClick={() => {
              setSelected(scale.value);
              onAnswer(scale.value);
            }}
            disabled={disabled}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              selected === scale.value
                ? 'border-primary bg-primary/10'
                : 'border-border bg-bg-surface hover:border-border-light'
            } ${disabled ? 'opacity-60' : ''}`}
          >
            <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              selected === scale.value
                ? 'bg-primary text-white'
                : 'bg-bg-elevated text-text-secondary'
            }`}>
              {scale.value}
            </span>
            <span className="text-xs text-text-secondary text-center max-w-[80px]">
              {scale.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
