'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Copy,
  Check,
  Mail,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Calendar,
  Target,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type SequenceType,
  type SequenceTone,
  type SequenceLength,
  type GeneratedSequence,
  type SequenceEmail,
  sequenceTypeConfig,
} from '@/lib/ai/prompts/email-sequence';

interface EmailSequenceBuilderProps {
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  onGenerate?: (result: GeneratedSequence) => void;
}

const SEQUENCE_TYPES = Object.entries(sequenceTypeConfig).map(([value, config]) => ({
  value,
  label: config.label,
}));

const SEQUENCE_TONES = [
  { value: 'formal', label: 'Formal' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'persuasive', label: 'Persuasive' },
];

const SEQUENCE_LENGTHS = [
  { value: '3', label: '3 Emails' },
  { value: '5', label: '5 Emails' },
  { value: '7', label: '7 Emails' },
];

export function EmailSequenceBuilder({
  className,
  apiEndpoint = '/api/tools/email-sequence',
  apiKey,
  onGenerate,
}: EmailSequenceBuilderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedSequence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedEmails, setExpandedEmails] = useState<Set<number>>(new Set([0]));

  const formId = useId();

  const [formData, setFormData] = useState({
    type: 'cold-outreach' as SequenceType,
    tone: 'professional' as SequenceTone,
    numberOfEmails: 5 as SequenceLength,
    senderName: '',
    senderRole: '',
    senderCompany: '',
    targetAudience: '',
    targetIndustry: '',
    campaignGoal: '',
    productOrService: '',
    uniqueValue: '',
    painPoints: '',
    callToAction: '',
    additionalContext: '',
  });

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to generate sequence');
      }

      setResult(data.data.sequence);
      setExpandedEmails(new Set([0]));
      onGenerate?.(data.data.sequence);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleEmailExpanded = (emailNumber: number) => {
    setExpandedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(emailNumber)) {
        next.delete(emailNumber);
      } else {
        next.add(emailNumber);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (result) {
      // Use array indices directly since that's what isExpanded and onToggle use
      setExpandedEmails(new Set(result.emails.map((_, index) => index)));
    }
  };

  const collapseAll = () => {
    setExpandedEmails(new Set());
  };

  const exportAsText = () => {
    if (!result) return;

    let text = `Email Sequence: ${sequenceTypeConfig[result.sequenceType].label}\n`;
    text += `Total Emails: ${result.totalEmails}\n`;
    text += `\n${result.summary}\n`;
    text += '\n' + '='.repeat(50) + '\n';

    result.emails.forEach((email) => {
      text += `\nEMAIL ${email.emailNumber} (Day ${email.dayToSend})\n`;
      text += '-'.repeat(30) + '\n';
      text += `Subject: ${email.subject}\n\n`;
      text += email.body + '\n';
      if (email.purpose) {
        text += `\nPurpose: ${email.purpose}\n`;
      }
      text += '\n' + '='.repeat(50) + '\n';
    });

    text += '\nBest Practices:\n';
    result.bestPractices.forEach((tip) => {
      text += `- ${tip}\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-sequence-${result.sequenceType}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    if (!result) return;

    const headers = ['Email #', 'Day', 'Subject', 'Body', 'Purpose'];
    const rows = result.emails.map((email) => [
      email.emailNumber.toString(),
      email.dayToSend.toString(),
      `"${email.subject.replace(/"/g, '""')}"`,
      `"${email.body.replace(/"/g, '""').replace(/\n/g, '\\n')}"`,
      `"${(email.purpose || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-sequence-${result.sequenceType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAllEmails = async () => {
    if (!result) return;

    let text = '';
    result.emails.forEach((email) => {
      text += `--- Email ${email.emailNumber} (Day ${email.dayToSend}) ---\n`;
      text += `Subject: ${email.subject}\n\n`;
      text += email.body + '\n\n';
    });

    await copyToClipboard(text, 'all');
  };

  const isFormValid =
    formData.senderName &&
    formData.targetAudience.length >= 5 &&
    formData.campaignGoal.length >= 10 &&
    formData.productOrService.length >= 3 &&
    formData.uniqueValue.length >= 10;

  const currentTypeConfig = sequenceTypeConfig[formData.type];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Sequence Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sequence Configuration */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor={`${formId}-type`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Sequence Type
              </label>
              <Select
                id={`${formId}-type`}
                options={SEQUENCE_TYPES}
                value={formData.type}
                onChange={(e) => {
                  const newType = e.target.value as SequenceType;
                  updateField('type', newType);
                  updateField('numberOfEmails', sequenceTypeConfig[newType].defaultEmails);
                }}
              />
              <p className="text-xs text-secondary-500">{currentTypeConfig.description}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor={`${formId}-tone`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Tone
              </label>
              <Select
                id={`${formId}-tone`}
                options={SEQUENCE_TONES}
                value={formData.tone}
                onChange={(e) => updateField('tone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={`${formId}-count`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Number of Emails
              </label>
              <Select
                id={`${formId}-count`}
                options={SEQUENCE_LENGTHS}
                value={formData.numberOfEmails.toString()}
                onChange={(e) => updateField('numberOfEmails', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Sender Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Sender Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor={`${formId}-sender-name`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id={`${formId}-sender-name`}
                  placeholder="John Smith"
                  value={formData.senderName}
                  onChange={(e) => updateField('senderName', e.target.value)}
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor={`${formId}-sender-role`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Your Role
                </label>
                <Input
                  id={`${formId}-sender-role`}
                  placeholder="Sales Manager"
                  value={formData.senderRole}
                  onChange={(e) => updateField('senderRole', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor={`${formId}-sender-company`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Your Company
                </label>
                <Input
                  id={`${formId}-sender-company`}
                  placeholder="Acme Inc"
                  value={formData.senderCompany}
                  onChange={(e) => updateField('senderCompany', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Target Audience
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor={`${formId}-audience`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Who are you targeting? <span className="text-red-500">*</span>
                </label>
                <Input
                  id={`${formId}-audience`}
                  placeholder="Marketing directors at B2B SaaS companies"
                  value={formData.targetAudience}
                  onChange={(e) => updateField('targetAudience', e.target.value)}
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor={`${formId}-industry`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Industry
                </label>
                <Input
                  id={`${formId}-industry`}
                  placeholder="Technology, Healthcare, Finance..."
                  value={formData.targetIndustry}
                  onChange={(e) => updateField('targetIndustry', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Campaign Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor={`${formId}-goal`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Campaign Goal <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id={`${formId}-goal`}
                  placeholder="Book demo calls with qualified prospects who struggle with email marketing automation..."
                  rows={2}
                  value={formData.campaignGoal}
                  onChange={(e) => updateField('campaignGoal', e.target.value)}
                  aria-required="true"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor={`${formId}-product`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Product/Service <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id={`${formId}-product`}
                    placeholder="AI-powered email automation platform"
                    value={formData.productOrService}
                    onChange={(e) => updateField('productOrService', e.target.value)}
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor={`${formId}-cta`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Primary CTA
                  </label>
                  <Input
                    id={`${formId}-cta`}
                    placeholder="Schedule a 15-minute demo"
                    value={formData.callToAction}
                    onChange={(e) => updateField('callToAction', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor={`${formId}-value`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Unique Value Proposition <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id={`${formId}-value`}
                  placeholder="Save 10+ hours per week on email campaigns with AI-driven personalization that increases open rates by 40%..."
                  rows={2}
                  value={formData.uniqueValue}
                  onChange={(e) => updateField('uniqueValue', e.target.value)}
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor={`${formId}-pain`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Pain Points to Address
                </label>
                <Textarea
                  id={`${formId}-pain`}
                  placeholder="Low email open rates, time-consuming manual personalization, lack of insights on what works..."
                  rows={2}
                  value={formData.painPoints}
                  onChange={(e) => updateField('painPoints', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor={`${formId}-context`} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Additional Context
                </label>
                <Textarea
                  id={`${formId}-context`}
                  placeholder="We recently won an award for best email tool, mention our free trial offer..."
                  rows={2}
                  value={formData.additionalContext}
                  onChange={(e) => updateField('additionalContext', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Generating Sequence...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                Generate {formData.numberOfEmails}-Email Sequence
              </>
            )}
          </Button>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary-500" aria-hidden="true" />
                  Generated Sequence
                </CardTitle>
                <p className="text-sm text-secondary-500 mt-1">
                  {result.totalEmails} emails over {result.emails[result.emails.length - 1]?.dayToSend || 0} days
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  aria-label="Regenerate sequence"
                >
                  <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} aria-hidden="true" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 p-4">
              <p className="text-sm text-primary-800 dark:text-primary-200">{result.summary}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
              <Button variant="outline" size="sm" onClick={copyAllEmails}>
                {copied === 'all' ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={exportAsText}>
                <Download className="mr-2 h-4 w-4" />
                Export TXT
              </Button>
              <Button variant="outline" size="sm" onClick={exportAsCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {/* Email List */}
            <div className="space-y-3">
              {result.emails.map((email, index) => (
                <EmailCard
                  key={index}
                  email={email}
                  isExpanded={expandedEmails.has(index)}
                  onToggle={() => toggleEmailExpanded(index)}
                  copied={copied}
                  onCopy={copyToClipboard}
                />
              ))}
            </div>

            {/* Best Practices */}
            {result.bestPractices.length > 0 && (
              <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 p-4">
                <h3 className="font-medium mb-2 text-secondary-800 dark:text-secondary-200">Best Practices</h3>
                <ul className="space-y-1 text-sm text-secondary-600 dark:text-secondary-400">
                  {result.bestPractices.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary-500">-</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Email Card Component
function EmailCard({
  email,
  isExpanded,
  onToggle,
  copied,
  onCopy,
}: {
  email: SequenceEmail;
  isExpanded: boolean;
  onToggle: () => void;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const emailId = `email-${email.emailNumber}`;

  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`${emailId}-content`}
      >
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-mono">
            #{email.emailNumber}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-secondary-500">
            <Calendar className="h-3 w-3" />
            Day {email.dayToSend}
          </div>
          <span className="font-medium text-secondary-800 dark:text-secondary-200 text-left">
            {email.subject}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-secondary-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-secondary-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div id={`${emailId}-content`} className="p-4 space-y-4 bg-white dark:bg-secondary-900">
          {/* Subject */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Subject</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(email.subject, `${emailId}-subject`)}
                aria-label="Copy subject"
              >
                {copied === `${emailId}-subject` ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="rounded-md bg-secondary-50 dark:bg-secondary-800 p-3 text-sm">
              {email.subject}
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Body</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(email.body, `${emailId}-body`)}
                aria-label="Copy body"
              >
                {copied === `${emailId}-body` ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="rounded-md bg-secondary-50 dark:bg-secondary-800 p-4 text-sm whitespace-pre-wrap">
              {email.body}
            </div>
          </div>

          {/* Purpose */}
          {email.purpose && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-primary-50 dark:bg-primary-900/20 text-sm">
              <Target className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-primary-700 dark:text-primary-300">Purpose: </span>
                <span className="text-primary-600 dark:text-primary-400">{email.purpose}</span>
              </div>
            </div>
          )}

          {/* Copy Full Email */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onCopy(`Subject: ${email.subject}\n\n${email.body}`, emailId)}
          >
            {copied === emailId ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Full Email
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
