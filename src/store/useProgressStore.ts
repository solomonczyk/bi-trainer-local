import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnswerRecord, DiagnosticsResult, ExamResult, ProgressState } from '../types/question';

interface ProgressActions {
  submitAnswer: (questionId: string, status: AnswerRecord['status'], answer: unknown) => void;
  setDiagnosticsResult: (result: DiagnosticsResult) => void;
  setExamResult: (result: ExamResult) => void;
  addXp: (amount: number) => void;
  resetProgress: () => void;
  getModuleStats: (moduleId: string) => { total: number; completed: number; correct: number };
}

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      answers: {},
      diagnosticsResult: null,
      examResult: null,
      xp: 0,
      lastActive: Date.now(),
      initialized: true,

      submitAnswer: (questionId, status, answer) => {
        const existing = get().answers[questionId];
        set({
          answers: {
            ...get().answers,
            [questionId]: {
              questionId,
              status,
              answer,
              attempts: (existing?.attempts ?? 0) + 1,
              answeredAt: Date.now(),
            },
          },
          lastActive: Date.now(),
        });
      },

      setDiagnosticsResult: (result) => {
        set({ diagnosticsResult: result, lastActive: Date.now() });
      },

      setExamResult: (result) => {
        set({ examResult: result, lastActive: Date.now() });
      },

      addXp: (amount) => {
        set({ xp: get().xp + amount, lastActive: Date.now() });
      },

      resetProgress: () => {
        set({
          answers: {},
          diagnosticsResult: null,
          examResult: null,
          xp: 0,
          lastActive: Date.now(),
        });
      },

      getModuleStats: (moduleId: string) => {
        const answers = get().answers;
        const moduleAnswers = Object.entries(answers).filter(([id]) =>
          id.startsWith(moduleId)
        );
        return {
          total: moduleAnswers.length,
          completed: moduleAnswers.filter(([, a]) => a.status !== 'pending').length,
          correct: moduleAnswers.filter(([, a]) => a.status === 'correct').length,
        };
      },
    }),
    {
      name: 'ba-trainer-progress',
    }
  )
);
