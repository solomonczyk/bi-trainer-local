import { useState, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import type { Question } from '../../types/question';

interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  options: { label: string; nextId: string }[];
  isFinal?: boolean;
  explanation?: string;
}

interface BranchingDialogueProps {
  question: Question;
  onAnswer: (answer: { path: string[]; finalNode: string }) => void;
  disabled?: boolean;
}

export default function BranchingDialogue({
  question,
  onAnswer,
  disabled,
}: BranchingDialogueProps) {
  const nodes = question.data.nodes as DialogueNode[] | undefined;
  if (!nodes) return <p className="text-error">Ошибка: нет данных диалога</p>;

  const [currentNodeId, setCurrentNodeId] = useState(question.data.startNode as string || nodes[0]?.id);
  const [path, setPath] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  const handleChoice = useCallback(
    (nextId: string, label: string) => {
      if (disabled || finished) return;
      setPath((prev) => [...prev, label]);
      const nextNode = nodes.find((n) => n.id === nextId);
      if (nextNode?.isFinal) {
        setCurrentNodeId(nextId);
        setFinished(true);
        onAnswer({ path: [...path, label], finalNode: nextId });
      } else {
        setCurrentNodeId(nextId);
      }
    },
    [nodes, path, disabled, finished, onAnswer]
  );

  if (!currentNode) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-surface border border-border">
        <MessageSquare size={20} className="text-primary mt-1 flex-shrink-0" />
        <div>
          <p className="text-xs text-text-muted font-medium mb-1">{currentNode.speaker}</p>
          <p className="text-text-primary text-sm leading-relaxed">{currentNode.text}</p>
        </div>
      </div>

      {!finished && (
        <div className="space-y-2">
          {currentNode.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(opt.nextId, opt.label)}
              disabled={disabled}
              className="w-full text-left p-4 rounded-xl border border-border bg-bg-surface hover:border-primary/30 hover:bg-bg-hover text-text-primary text-sm transition-all disabled:opacity-40"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {finished && currentNode.explanation && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-text-secondary text-sm font-medium mb-1">Результат:</p>
          <p className="text-text-primary text-sm leading-relaxed">{currentNode.explanation}</p>
        </div>
      )}
    </div>
  );
}
