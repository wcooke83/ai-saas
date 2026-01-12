'use client';

import { ProposalForm } from './ProposalForm';
import { ProposalPreview } from './ProposalPreview';
import { useProposalState } from './hooks/useProposalState';

interface ProposalGeneratorProps {
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  isPro?: boolean;
  branding?: {
    companyName: string;
    primaryColor?: string;
  };
  onGenerate?: (sections: Array<{ type: string; title: string; content: string }>) => void;
}

export function ProposalGenerator({
  className = '',
  apiEndpoint = '/api/tools/proposal-generator',
  apiKey,
  isPro = false,
  branding,
  onGenerate,
}: ProposalGeneratorProps) {
  const {
    input,
    sections,
    isGenerating,
    regeneratingSection,
    hasGenerated,
    updateInput,
    setProposalType,
    generateProposal,
    regenerateSection,
    updateSectionContent,
    toggleSection,
    reorderSections,
    toggleSectionSelection,
    resetProposal,
  } = useProposalState(apiEndpoint);

  const handleGenerate = async () => {
    await generateProposal(apiKey);

    // Call callback after generation
    if (onGenerate && sections.length > 0) {
      onGenerate(sections.map(s => ({
        type: s.type,
        title: s.title,
        content: s.content,
      })));
    }
  };

  const handleRegenerate = async (sectionId: string, instructions?: string) => {
    await regenerateSection(sectionId, instructions, apiKey);
  };

  return (
    <div className={`grid gap-8 lg:grid-cols-2 ${className}`}>
      {/* Left Panel - Form */}
      <div>
        <ProposalForm
          input={input}
          isGenerating={isGenerating}
          onInputChange={updateInput}
          onProposalTypeChange={setProposalType}
          onToggleSection={toggleSectionSelection}
          onGenerate={handleGenerate}
        />
      </div>

      {/* Right Panel - Preview */}
      <div>
        <ProposalPreview
          title={input.title || `${input.proposalType.replace(/-/g, ' ')} Proposal for ${input.clientCompany || 'Client'}`}
          sections={sections}
          regeneratingSection={regeneratingSection}
          hasGenerated={hasGenerated}
          isGenerating={isGenerating}
          isPro={isPro}
          branding={branding || {
            companyName: input.senderCompany || 'Your Company',
          }}
          clientInfo={{
            clientName: input.clientName,
            clientCompany: input.clientCompany,
          }}
          senderInfo={{
            senderName: input.senderName,
            senderCompany: input.senderCompany,
          }}
          apiEndpoint={apiEndpoint}
          apiKey={apiKey}
          onContentChange={updateSectionContent}
          onToggle={toggleSection}
          onRegenerate={handleRegenerate}
          onReorder={reorderSections}
          onReset={resetProposal}
        />
      </div>
    </div>
  );
}

// Export sub-components for customization
export { ProposalForm } from './ProposalForm';
export { ProposalPreview } from './ProposalPreview';
export { SectionEditor } from './SectionEditor';
export { SectionList } from './SectionList';
export { ExportMenu } from './ExportMenu';
export { useProposalState } from './hooks/useProposalState';
export { useSectionReorder } from './hooks/useSectionReorder';
