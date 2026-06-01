import { useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import questionsData from '../data/questions.json';
import modulesData from '../data/modules.json';
import { useProgressStore } from '../store/useProgressStore';
import QuestionRenderer from '../components/questions/QuestionRenderer';
import AnswerReveal from '../components/AnswerReveal';

export default function QuestionPage() {
  const { moduleId, questionId } = useParams<{ moduleId: string; questionId: string }>();
  const [revealed, setRevealed] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<any>(null);
  const submitAnswer = useProgressStore((s) => s.submitAnswer);
  const addXp = useProgressStore((s) => s.addXp);

  const question = useMemo(
    () => (questionsData as any[]).find((q) => q.id === questionId),
    [questionId]
  );
  const mod = useMemo(
    () => modulesData.find((m) => m.id === moduleId),
    [moduleId]
  );

  const handleAnswer = useCallback(
    (answer: unknown) => {
      if (!question) return;
      setLastAnswer(answer);
      let status: string;

      switch (question.type) {
        case 'radio':
          status = answer === question.data.correct ? 'correct' : 'incorrect';
          break;
        case 'number': {
          const numAns = answer as number;
          const correct = question.data.correct as number;
          status = Math.abs(numAns - correct) < 0.01 ? 'correct' : 'incorrect';
          break;
        }
        case 'checkbox': {
          const correct = question.data.correct as string[];
          const userAns = answer as string[];
          const matchCount = correct.filter((c) => userAns.includes(c)).length;
          status = matchCount === correct.length && correct.length === userAns.length
            ? 'correct'
            : matchCount > 0
            ? 'partial'
            : 'incorrect';
          break;
        }
        case 'textarea': {
          const { keywordResult } = answer as { keywordResult: any };
          if (keywordResult.passed && keywordResult.structureOk) status = 'correct';
          else if (keywordResult.matched > 0) status = 'partial';
          else status = 'incorrect';
          break;
        }
        case 'fill-blanks': {
          const correct = question.data.correct as string[];
          const userAns = answer as string[];
          const matchCount = correct.filter((c, i) => c === userAns[i]).length;
          status = matchCount === correct.length ? 'correct' : matchCount > 0 ? 'partial' : 'incorrect';
          break;
        }
        case 'flashcard':
          status = answer === 'known' ? 'correct' : 'incorrect';
          break;
        default:
          status = 'partial';
      }

      // Save answer
      submitAnswer(question.id, status as any, answer);

      // Award XP
      const xpMap: Record<string, number> = { correct: 10, partial: 5, incorrect: 1 };
      addXp(xpMap[status] || 1);

      setRevealed(true);
    },
    [question, submitAnswer, addXp]
  );

  const handleNext = () => {
    // Find next question in module
    const moduleQuestions = (questionsData as any[])
      .filter((q) => q.moduleId === moduleId)
      .sort((a, b) => a.order - b.order);
    const currentIdx = moduleQuestions.findIndex((q) => q.id === questionId);
    const next = moduleQuestions[currentIdx + 1];
    if (next) {
      window.location.href = `/modules/${moduleId}/${next.id}`;
    } else {
      window.location.href = `/modules/${moduleId}`;
    }
  };

  if (!question || !mod) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Вопрос не найден</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to={`/modules/${moduleId}`}
        className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">{mod.title}</span>
      </Link>

      {/* Meta info */}
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {question.level === 'J' ? 'Junior' : question.level === 'M' ? 'Middle' : 'Senior'}
        </span>
        <span className="text-xs text-text-muted">{question.type}</span>
      </div>

      <h2 className="text-xl font-semibold text-text-primary leading-relaxed">
        {question.title}
      </h2>
      {question.description && (
        <p className="text-text-secondary text-sm">{question.description}</p>
      )}

      <QuestionRenderer question={question} onAnswer={handleAnswer} disabled={revealed} />

      {revealed && (
        <AnswerReveal
          status={lastAnswer ? (useProgressStore.getState().answers[question.id]?.status as any) || 'partial' : 'partial'}
          explanation={question.explanation}
          correctAnswer={
            typeof question.data.correct === 'string'
              ? question.data.correct
              : Array.isArray(question.data.correct)
              ? (question.data.correct as string[]).join(', ')
              : undefined
          }
          userAnswer={
            typeof lastAnswer === 'string'
              ? lastAnswer
              : Array.isArray(lastAnswer)
              ? lastAnswer.join(', ')
              : lastAnswer?.text
          }
          xpEarned={
            useProgressStore.getState().answers[question.id]?.status === 'correct'
              ? 10
              : useProgressStore.getState().answers[question.id]?.status === 'partial'
              ? 5
              : 1
          }
          onNext={handleNext}
          hasNext={true}
        />
      )}
    </div>
  );
}
