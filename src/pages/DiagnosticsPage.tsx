import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ArrowLeft } from 'lucide-react';
import type { Level, Question } from '../types/question';
import { useProgressStore } from '../store/useProgressStore';
import QuestionRenderer from '../components/questions/QuestionRenderer';
import AnswerReveal from '../components/AnswerReveal';

// 8 диагностических вопросов для определения уровня
const diagnosticsQuestions: (Question & { correctAnswer: string | number | string[]; keywords?: string[] })[] = [
  {
    id: 'diag-1',
    moduleId: 'module-0',
    type: 'radio',
    level: 'J',
    title: 'Какой метод сбора требований лучше всего подходит для выявления неявных требований?',
    data: {
      options: ['Анкетирование', 'Интервью', 'Наблюдение', 'Анализ документов'],
      correct: 'Наблюдение',
    },
    correctAnswer: 'Наблюдение',
    explanation: 'Наблюдение (observation) позволяет увидеть, как пользователи реально работают, и выявить требования, которые они не могут явно сформулировать.',
    order: 1,
  },
  {
    id: 'diag-2',
    moduleId: 'module-0',
    type: 'checkbox',
    level: 'J',
    title: 'Какие техники относятся к фасилитации?',
    data: {
      options: ['Workshop', 'Мозговой штурм', 'Анкетирование', 'User Story Mapping', 'Прототипирование'],
      correct: ['Workshop', 'Мозговой штурм', 'User Story Mapping'],
    },
    correctAnswer: ['Workshop', 'Мозговой штурм', 'User Story Mapping'],
    explanation: 'Workshop, мозговой штурм и User Story Mapping — это фасилитационные техники, где BA управляет групповой дискуссией.',
    order: 2,
  },
  {
    id: 'diag-3',
    moduleId: 'module-0',
    type: 'textarea',
    level: 'M',
    title: 'Опишите разницу между функциональными и нефункциональными требованиями. Приведите по 2 примера.',
    data: {
      keywords: ['функциональные', 'нефункциональные', 'требования', 'производительность', 'безопасность'],
      minMatch: 3,
    },
    correctAnswer: '',
    explanation: 'Функциональные требования описывают, что система должна делать (например, «пользователь может войти в систему»). Нефункциональные — как система должна это делать (производительность, безопасность, масштабируемость).',
    order: 3,
  },
  {
    id: 'diag-4',
    moduleId: 'module-0',
    type: 'radio',
    level: 'M',
    title: 'Что такое MVP (Minimum Viable Product)?',
    data: {
      options: [
        'Продукт с минимальным набором функций для выхода на рынок',
        'Продукт с наименьшей стоимостью разработки',
        'Версия продукта для внутреннего тестирования',
        'Продукт с максимальным качеством',
      ],
      correct: 'Продукт с минимальным набором функций для выхода на рынок',
    },
    correctAnswer: 'Продукт с минимальным набором функций для выхода на рынок',
    explanation: 'MVP — это версия продукта с минимальным набором функций, достаточным для проверки гипотез и получения обратной связи от первых пользователей.',
    order: 4,
  },
  {
    id: 'diag-5',
    moduleId: 'module-0',
    type: 'number',
    level: 'M',
    title: 'Рассчитайте WSJF: Cost of Delay = 40, Duration = 5. Чему равно WSJF?',
    description: 'WSJF = CoD / Duration',
    data: { correct: 8 },
    correctAnswer: 8,
    explanation: 'WSJF = CoD / Duration = 40 / 5 = 8. WSJF (Weighted Shortest Job First) используется в SAFe для приоритизации.',
    order: 5,
  },
  {
    id: 'diag-6',
    moduleId: 'module-0',
    type: 'radio',
    level: 'S',
    title: 'Какой тип диаграммы лучше всего подходит для моделирования бизнес-процесса?',
    data: {
      options: ['UML Class Diagram', 'BPMN 2.0', 'ERD', 'DFD', 'Use Case Diagram'],
      correct: 'BPMN 2.0',
    },
    correctAnswer: 'BPMN 2.0',
    explanation: 'BPMN 2.0 (Business Process Model and Notation) — стандарт для моделирования бизнес-процессов, понятный как аналитикам, так и разработчикам.',
    order: 6,
  },
  {
    id: 'diag-7',
    moduleId: 'module-0',
    type: 'textarea',
    level: 'S',
    title: 'Опишите процесс внесения изменения в требования (change request) в крупном проекте. Какие этапы и роли участвуют?',
    data: {
      keywords: ['change request', 'анализ', 'оценка', 'approval', 'стейкхолдеры', 'приоритизация'],
      minMatch: 4,
    },
    correctAnswer: '',
    explanation: 'Процесс change request: 1) Запрос на изменение → 2) Анализ влияния → 3) Оценка трудозатрат → 4) Рассмотрение CCB → 5) Approval/Rejection → 6) Реализация → 7) Верификация.',
    order: 7,
  },
  {
    id: 'diag-8',
    moduleId: 'module-0',
    type: 'fill-blanks',
    level: 'J',
    title: 'Заполните шаблон User Story:',
    data: {
      template: 'As a {blank1} I want {blank2} so that {blank3}',
      blanks: [
        { placeholder: 'роль пользователя', options: ['User', 'Admin', 'Customer', 'Manager'] },
        { placeholder: 'действие', options: ['to login', 'to search', 'to buy', 'to export'] },
        { placeholder: 'цель', options: ['to save time', 'to find data', 'to get product', 'to generate report'] },
      ],
      correct: ['User', 'to login', 'to save time'],
    },
    correctAnswer: ['User', 'to login', 'to save time'],
    explanation: 'User Story: As a [роль] I want [действие] so that [цель]. Это стандартный шаблон для описания требований в Agile.',
    order: 8,
  },
];

