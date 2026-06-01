import type { Question } from '../../types/question';
import RadioQuestion from './RadioQuestion';
import CheckboxQuestion from './CheckboxQuestion';
import TextareaQuestion from './TextareaQuestion';
import NumberInputQuestion from './NumberInputQuestion';
import FillInBlanksQuestion from './FillInBlanksQuestion';
import FlashCardQuestion from './FlashCardQuestion';
import DragAndDropQuestion from './DragAndDropQuestion';
import MatchingQuestion from './MatchingQuestion';
import BranchingDialogue from './BranchingDialogue';
import LikertScaleQuestion from './LikertScaleQuestion';
import AudioRecordQuestion from './AudioRecordQuestion';
import TableInputQuestion from './TableInputQuestion';
import InteractiveBoard from './InteractiveBoard';
import ClickOnImageQuestion from './ClickOnImageQuestion';
import { Sparkles } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: unknown) => void;
  disabled?: boolean;
}

export default function QuestionRenderer({
  question,
  onAnswer,
  disabled,
}: QuestionRendererProps) {
  const props = { question, onAnswer, disabled };

  switch (question.type) {
    case 'radio':
      return <RadioQuestion {...props} />;
    case 'checkbox':
      return <CheckboxQuestion {...props} />;
    case 'textarea':
      return <TextareaQuestion {...props} />;
    case 'number':
      return <NumberInputQuestion {...props} />;
    case 'fill-blanks':
      return <FillInBlanksQuestion {...props} />;
    case 'flashcard':
      return <FlashCardQuestion {...props} />;
    case 'drag-sort':
    case 'drag-group':
    case 'drag-swimlane':
      return <DragAndDropQuestion {...props} />;
    case 'matching':
      return <MatchingQuestion {...props} />;
    case 'branching-dialogue':
      return <BranchingDialogue {...props} />;
    case 'likert':
      return <LikertScaleQuestion {...props} />;
    case 'audio':
      return <AudioRecordQuestion {...props} />;
    case 'table-input':
      return <TableInputQuestion {...props} />;
    case 'interactive-board':
      return <InteractiveBoard {...props} />;
    case 'click-image':
      return <ClickOnImageQuestion {...props} />;
    default:
      return (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-bg-surface to-bg-elevated border border-border text-center space-y-3">
          <Sparkles size={32} className="text-primary mx-auto" />
          <p className="text-text-primary font-medium">
            Тип вопроса «{question.type}» в разработке
          </p>
          <p className="text-text-secondary text-sm">
            Скоро здесь появится интерактивное задание
          </p>
        </div>
      );
  }
}
