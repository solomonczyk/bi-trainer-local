import { useState, useCallback } from 'react';
import type { Question } from '../../types/question';

interface InteractiveBoardProps {
  question: Question;
  onAnswer: (answer: Record<string, string[]>) => void;
  disabled?: boolean;
}

const boardZones = {
  moscow: { label: 'Must have', color: 'border-success/30 bg-success/5' },
  should: { label: 'Should have', color: 'border-primary/30 bg-primary/5' },
  could: { label: 'Could have', color: 'border-warning/30 bg-warning/5' },
  wont: { label: "Won't have", color: 'border-error/30 bg-error/5' },
};

export default function InteractiveBoard({
  question,
  onAnswer,
  disabled,
}: InteractiveBoardProps) {
  const items = question.data.items as string[] | undefined;
  if (!items) return <p className="text-error">Ошибка: нет элементов</p>;

  const [zones, setZones] = useState<Record<string, string[]>>({
    moscow: [],
    should: [],
    could: [],
    wont: [],
  });

  const moveToZone = useCallback((item: string, zone: string) => {
    setZones((prev) => {
      const next: Record<string, string[]> = { moscow: [], should: [], could: [], wont: [] };
      Object.keys(next).forEach((z) => {
        next[z] = z === zone
          ? [...prev[z].filter((i) => i !== item), item]
          : prev[z].filter((i) => i !== item);
      });
      return next;
    });
  }, []);

  const unassigned = items.filter((item) => !Object.values(zones).flat().includes(item));

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm">
        Распределите требования по категориям MoSCoW:
      </p>

      {/* Unassigned items */}
      {unassigned.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-bg-surface border border-border">
          {unassigned.map((item, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-lg bg-bg-elevated text-text-primary text-sm border border-border">
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Zones */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(boardZones).map(([zone, config]) => (
          <div
            key={zone}
            className={`p-3 rounded-xl border ${config.color} min-h-[100px]`}
            onClick={() => {
              // If clicking on zone with unassigned items, move first unassigned here
              if (unassigned.length > 0) moveToZone(unassigned[0], zone);
            }}
          >
            <p className="text-xs font-medium text-text-secondary mb-2">{config.label}</p>
            <div className="space-y-1">
              {zones[zone].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2 py-1 rounded bg-bg-surface border border-border text-text-primary text-xs cursor-pointer hover:border-error/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Click to remove from zone (back to unassigned)
                    setZones((prev) => ({
                      ...prev,
                      [zone]: prev[zone].filter((i) => i !== item),
                    }));
                  }}
                >
                  {item}
                  <span className="text-text-muted ml-1">×</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onAnswer(zones)}
        disabled={unassigned.length > 0 || disabled}
        className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 disabled:opacity-40 active:scale-[0.98]"
      >
        {unassigned.length > 0
          ? `Распределите все элементы (осталось ${unassigned.length})`
          : 'Подтвердить'}
      </button>
    </div>
  );
}
