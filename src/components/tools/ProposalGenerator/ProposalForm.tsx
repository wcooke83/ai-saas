'use client';

import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  PROPOSAL_TYPES,
  INDUSTRIES,
  PROPOSAL_TONES,
  SECTION_LABELS,
  type ProposalInput,
  type ProposalType,
  type SectionType,
} from '@/types/proposal';
import { DEFAULT_SECTIONS_BY_TYPE, ALL_SECTIONS } from '@/lib/ai/prompts/proposal-generator';
import { Loader2, FileText, Users, Building, Target, Settings, Check, Info } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ProposalFormProps {
  input: ProposalInput;
  isGenerating: boolean;
  onInputChange: (updates: Partial<ProposalInput>) => void;
  onProposalTypeChange: (type: ProposalType) => void;
  onToggleSection: (sectionType: SectionType) => void;
  onGenerate: () => void;
}

export function ProposalForm({
  input,
  isGenerating,
  onInputChange,
  onProposalTypeChange,
  onToggleSection,
  onGenerate,
}: ProposalFormProps) {
  const formId = useId();

  // Generate unique IDs for all form fields
  const proposalTypeId = `${formId}-proposal-type`;
  const industryId = `${formId}-industry`;
  const toneId = `${formId}-tone`;
  const titleId = `${formId}-title`;
  const clientNameId = `${formId}-client-name`;
  const clientCompanyId = `${formId}-client-company`;
  const clientRoleId = `${formId}-client-role`;
  const senderNameId = `${formId}-sender-name`;
  const senderCompanyId = `${formId}-sender-company`;
  const senderRoleId = `${formId}-sender-role`;
  const senderEmailId = `${formId}-sender-email`;
  const projectDescId = `${formId}-project-desc`;
  const objectivesId = `${formId}-objectives`;
  const timelineId = `${formId}-timeline`;
  const budgetId = `${formId}-budget`;
  const advantageId = `${formId}-advantage`;

  const isFormValid =
    input.clientName &&
    input.clientCompany &&
    input.senderName &&
    input.senderCompany &&
    input.projectDescription.length >= 20 &&
    input.objectives.length >= 10 &&
    input.selectedSections.length > 0;

  const updateField = (field: keyof ProposalInput, value: string) => {
    onInputChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Proposal Type & Industry */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Proposal Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={proposalTypeId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1">
                Proposal Type <span className="text-red-500">*</span>
                <Tooltip content="Determines the proposal structure and language. Sales proposals focus on value, RFP responses on requirements, Technical on specs.">
                  <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                </Tooltip>
              </label>
              <Select
                id={proposalTypeId}
                value={input.proposalType}
                onChange={(e) => onProposalTypeChange(e.target.value as ProposalType)}
                options={PROPOSAL_TYPES}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={industryId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1">
                Industry <span className="text-red-500">*</span>
                <Tooltip content="Adds industry-specific terminology and standards to make the proposal more relevant to the client.">
                  <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                </Tooltip>
              </label>
              <Select
                id={industryId}
                value={input.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                options={INDUSTRIES}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={toneId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Tone <span className="text-red-500">*</span>
              </label>
              <Select
                id={toneId}
                value={input.tone}
                onChange={(e) => updateField('tone', e.target.value)}
                options={PROPOSAL_TONES}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={titleId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Proposal Title
                <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">(optional)</span>
              </label>
              <Input
                id={titleId}
                value={input.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Website Redesign Proposal"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={clientNameId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Client Name <span className="text-red-500">*</span>
              </label>
              <Input
                id={clientNameId}
                value={input.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                placeholder="John Smith"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={clientCompanyId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Client Company <span className="text-red-500">*</span>
              </label>
              <Input
                id={clientCompanyId}
                value={input.clientCompany}
                onChange={(e) => updateField('clientCompany', e.target.value)}
                placeholder="Acme Corp"
                aria-required="true"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor={clientRoleId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Client Role
              <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">(optional)</span>
            </label>
            <Input
              id={clientRoleId}
              value={input.clientRole || ''}
              onChange={(e) => updateField('clientRole', e.target.value)}
              placeholder="CEO, Project Manager, etc."
            />
          </div>
        </CardContent>
      </Card>

      {/* Your Company */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Your Company
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={senderNameId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                id={senderNameId}
                value={input.senderName}
                onChange={(e) => updateField('senderName', e.target.value)}
                placeholder="Jane Doe"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={senderCompanyId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Your Company <span className="text-red-500">*</span>
              </label>
              <Input
                id={senderCompanyId}
                value={input.senderCompany}
                onChange={(e) => updateField('senderCompany', e.target.value)}
                placeholder="Your Agency Inc"
                aria-required="true"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={senderRoleId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Your Role
                <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">(optional)</span>
              </label>
              <Input
                id={senderRoleId}
                value={input.senderRole || ''}
                onChange={(e) => updateField('senderRole', e.target.value)}
                placeholder="Account Manager"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={senderEmailId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Your Email
                <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">(optional)</span>
              </label>
              <Input
                id={senderEmailId}
                type="email"
                value={input.senderEmail || ''}
                onChange={(e) => updateField('senderEmail', e.target.value)}
                placeholder="you@company.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor={projectDescId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Project Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id={projectDescId}
              value={input.projectDescription}
              onChange={(e) => updateField('projectDescription', e.target.value)}
              placeholder="Describe the project, what the client needs, and any relevant background..."
              rows={4}
              aria-required="true"
              aria-describedby={`${projectDescId}-hint`}
            />
            <p id={`${projectDescId}-hint`} className="text-xs text-secondary-500 dark:text-secondary-400">
              {input.projectDescription.length}/2000 characters (min 20)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor={objectivesId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Objectives <span className="text-red-500">*</span>
            </label>
            <Textarea
              id={objectivesId}
              value={input.objectives}
              onChange={(e) => updateField('objectives', e.target.value)}
              placeholder="What are the key goals and outcomes for this project?"
              rows={3}
              aria-required="true"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={timelineId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Timeline
                <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">(optional)</span>
              </label>
              <Input
                id={timelineId}
                value={input.timeline || ''}
                onChange={(e) => updateField('timeline', e.target.value)}
                placeholder="e.g., 3 months, Q1 2025"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={budgetId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Budget Range
                <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">(optional)</span>
              </label>
              <Input
                id={budgetId}
                value={input.budget || ''}
                onChange={(e) => updateField('budget', e.target.value)}
                placeholder="e.g., $10,000 - $25,000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor={advantageId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1">
              Your Competitive Advantage
              <span className="text-xs text-secondary-500 dark:text-secondary-400 font-normal">(optional)</span>
              <Tooltip content="Highlight what sets you apart — unique expertise, past results, or proprietary methods. This is woven throughout the proposal.">
                <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
              </Tooltip>
            </label>
            <Textarea
              id={advantageId}
              value={input.competitiveAdvantage || ''}
              onChange={(e) => updateField('competitiveAdvantage', e.target.value)}
              placeholder="What makes your solution or company unique for this project?"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Sections to Include
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-secondary-600 dark:text-secondary-400">
            Select which sections to include in your proposal.
            Defaults are based on your proposal type.
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Proposal sections">
            {ALL_SECTIONS.map((sectionType) => {
              const isSelected = input.selectedSections.includes(sectionType);
              const isDefault = DEFAULT_SECTIONS_BY_TYPE[input.proposalType].includes(sectionType);

              return (
                <button
                  key={sectionType}
                  type="button"
                  onClick={() => onToggleSection(sectionType)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    'min-h-[36px]', // Touch target size
                    isSelected
                      ? 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600'
                      : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border-secondary-300 dark:border-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                  )}
                  aria-pressed={isSelected}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                  {SECTION_LABELS[sectionType]}
                  {isDefault && !isSelected && (
                    <span className="ml-1 text-xs opacity-60" aria-label="(recommended)">•</span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
            {input.selectedSections.length} sections selected
          </p>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={!isFormValid || isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Generating Proposal...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-5 w-5" aria-hidden="true" />
            Generate Proposal
          </>
        )}
      </Button>

      {!isFormValid && (
        <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
          Fill in all required fields (*) to generate your proposal
        </p>
      )}
    </div>
  );
}
