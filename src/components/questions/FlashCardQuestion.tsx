import { useState } from 'react';
import type { Question } from '../../types/question';

interface FlashCardQuestionProps {
  question: Question;
  onAnswer: (answer: 'known' | 'unknown') => void;
  disabled?: boolean;
}

export default function FlashCardQuestion({
  question,
  onAnswer,
  disabled,
}: FlashCardQuestionProps) {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (result: 'known' | 'unknown') => {
    if (answered || disabled) return;
    setAnswered(true);
    onAnswer(result);
  };

  return (
    <div className="space-y-4">
      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => !answered && setFlipped(!flipped)}
        style={{ perspective: '1000px' }}
      >
        <div
          className="flashcard-inner relative w-full"
          style={{ minHeight: '280px' }}
        >
          {/* Front */}
          <div className="flashcard-front absolute inset-0 p-8 rounded-2xl bg-gradient-to-br from-bg-surface to-bg-elevated border border-border flex items-center justify-center cursor-pointer">
            <div className="text-center">
              <p className="text-text-secondary text-sm mb-4">Нажмите, чтобы увидеть ответ</p>
              <p className="text-text-primary text-lg leading-relaxed">{question.title}</p>
            </div>
          </div>
          {/* Back */}
          <div className="flashcard-back absolute inset-0 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 flex items-center justify-center">
            <p className="text-text-primary text-base leading-relaxed text-center whitespace-pre-wrap">
              {question.explanation}
            </p>
          </div>
        </div>
      </div>

      {flipped && !answered && (
        <div className="flex gap-3">
          <button
            onClick={() => handleAnswer('unknown')}
            disabled={disabled}
            className="flex-1 py-3 px-6 rounded-xl bg-error/10 border border-error/20 text-error hover:bg-error/20 font-medium transition-all duration-200 disabled:opacity-40"
          >
            Не знаю
          </button>
          <button
            onClick={() => handleAnswer('known')}
            disabled={disabled}
            className="flex-1 py-3 px-6 rounded-xl bg-success/10 border border-success/20 text-success hover:bg-success/20 font-medium transition-all duration-200 disabled:opacity-40"
          >
            Знаю
          </button>
        </div>
      )}
    </div>
  );
}
