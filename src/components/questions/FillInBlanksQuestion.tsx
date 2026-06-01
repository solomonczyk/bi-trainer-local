import { useState } from 'react';
import type { Question } from '../../types/question';

interface FillInBlanksQuestionProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
  disabled?: boolean;
}

export default function FillInBlanksQuestion({
  question,
  onAnswer,
  disabled,
}: FillInBlanksQuestionProps) {
  const blanks = question.data.blanks as { placeholder: string; options?: string[] }[] | undefined;
  const template = question.data.template as string | undefined;

  if (!blanks || !template) return <p className="text-error">Ошибка: нет данных для заполнения</p>;

  const [answers, setAnswers] = useState<string[]>(new Array(blanks.length).fill(''));
  const [mode] = useState<'input' | 'select'>(
    blanks[0]?.options ? 'select' : 'input'
  );

  const setAnswer = (idx: number, value: string) => {
    const next = [...answers];
    next[idx] = value;
    setAnswers(next);
  };

  const renderTemplate = () => {
    const parts = template.split(/(\{blank\d+\})/);
    return parts.map((part, idx) => {
      const match = part.match(/^\{blank(\d+)\}$/);
      if (match) {
        const blankIdx = parseInt(match[1]) - 1;
        if (mode === 'select' && blanks[blankIdx]?.options) {
          return (
            <select
              key={idx}
              value={answers[blankIdx]}
              onChange={(e) => setAnswer(blankIdx, e.target.value)}
              disabled={disabled}
              className="bg-bg-elevated border border-border rounded-lg px-2 py-1 text-primary mx-1 disabled:opacity-60"
            >
              <option value="">...</option>
              {blanks[blankIdx].options!.map((opt, oi) => (
                <option key={oi} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        }
        return (
          <input
            key={idx}
            value={answers[blankIdx]}
            onChange={(e) => setAnswer(blankIdx, e.target.value)}
            disabled={disabled}
            placeholder={blanks[blankIdx]?.placeholder || '___'}
            className="inline-block bg-bg-elevated border border-border rounded-lg px-2 py-1 text-primary mx-1 w-32 text-center disabled:opacity-60 placeholder:text-text-muted"
          />
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-xl bg-bg-surface border border-border text-text-primary text-sm leading-loose">
        {renderTemplate()}
      </div>
      <button
        onClick={() => onAnswer(answers)}
        disabled={answers.some((a) => !a) || disabled}
        className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        Ответить
      </button>
    </div>
  );
}
