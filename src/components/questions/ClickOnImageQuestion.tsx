import { useState } from 'react';
import type { Question } from '../../types/question';

interface ClickOnImageQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export default function ClickOnImageQuestion({
  question,
  onAnswer,
  disabled,
}: ClickOnImageQuestionProps) {
  const zones = question.data.zones as { id: string; label: string; x: number; y: number; width: number; height: number }[] | undefined;
  const imageUrl = question.data.imageUrl as string | undefined;
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  if (!zones || !imageUrl) {
    return (
      <div className="p-6 rounded-xl bg-bg-surface border border-border text-center">
        <p className="text-text-secondary text-sm">
          {question.data.placeholder as string || 'Схема будет добавлена позже'}
        </p>
        {!disabled && (
          <textarea
            className="w-full mt-3 p-3 rounded-lg bg-bg-surface border border-border text-text-primary text-sm"
            placeholder="Опишите, что отсутствует на схеме..."
            rows={3}
            onBlur={(e) => e.target.value && onAnswer(e.target.value)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm">
        Нажмите на элемент схемы, который отсутствует или содержит ошибку:
      </p>
      <div className="relative inline-block rounded-xl overflow-hidden border border-border">
        <img src={imageUrl} alt="Схема" className="max-w-full" />
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => {
              setSelectedZone(zone.id);
              onAnswer(zone.label);
            }}
            disabled={disabled}
            className={`absolute border-2 rounded-lg transition-all ${
              selectedZone === zone.id
                ? 'border-primary bg-primary/20'
                : 'border-transparent hover:border-primary/50 hover:bg-primary/5'
            }`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
            }}
            title={zone.label}
          />
        ))}
      </div>
      {selectedZone && (
        <p className="text-primary text-sm">Выбрано: {zones.find((z) => z.id === selectedZone)?.label}</p>
      )}
    </div>
  );
}
