import type { Level, AnswerStatus } from '../types/question';

export function calculateXp(level: Level, status: AnswerStatus): number {
  const levelMultiplier = { J: 1, M: 2, S: 3 };
  const statusMultiplier = { correct: 10, partial: 5, incorrect: 1, pending: 0 };
  return (levelMultiplier[level] || 1) * (statusMultiplier[status] || 0);
}

export function getLevelLabel(level: Level): string {
  const labels: Record<Level, string> = {
    J: 'Junior',
    M: 'Middle',
    S: 'Senior',
  };
  return labels[level];
}

export function getLevelRange(level: Level): { min: number; max: number } {
  const ranges: Record<Level, { min: number; max: number }> = {
    J: { min: 0, max: 2 },
    M: { min: 2, max: 5 },
    S: { min: 5, max: 10 },
  };
  return ranges[level];
}
