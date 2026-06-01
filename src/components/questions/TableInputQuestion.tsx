import { useState } from 'react';
import type { Question } from '../../types/question';

interface TableInputQuestionProps {
  question: Question;
  onAnswer: (answer: Record<string, string>[]) => void;
  disabled?: boolean;
}

export default function TableInputQuestion({
  question,
  onAnswer,
  disabled,
}: TableInputQuestionProps) {
  const columns = question.data.columns as { key: string; label: string; type?: 'text' | 'number' }[] | undefined;
  const rows = question.data.rows as string[] | undefined;

  if (!columns || !rows) return <p className="text-error">Ошибка: нет данных таблицы</p>;

  const [values, setValues] = useState<Record<string, string>[]>(
    rows.map(() => ({}))
  );

  const setValue = (rowIdx: number, colKey: string, value: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[rowIdx] = { ...next[rowIdx], [colKey]: value };
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm">Заполните таблицу:</p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-surface">
              <th className="p-3 text-left text-text-secondary font-medium border-b border-border">#</th>
              {columns.map((col) => (
                <th key={col.key} className="p-3 text-left text-text-secondary font-medium border-b border-border">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-border last:border-b-0">
                <td className="p-3 text-text-muted text-xs">{row}</td>
                {columns.map((col) => (
                  <td key={col.key} className="p-2">
                    <input
                      type={col.type === 'number' ? 'number' : 'text'}
                      value={values[rowIdx][col.key] || ''}
                      onChange={(e) => setValue(rowIdx, col.key, e.target.value)}
                      disabled={disabled}
                      className="w-full p-2 rounded-lg bg-bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-primary disabled:opacity-60"
                      placeholder={col.label}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => onAnswer(values)}
        disabled={disabled}
        className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 disabled:opacity-40 active:scale-[0.98]"
      >
        Ответить
      </button>
    </div>
  );
}
