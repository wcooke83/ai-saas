'use client';

import { useState, useCallback, useRef, type DragEvent } from 'react';
import type { ProposalSection } from '@/types/proposal';

export interface SectionReorderState {
  draggedId: string | null;
  dragOverId: string | null;
  isDragging: boolean;
}

export interface SectionReorderHandlers {
  handleDragStart: (e: DragEvent<HTMLElement>, sectionId: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: DragEvent<HTMLElement>, sectionId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: DragEvent<HTMLElement>, targetId: string) => void;
  getDragProps: (sectionId: string) => {
    draggable: boolean;
    onDragStart: (e: DragEvent<HTMLElement>) => void;
    onDragEnd: () => void;
    onDragOver: (e: DragEvent<HTMLElement>) => void;
    onDragLeave: () => void;
    onDrop: (e: DragEvent<HTMLElement>) => void;
    className: string;
  };
}

export function useSectionReorder(
  sections: ProposalSection[],
  onReorder: (startIndex: number, endIndex: number) => void,
  enabled = true
): SectionReorderState & SectionReorderHandlers {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggedIndexRef = useRef<number>(-1);

  const isDragging = draggedId !== null;

  const handleDragStart = useCallback((e: DragEvent<HTMLElement>, sectionId: string) => {
    if (!enabled) return;

    setDraggedId(sectionId);
    draggedIndexRef.current = sections.findIndex(s => s.id === sectionId);

    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);

    // Add a slight delay for visual feedback
    requestAnimationFrame(() => {
      const target = e.target as HTMLElement;
      target.style.opacity = '0.5';
    });
  }, [enabled, sections]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
    draggedIndexRef.current = -1;
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>, sectionId: string) => {
    if (!enabled || !draggedId || draggedId === sectionId) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(sectionId);
  }, [enabled, draggedId]);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();

    if (!enabled || !draggedId || draggedId === targetId) {
      handleDragEnd();
      return;
    }

    const startIndex = draggedIndexRef.current;
    const endIndex = sections.findIndex(s => s.id === targetId);

    if (startIndex !== -1 && endIndex !== -1 && startIndex !== endIndex) {
      onReorder(startIndex, endIndex);
    }

    handleDragEnd();
  }, [enabled, draggedId, sections, onReorder, handleDragEnd]);

  const getDragProps = useCallback((sectionId: string) => {
    const isDraggedOver = dragOverId === sectionId;
    const isBeingDragged = draggedId === sectionId;

    return {
      draggable: enabled,
      onDragStart: (e: DragEvent<HTMLElement>) => handleDragStart(e, sectionId),
      onDragEnd: handleDragEnd,
      onDragOver: (e: DragEvent<HTMLElement>) => handleDragOver(e, sectionId),
      onDragLeave: handleDragLeave,
      onDrop: (e: DragEvent<HTMLElement>) => handleDrop(e, sectionId),
      className: [
        enabled ? 'cursor-move' : '',
        isBeingDragged ? 'opacity-50' : '',
        isDraggedOver ? 'ring-2 ring-primary-500 ring-offset-2' : '',
      ].filter(Boolean).join(' '),
    };
  }, [enabled, draggedId, dragOverId, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop]);

  return {
    draggedId,
    dragOverId,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    getDragProps,
  };
}