function determineLevel(answers: { status: string; level: string }[]): Level {
  const scoreByLevel = { J: 0, M: 0, S: 0 };
  const countByLevel = { J: 0, M: 0, S: 0 };

  answers.forEach((a) => {
    const level = a.level as Level;
    countByLevel[level]++;
    if (a.status === 'correct') scoreByLevel[level]++;
  });

  const seniorPct = countByLevel.S > 0 ? scoreByLevel.S / countByLevel.S : 0;
  const middlePct = countByLevel.M > 0 ? scoreByLevel.M / countByLevel.M : 0;
  if (seniorPct >= 0.6) return 'S';
  if (middlePct >= 0.6) return 'M';
  return 'J';
}

export default function DiagnosticsPage() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { status: string; answer: unknown; level: string }>>({});
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const submitAnswer = useProgressStore((s) => s.submitAnswer);
  const setDiagnosticsResult = useProgressStore((s) => s.setDiagnosticsResult);

  const current = diagnosticsQuestions[currentIdx];
  const isLast = currentIdx === diagnosticsQuestions.length - 1;

  const handleAnswer = useCallback(
    (answer: unknown) => {
      const q = current;
      let status: string;

      if (q.type === 'radio') {
        status = answer === q.data.correct ? 'correct' : 'incorrect';
      } else if (q.type === 'checkbox') {
        const correct = q.data.correct as string[];
        const userAns = answer as string[];
        const isCorrect =
          correct.length === userAns.length && correct.every((c) => userAns.includes(c));
        status = isCorrect ? 'correct' : 'partial';
      } else if (q.type === 'number') {
        status = answer === q.data.correct ? 'correct' : 'incorrect';
      } else if (q.type === 'fill-blanks') {
        const correct = q.data.correct as string[];
        const userAns = answer as string[];
        const matchCount = correct.filter((c, i) => c === userAns[i]).length;
        status = matchCount === correct.length ? 'correct' : matchCount > 0 ? 'partial' : 'incorrect';
      } else {
        status = 'partial';
      }

      setAnswers((prev) => ({
        ...prev,
        [q.id]: { status, answer, level: q.level },
      }));
      setRevealedId(q.id);
    },
    [current]
  );

  const handleNext = () => {
    if (revealedId) {
      submitAnswer(current.id, answers[current.id]?.status as any, answers[current.id]?.answer);
    }
    setRevealedId(null);
    if (isLast) {
      const allAnswers = Object.entries(answers).map(([id, a]) => ({
        ...a,
        id,
      }));
      const level = determineLevel(
        allAnswers.map((a) => ({ status: a.status, level: a.level }))
      );
      setDiagnosticsResult({ level, scores: {}, completedAt: Date.now() });
      setCompleted(true);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  if (completed) {
    const level = useProgressStore.getState().diagnosticsResult?.level;
    return (
      <div className="max-w-lg mx-auto text-center py-12 space-y-6">
        <ClipboardCheck size={48} className="text-success mx-auto" />
        <h2 className="text-2xl font-bold text-text-primary">Диагностика завершена!</h2>
        <div className="p-6 rounded-xl bg-bg-surface border border-border">
          <p className="text-text-secondary mb-2">Ваш уровень:</p>
          <p className="text-5xl font-bold text-primary">{level}</p>
          <p className="text-text-muted text-sm mt-2">
            {level === 'S'
              ? 'Senior — вы готовы к сложным вопросам'
              : level === 'M'
              ? 'Middle — хорошая база, есть куда расти'
              : 'Junior — рекомендуем начать с основ'}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all"
        >
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Назад</span>
        </button>
        <span className="text-sm text-text-muted">
          {currentIdx + 1} из {diagnosticsQuestions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-bg-surface rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
          style={{ width: `${((currentIdx + 1) / diagnosticsQuestions.length) * 100}%` }}
        />
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
          onNext={handleNext}
          hasNext={!isLast}
        />
      )}
    </div>
  );
}
