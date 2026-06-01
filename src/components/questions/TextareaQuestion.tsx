import { useState } from 'react';
import type { Question } from '../../types/question';
import { evaluateKeywords } from '../../lib/keywordMatcher';

interface TextareaQuestionProps {
  question: Question;
  onAnswer: (answer: { text: string; keywordResult: ReturnType<typeof evaluateKeywords> }) => void;
  disabled?: boolean;
}

export default function TextareaQuestion({
  question,
  onAnswer,
  disabled,
}: TextareaQuestionProps) {
  const [text, setText] = useState('');
  const maxLength = 2000;

  const keywordConfig = question.data.keywords
    ? {
        keywords: question.data.keywords as string[],
        minMatch: (question.data.minMatch as number) ?? 3,
        level: question.level,
      }
    : null;

  const handleSubmit = () => {
    if (!text.trim()) return;
    const keywordResult = keywordConfig
      ? evaluateKeywords(text, keywordConfig)
      : { matched: 0, total: 0, passed: true, structureOk: true };
    onAnswer({ text: text.trim(), keywordResult });
  };

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxLength))}
        disabled={disabled}
        placeholder="Введите ваш ответ..."
        className="w-full h-40 p-4 rounded-xl bg-bg-surface border border-border text-text-primary text-sm resize-none focus:outline-none focus:border-primary transition-colors disabled:opacity-60 placeholder:text-text-muted"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">
          {text.length}/{maxLength}
        </span>
        {keywordConfig && (
          <span className="text-xs text-text-muted">
            Ключевых слов: минимум {keywordConfig.minMatch} из {keywordConfig.keywords.length}
          </span>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || disabled}
        className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        Ответить
      </button>
    </div>
  );
}
