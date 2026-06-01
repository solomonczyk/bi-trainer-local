export type QuestionType =
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'number'
  | 'drag-sort'
  | 'drag-group'
  | 'drag-swimlane'
  | 'interactive-board'
  | 'click-image'
  | 'branching-dialogue'
  | 'table-input'
  | 'audio'
  | 'likert'
  | 'flashcard'
  | 'fill-blanks'
  | 'matching';

export type Level = 'J' | 'M' | 'S';

export type AnswerStatus = 'correct' | 'incorrect' | 'partial' | 'pending';

export interface Question {
  id: string;
  moduleId: string;
  type: QuestionType;
  level: Level;
  title: string;
  description?: string;
  data: Record<string, unknown>;
  explanation: string;
  order: number;
  tags?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  questionCount: number;
  order: number;
  level: 'all' | 'J' | 'M' | 'S';
}

export interface AnswerRecord {
  questionId: string;
  status: AnswerStatus;
  answer: unknown;
  attempts: number;
  answeredAt: number;
}

export interface DiagnosticsResult {
  level: Level;
  scores: Record<string, number>;
  completedAt: number;
}

export interface ExamResult {
  score: number;
  total: number;
  answers: Record<string, AnswerRecord>;
  completedAt: number;
  timeSpent: number;
}

export interface ModuleProgress {
  total: number;
  completed: number;
  correct: number;
  score: number;
}

export interface ProgressState {
  answers: Record<string, AnswerRecord>;
  diagnosticsResult: DiagnosticsResult | null;
  examResult: ExamResult | null;
  xp: number;
  lastActive: number;
  initialized: boolean;
}
