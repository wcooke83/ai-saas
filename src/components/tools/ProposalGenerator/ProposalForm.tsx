'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Loader2, FileText, Users, Building, Target, Settings } from 'lucide-react';

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
            <FileText className="h-5 w-5" />
            Proposal Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Proposal Type *</label>
              <Select
                value={input.proposalType}
                onChange={(e) => onProposalTypeChange(e.target.value as ProposalType)}
                options={PROPOSAL_TYPES}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry *</label>
              <Select
                value={input.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                options={INDUSTRIES}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone *</label>
              <Select
                value={input.tone}
                onChange={(e) => updateField('tone', e.target.value)}
                options={PROPOSAL_TONES}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Proposal Title
                <span className="ml-1 text-xs text-secondary-400">(optional)</span>
              </label>
              <Input
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
            <Users className="h-5 w-5" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Name *</label>
              <Input
                value={input.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Company *</label>
              <Input
                value={input.clientCompany}
                onChange={(e) => updateField('clientCompany', e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Client Role
              <span className="ml-1 text-xs text-secondary-400">(optional)</span>
            </label>
            <Input
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
            <Building className="h-5 w-5" />
            Your Company
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name *</label>
              <Input
                value={input.senderName}
                onChange={(e) => updateField('senderName', e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Company *</label>
              <Input
                value={input.senderCompany}
                onChange={(e) => updateField('senderCompany', e.target.value)}
                placeholder="Your Agency Inc"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Your Role
                <span className="ml-1 text-xs text-secondary-400">(optional)</span>
              </label>
              <Input
                value={input.senderRole || ''}
                onChange={(e) => updateField('senderRole', e.target.value)}
                placeholder="Account Manager"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Your Email
                <span className="ml-1 text-xs text-secondary-400">(optional)</span>
              </label>
              <Input
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
            <Target className="h-5 w-5" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Description *</label>
            <Textarea
              value={input.projectDescription}
              onChange={(e) => updateField('projectDescription', e.target.value)}
              placeholder="Describe the project, what the client needs, and any relevant background..."
              rows={4}
            />
            <p className="text-xs text-secondary-400">
              {input.projectDescription.length}/2000 characters (min 20)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Objectives *</label>
            <Textarea
              value={input.objectives}
              onChange={(e) => updateField('objectives', e.target.value)}
              placeholder="What are the key goals and outcomes for this project?"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Timeline
                <span className="ml-1 text-xs text-secondary-400">(optional)</span>
              </label>
              <Input
                value={input.timeline || ''}
                onChange={(e) => updateField('timeline', e.target.value)}
                placeholder="e.g., 3 months, Q1 2025"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Budget Range
                <span className="ml-1 text-xs text-secondary-400">(optional)</span>
              </label>
              <Input
                value={input.budget || ''}
                onChange={(e) => updateField('budget', e.target.value)}
                placeholder="e.g., $10,000 - $25,000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Your Competitive Advantage
              <span className="ml-1 text-xs text-secondary-400">(optional)</span>
            </label>
            <Textarea
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
            <Settings className="h-5 w-5" />
            Sections to Include
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-secondary-500">
            Select which sections to include in your proposal.
            Defaults are based on your proposal type.
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_SECTIONS.map((sectionType) => {
              const isSelected = input.selectedSections.includes(sectionType);
              const isDefault = DEFAULT_SECTIONS_BY_TYPE[input.proposalType].includes(sectionType);

              return (
                <Badge
                  key={sectionType}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-500 hover:bg-primary-600'
                      : 'hover:bg-secondary-100'
                  }`}
                  onClick={() => onToggleSection(sectionType)}
                >
                  {SECTION_LABELS[sectionType]}
                  {isDefault && !isSelected && (
                    <span className="ml-1 text-xs opacity-60">•</span>
                  )}
                </Badge>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-secondary-400">
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
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Proposal...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-5 w-5" />
            Generate Proposal
          </>
        )}
      </Button>

      {!isFormValid && (
        <p className="text-center text-sm text-secondary-400">
          Fill in all required fields (*) to generate your proposal
        </p>
      )}
    </div>
  );
}
