"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

// ---------- Drag handle ----------

export interface DragHandleProps {
  attributes: Record<string, unknown>;
  listeners: Record<string, unknown> | undefined;
}

function DragHandle({ attributes, listeners }: DragHandleProps) {
  return (
    <button
      type="button"
      className="cursor-grab touch-none p-1 rounded hover:bg-surface-light text-text-muted hover:text-text-secondary transition-colors"
      {...attributes}
      {...(listeners as any)}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
}

// ---------- Sortable item wrapper ----------

interface SortableItemProps {
  id: string;
  children: (dragHandleProps: DragHandleProps) => React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-shadow",
        isDragging && "opacity-50 border-gold border rounded-lg shadow-lg z-50 relative"
      )}
    >
      {children({ attributes: attributes as any, listeners })}
    </div>
  );
}

// ---------- Main SortableList ----------

interface SortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (orderedIds: string[]) => Promise<{ success?: boolean; error?: string }>;
  renderItem: (item: T, dragHandleProps: DragHandleProps) => React.ReactNode;
}

export default function SortableList<T extends { id: string }>({
  items: initialItems,
  onReorder,
  renderItem,
}: SortableListProps<T>) {
  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    setSaving(true);
    try {
      const result = await onReorder(reordered.map((item) => item.id));
      if (result.error) {
        toast.error(result.error);
        // Revert on error
        setItems(items);
      }
    } catch {
      toast.error("Erreur lors de la sauvegarde de l'ordre");
      setItems(items);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative">
      {saving && (
        <div className="absolute inset-0 bg-background/30 z-40 flex items-center justify-center rounded-lg">
          <div className="text-sm text-text-muted animate-pulse">
            Enregistrement...
          </div>
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                {(dragHandleProps) => renderItem(item, dragHandleProps)}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export { DragHandle };
