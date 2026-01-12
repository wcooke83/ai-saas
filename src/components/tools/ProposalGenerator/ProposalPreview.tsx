'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ProposalSection } from '@/types/proposal';
import { SectionList } from './SectionList';
import { ExportMenu } from './ExportMenu';
import { FileText, RefreshCw, Sparkles } from 'lucide-react';

interface ProposalPreviewProps {
  title: string;
  sections: ProposalSection[];
  regeneratingSection: string | null;
  hasGenerated: boolean;
  isGenerating: boolean;
  isPro: boolean;
  branding?: {
    companyName: string;
    primaryColor?: string;
  };
  clientInfo?: {
    clientName: string;
    clientCompany: string;
  };
  senderInfo?: {
    senderName: string;
    senderCompany: string;
  };
  apiEndpoint?: string;
  apiKey?: string;
  onContentChange: (sectionId: string, content: string) => void;
  onToggle: (sectionId: string) => void;
  onRegenerate: (sectionId: string, instructions?: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onReset: () => void;
}

export function ProposalPreview({
  title,
  sections,
  regeneratingSection,
  hasGenerated,
  isGenerating,
  isPro,
  branding,
  clientInfo,
  senderInfo,
  apiEndpoint,
  apiKey,
  onContentChange,
  onToggle,
  onRegenerate,
  onReorder,
  onReset,
}: ProposalPreviewProps) {
  const enabledSections = sections.filter(s => s.isEnabled);

  // Empty state
  if (!hasGenerated && !isGenerating) {
    return (
      <Card className="flex h-96 flex-col items-center justify-center text-center">
        <Sparkles className="mb-4 h-12 w-12 text-secondary-300 dark:text-secondary-600" />
        <h3 className="mb-2 text-lg font-medium text-secondary-700 dark:text-secondary-300">
          Your Proposal Will Appear Here
        </h3>
        <p className="max-w-sm text-sm text-secondary-500 dark:text-secondary-400">
          Fill out the form on the left and click &quot;Generate Proposal&quot; to create
          your AI-powered proposal.
        </p>
      </Card>
    );
  }

  // Loading state
  if (isGenerating && !hasGenerated) {
    return (
      <Card className="flex h-96 flex-col items-center justify-center text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
        <h3 className="mb-2 text-lg font-medium text-secondary-700 dark:text-secondary-300">
          Generating Your Proposal...
        </h3>
        <p className="max-w-sm text-sm text-secondary-500 dark:text-secondary-400">
          Our AI is crafting a professional proposal tailored to your requirements.
          This usually takes 15-30 seconds.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {title || 'Your Proposal'}
              </CardTitle>
              <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                {enabledSections.length} of {sections.length} sections enabled
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ExportMenu
                title={title || 'Proposal'}
                sections={sections}
                canExportPDF={true}
                canExportDOCX={isPro}
                isPro={isPro}
                branding={branding}
                clientInfo={clientInfo}
                senderInfo={senderInfo}
                apiEndpoint={`${apiEndpoint}/export`}
                apiKey={apiKey}
              />
              <Button variant="outline" onClick={onReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pro features notice */}
      {!isPro && (
        <div className="rounded-md bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-4 text-sm">
          <p className="font-medium text-primary-700 dark:text-primary-400">
            Upgrade to Pro for more features
          </p>
          <p className="mt-1 text-secondary-600 dark:text-secondary-400">
            Unlock section regeneration, drag-and-drop reordering, DOCX export,
            and custom branding.
          </p>
        </div>
      )}

      {/* Section List */}
      <SectionList
        sections={sections}
        regeneratingSection={regeneratingSection}
        canRegenerate={isPro}
        canReorder={isPro}
        onContentChange={onContentChange}
        onToggle={onToggle}
        onRegenerate={onRegenerate}
        onReorder={onReorder}
      />

      {/* Footer stats */}
      <div className="text-center text-sm text-secondary-400 dark:text-secondary-500">
        {enabledSections.reduce((acc, s) => acc + s.content.split(' ').length, 0).toLocaleString()} words
        across {enabledSections.length} sections
      </div>
    </div>
  );
}
