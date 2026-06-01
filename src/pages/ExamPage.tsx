import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, GraduationCap } from 'lucide-react';
import questionsData from '../data/questions.json';
import { useProgressStore } from '../store/useProgressStore';
import QuestionRenderer from '../components/questions/QuestionRenderer';
import AnswerReveal from '../components/AnswerReveal';
import TimerDisplay from '../components/Timer';
import type { ExamResult } from '../types/question';

const EXAM_DURATION = 45 * 60; // 45 minutes
const EXAM_QUESTION_COUNT = 25;

export default function ExamPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { status: string; answer: unknown; time: number }>>({});
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const submitAnswer = useProgressStore((s) => s.submitAnswer);
  const setExamResult = useProgressStore((s) => s.setExamResult);
  const addXp = useProgressStore((s) => s.addXp);

  // Pick questions for exam (mix of levels and types)
  const examQuestions = useMemo(() => {
    const all = questionsData as any[];
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    // Prioritize non-flashcard, non-trivial types
    const preferred = shuffled.filter((q) => !['flashcard'].includes(q.type));
    const rest = shuffled.filter((q) => ['flashcard'].includes(q.type));
    return [...preferred, ...rest].slice(0, EXAM_QUESTION_COUNT);
  }, []);

  const current = examQuestions[currentIdx];
  const isLast = currentIdx === examQuestions.length - 1;

  const handleAnswer = useCallback(
    (answer: unknown) => {
      if (!current) return;
      let status: string;

      switch (current.type) {
        case 'radio':
          status = answer === current.data.correct ? 'correct' : 'incorrect';
          break;
        case 'number': {
          const numAns = answer as number;
          const correct = current.data.correct as number;
          status = Math.abs(numAns - correct) < 0.01 ? 'correct' : 'incorrect';
          break;
        }
        case 'checkbox': {
          const correct = current.data.correct as string[];
          const userAns = answer as string[];
          const matchCount = correct.filter((c) => userAns.includes(c)).length;
          status = matchCount === correct.length && correct.length === userAns.length
            ? 'correct'
            : matchCount > 0
            ? 'partial'
            : 'incorrect';
          break;
        }
        default:
          status = 'partial';
      }

      setAnswers((prev) => ({
        ...prev,
        [current.id]: { status, answer, time: Date.now() },
      }));
      setRevealedId(current.id);
    },
    [current]
  );

  const finishExam = useCallback(() => {
    const total = examQuestions.length;
    const score = Object.values(answers).filter((a) => a.status === 'correct').length;
    const result: ExamResult = {
      score,
      total,
      answers: answers as any,
      completedAt: Date.now(),
      timeSpent: EXAM_DURATION,
    };
    setExamResult(result);
    addXp(score * 5);
    setCompleted(true);
  }, [answers, examQuestions.length, setExamResult, addXp]);

  const handleNext = () => {
    if (revealedId && answers[revealedId]) {
      submitAnswer(current.id, answers[current.id]?.status as any, answers[current.id]?.answer);
    }
    setRevealedId(null);
    if (isLast || timeUp) {
      finishExam();
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  if (!started) {
    return (
      <div className="max-w-lg mx-auto text-center py-12 space-y-6">
        <GraduationCap size={48} className="text-primary mx-auto" />
        <h1 className="text-2xl font-bold text-text-primary">Финальный экзамен</h1>
        <div className="space-y-3 text-left p-6 rounded-xl bg-bg-surface border border-border">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-primary" />
            <span className="text-text-primary">45 минут</span>
          </div>
          <p className="text-text-secondary text-sm">
            {EXAM_QUESTION_COUNT} вопросов разных типов и уровней сложности
          </p>
          <p className="text-text-secondary text-sm">
            После ответа показывается правильный ответ — перейти назад нельзя
          </p>
          <p className="text-text-warning text-sm">Таймер запустится после начала</p>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
        >
          Начать экзамен
        </button>
      </div>
    );
  }

  if (completed) {
    const correctCount = Object.values(answers).filter((a) => a.status === 'correct').length;
    const pct = Math.round((correctCount / examQuestions.length) * 100);
    return (
      <div className="max-w-lg mx-auto text-center py-12 space-y-6">
        <GraduationCap size={48} className="text-primary mx-auto" />
        <h2 className="text-2xl font-bold text-text-primary">Экзамен завершён!</h2>
        <div className="p-6 rounded-xl bg-bg-surface border border-border">
          <p className="text-5xl font-bold text-primary">{pct}%</p>
          <p className="text-text-secondary mt-2">
            {correctCount} из {examQuestions.length} правильных
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/report')}
            className="px-6 py-3 rounded-xl bg-bg-surface border border-border text-text-primary hover:bg-bg-hover transition-all"
          >
            Отчёт
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white transition-all"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-text-muted">
            Вопрос {currentIdx + 1} из {examQuestions.length}
          </span>
          <div className="w-48 h-1.5 bg-bg-surface rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / examQuestions.length) * 100}%` }}
            />
          </div>
        </div>
        <TimerDisplay totalSeconds={EXAM_DURATION} running={started && !completed} onTimeUp={() => setTimeUp(true)} />
      </div>

      {timeUp && !completed && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 text-warning text-center">
          Время вышло! Результаты будут подсчитаны.
        </div>
      )}

      {/* Question */}
      {current && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {current.level === 'J' ? 'Junior' : current.level === 'M' ? 'Middle' : 'Senior'}
            </span>
            <span className="text-xs text-text-muted">{current.type}</span>
          </div>

          <h2 className="text-xl font-semibold text-text-primary">{current.title}</h2>
          {current.description && (
            <p className="text-text-secondary text-sm">{current.description}</p>
          )}

          <QuestionRenderer
            question={current}
            onAnswer={handleAnswer}
            disabled={revealedId === current.id}
          />

          {revealedId === current.id && (
            <AnswerReveal
              status={(answers[current.id]?.status as any) || 'partial'}
              explanation={current.explanation}
              correctAnswer={
                typeof current.data.correct === 'string' ? current.data.correct : undefined
              }
              onNext={handleNext}
              hasNext={!isLast}
            />
          )}
        </>
      )}
    </div>
  );
}
