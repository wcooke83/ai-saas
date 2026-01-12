'use client';

import { useState, useId } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2,
  Copy,
  Check,
  Mail,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailWriterProps {
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  onGenerate?: (result: GeneratedEmail) => void;
}

interface GeneratedEmail {
  subject: string;
  body: string;
  fullText: string;
}

const EMAIL_TYPES = [
  { value: 'cold-outreach', label: 'Cold Outreach' },
  { value: 'follow-up', label: 'Follow Up' },
  { value: 'introduction', label: 'Introduction' },
  { value: 'thank-you', label: 'Thank You' },
  { value: 'meeting-request', label: 'Meeting Request' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'feedback-request', label: 'Feedback Request' },
];

const EMAIL_TONES = [
  { value: 'formal', label: 'Formal' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
];

export function EmailWriter({
  className,
  apiEndpoint = '/api/tools/email-writer',
  apiKey,
  onGenerate,
}: EmailWriterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<'subject' | 'body' | 'full' | null>(null);
  const [result, setResult] = useState<GeneratedEmail | null>(null);

  // Generate unique IDs for form fields
  const formId = useId();
  const typeId = `${formId}-type`;
  const toneId = `${formId}-tone`;
  const senderNameId = `${formId}-sender-name`;
  const senderRoleId = `${formId}-sender-role`;
  const senderCompanyId = `${formId}-sender-company`;
  const recipientNameId = `${formId}-recipient-name`;
  const recipientRoleId = `${formId}-recipient-role`;
  const recipientCompanyId = `${formId}-recipient-company`;
  const purposeId = `${formId}-purpose`;
  const keyPointsId = `${formId}-key-points`;
  const ctaId = `${formId}-cta`;

  // Form state
  const [formData, setFormData] = useState({
    type: 'cold-outreach',
    tone: 'professional',
    senderName: '',
    senderRole: '',
    senderCompany: '',
    recipientName: '',
    recipientRole: '',
    recipientCompany: '',
    purpose: '',
    keyPoints: '',
    callToAction: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);

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
        throw new Error(data.error?.message || 'Failed to generate email');
      }

      setResult(data.data);
      onGenerate?.(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'subject' | 'body' | 'full') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const isFormValid =
    formData.senderName &&
    formData.recipientName &&
    formData.purpose.length >= 10;

  return (
    <div className={cn('grid gap-6 lg:grid-cols-2', className)}>
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Email Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Type & Tone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={typeId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Email Type
              </label>
              <Select
                id={typeId}
                options={EMAIL_TYPES}
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={toneId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Tone
              </label>
              <Select
                id={toneId}
                options={EMAIL_TONES}
                value={formData.tone}
                onChange={(e) => updateField('tone', e.target.value)}
              />
            </div>
          </div>

          {/* Sender Info */}
          <div className="space-y-2">
            <label htmlFor={senderNameId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Your Name <span className="text-red-500">*</span>
            </label>
            <Input
              id={senderNameId}
              placeholder="John Smith"
              value={formData.senderName}
              onChange={(e) => updateField('senderName', e.target.value)}
              aria-required="true"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={senderRoleId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Your Role
              </label>
              <Input
                id={senderRoleId}
                placeholder="Sales Manager"
                value={formData.senderRole}
                onChange={(e) => updateField('senderRole', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={senderCompanyId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Your Company
              </label>
              <Input
                id={senderCompanyId}
                placeholder="Acme Inc"
                value={formData.senderCompany}
                onChange={(e) => updateField('senderCompany', e.target.value)}
              />
            </div>
          </div>

          {/* Recipient Info */}
          <div className="space-y-2">
            <label htmlFor={recipientNameId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Recipient Name <span className="text-red-500">*</span>
            </label>
            <Input
              id={recipientNameId}
              placeholder="Jane Doe"
              value={formData.recipientName}
              onChange={(e) => updateField('recipientName', e.target.value)}
              aria-required="true"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={recipientRoleId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Recipient Role
              </label>
              <Input
                id={recipientRoleId}
                placeholder="Marketing Director"
                value={formData.recipientRole}
                onChange={(e) => updateField('recipientRole', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={recipientCompanyId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Recipient Company
              </label>
              <Input
                id={recipientCompanyId}
                placeholder="Tech Corp"
                value={formData.recipientCompany}
                onChange={(e) => updateField('recipientCompany', e.target.value)}
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <label htmlFor={purposeId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Purpose of Email <span className="text-red-500">*</span>
              <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">
                (min 10 characters)
              </span>
            </label>
            <Textarea
              id={purposeId}
              placeholder="I want to introduce our new product that helps marketing teams save 10 hours per week on reporting..."
              rows={3}
              value={formData.purpose}
              onChange={(e) => updateField('purpose', e.target.value)}
              aria-required="true"
              aria-describedby={`${purposeId}-hint`}
            />
            <p id={`${purposeId}-hint`} className="text-xs text-secondary-500 dark:text-secondary-400">
              {formData.purpose.length}/10 characters minimum
            </p>
          </div>

          {/* Key Points */}
          <div className="space-y-2">
            <label htmlFor={keyPointsId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Key Points to Include
              <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">(optional)</span>
            </label>
            <Textarea
              id={keyPointsId}
              placeholder="• Mention our 30-day free trial
• Reference their recent LinkedIn post
• Highlight case study with similar company"
              rows={3}
              value={formData.keyPoints}
              onChange={(e) => updateField('keyPoints', e.target.value)}
            />
          </div>

          {/* Call to Action */}
          <div className="space-y-2">
            <label htmlFor={ctaId} className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Desired Call to Action
              <span className="ml-1 text-xs text-secondary-500 dark:text-secondary-400 font-normal">(optional)</span>
            </label>
            <Input
              id={ctaId}
              placeholder="Schedule a 15-minute demo call"
              value={formData.callToAction}
              onChange={(e) => updateField('callToAction', e.target.value)}
            />
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
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                Generate Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-500" aria-hidden="true" />
              Generated Email
            </CardTitle>
            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                disabled={isLoading}
                aria-label="Regenerate email"
              >
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} aria-hidden="true" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              {/* Subject */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Subject Line</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.subject, 'subject')}
                    aria-label={copied === 'subject' ? 'Copied!' : 'Copy subject'}
                  >
                    {copied === 'subject' ? (
                      <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                <div className="rounded-md bg-secondary-50 dark:bg-secondary-800 p-3 text-sm text-secondary-900 dark:text-secondary-100">
                  {result.subject}
                </div>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Email Body</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.body, 'body')}
                    aria-label={copied === 'body' ? 'Copied!' : 'Copy body'}
                  >
                    {copied === 'body' ? (
                      <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                <div className="rounded-md bg-secondary-50 dark:bg-secondary-800 p-4 text-sm text-secondary-900 dark:text-secondary-100 whitespace-pre-wrap">
                  {result.body}
                </div>
              </div>

              {/* Copy Full */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  copyToClipboard(`Subject: ${result.subject}\n\n${result.body}`, 'full')
                }
              >
                {copied === 'full' ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                    Copy Full Email
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-secondary-500 dark:text-secondary-400">
              <Mail className="mb-4 h-12 w-12" aria-hidden="true" />
              <p className="text-sm">
                Fill in the details and click Generate to create your email
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
