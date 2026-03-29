'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle } from 'lucide-react';

interface HelpFormProps {
  prefilledSubject?: string;
}

export function HelpForm({ prefilledSubject = '' }: HelpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: prefilledSubject,
    message: '',
  });

  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
          Message sent!
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400 mb-4">
          We&apos;ll get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={nameId}>Name</Label>
          <Input
            id={nameId}
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={emailId}>Email</Label>
          <Input
            id={emailId}
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={subjectId}>Subject</Label>
        <select
          id={subjectId}
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="flex h-10 w-full rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 ring-offset-white dark:ring-offset-secondary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
          required
        >
          <option value="">Select a topic</option>
          <option value="general">General Question</option>
          <option value="billing">Billing & Subscriptions</option>
          <option value="technical">Technical Issue</option>
          <option value="feature">Feature Request</option>
          <option value="enterprise">Enterprise Inquiry</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={messageId}>Message</Label>
        <Textarea
          id={messageId}
          placeholder="How can we help you?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="min-h-[120px]"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            Send Message
            <Send className="ml-2 h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
