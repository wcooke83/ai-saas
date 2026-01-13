'use client';

import type { ProposalSection } from '@/types/proposal';
import { SectionEditor } from './SectionEditor';
import { useSectionReorder } from './hooks/useSectionReorder';

interface SectionListProps {
  sections: ProposalSection[];
  regeneratingSection: string | null;
  onContentChange: (sectionId: string, content: string) => void;
  onToggle: (sectionId: string) => void;
  onRegenerate: (sectionId: string, instructions?: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export function SectionList({
  sections,
  regeneratingSection,
  onContentChange,
  onToggle,
  onRegenerate,
  onReorder,
}: SectionListProps) {
  const { getDragProps } = useSectionReorder(sections, onReorder, true);

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sortedSections.map((section) => (
        <SectionEditor
          key={section.id}
          section={section}
          isRegenerating={regeneratingSection === section.id}
          dragProps={getDragProps(section.id)}
          onContentChange={(content) => onContentChange(section.id, content)}
          onToggle={() => onToggle(section.id)}
          onRegenerate={(instructions) => onRegenerate(section.id, instructions)}
        />
      ))}
    </div>
  );
}
