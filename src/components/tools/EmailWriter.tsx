'use client';

import { useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(data.error?.message || 'Failed to generate email');
      }

      setResult(data.data);
      onGenerate?.(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
            <Mail className="h-5 w-5 text-primary-500" />
            Email Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Type & Tone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Type</label>
              <Select
                options={EMAIL_TYPES}
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <Select
                options={EMAIL_TONES}
                value={formData.tone}
                onChange={(e) => updateField('tone', e.target.value)}
              />
            </div>
          </div>

          {/* Sender Info */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name *</label>
            <Input
              placeholder="John Smith"
              value={formData.senderName}
              onChange={(e) => updateField('senderName', e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Role</label>
              <Input
                placeholder="Sales Manager"
                value={formData.senderRole}
                onChange={(e) => updateField('senderRole', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Company</label>
              <Input
                placeholder="Acme Inc"
                value={formData.senderCompany}
                onChange={(e) => updateField('senderCompany', e.target.value)}
              />
            </div>
          </div>

          {/* Recipient Info */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Name *</label>
            <Input
              placeholder="Jane Doe"
              value={formData.recipientName}
              onChange={(e) => updateField('recipientName', e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Role</label>
              <Input
                placeholder="Marketing Director"
                value={formData.recipientRole}
                onChange={(e) => updateField('recipientRole', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Company</label>
              <Input
                placeholder="Tech Corp"
                value={formData.recipientCompany}
                onChange={(e) => updateField('recipientCompany', e.target.value)}
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Purpose of Email *
              <span className="ml-1 text-xs text-secondary-400">
                (min 10 characters)
              </span>
            </label>
            <Textarea
              placeholder="I want to introduce our new product that helps marketing teams save 10 hours per week on reporting..."
              rows={3}
              value={formData.purpose}
              onChange={(e) => updateField('purpose', e.target.value)}
            />
          </div>

          {/* Key Points */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Key Points to Include
              <span className="ml-1 text-xs text-secondary-400">(optional)</span>
            </label>
            <Textarea
              placeholder="• Mention our 30-day free trial&#10;• Reference their recent LinkedIn post&#10;• Highlight case study with similar company"
              rows={3}
              value={formData.keyPoints}
              onChange={(e) => updateField('keyPoints', e.target.value)}
            />
          </div>

          {/* Call to Action */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Desired Call to Action
              <span className="ml-1 text-xs text-secondary-400">(optional)</span>
            </label>
            <Input
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Email
              </>
            )}
          </Button>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Output */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-500" />
              Generated Email
            </CardTitle>
            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
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
                  <label className="text-sm font-medium">Subject Line</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.subject, 'subject')}
                  >
                    {copied === 'subject' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="rounded-md bg-secondary-50 p-3 text-sm">
                  {result.subject}
                </div>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Email Body</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.body, 'body')}
                  >
                    {copied === 'body' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="rounded-md bg-secondary-50 p-4 text-sm whitespace-pre-wrap">
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
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-secondary-400">
              <Mail className="mb-4 h-12 w-12" />
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
