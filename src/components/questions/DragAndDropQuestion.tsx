import { useState, useCallback } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Question } from '../../types/question';

interface DragAndDropQuestionProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
  disabled?: boolean;
}

function SortableItem({ id, label, disabled }: { id: string; label: string; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-xl border bg-bg-surface ${
        isDragging ? 'border-primary z-10' : 'border-border'
      } ${disabled ? 'opacity-60' : 'cursor-grab hover:border-border-light'}`}
    >
      {!disabled && (
        <button {...attributes} {...listeners} className="text-text-muted hover:text-text-primary">
          <GripVertical size={18} />
        </button>
      )}
      <span className="text-text-primary text-sm">{label}</span>
    </div>
  );
}

export default function DragAndDropQuestion({
  question,
  onAnswer,
  disabled,
}: DragAndDropQuestionProps) {
  const items = question.data.items as string[] | undefined;
  if (!items) return <p className="text-error">Ошибка: нет элементов</p>;

  const [order, setOrder] = useState(() => items.map((item, idx) => ({
    id: `item-${idx}`,
    label: item,
  })));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrder((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      const newOrder = [...prev];
      const [moved] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, moved);
      return newOrder;
    });
  }, []);

  const handleSubmit = () => {
    onAnswer(order.map((i) => i.label));
  };

  return (
    <div className="space-y-3">
      <p className="text-text-secondary text-sm mb-2">
        {question.data.hint as string || 'Расположите в правильном порядке:'}
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {order.map((item) => (
              <SortableItem key={item.id} id={item.id} label={item.label} disabled={disabled} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full mt-4 py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 disabled:opacity-40 active:scale-[0.98]"
      >
        Подтвердить порядок
      </button>
    </div>
  );
}
