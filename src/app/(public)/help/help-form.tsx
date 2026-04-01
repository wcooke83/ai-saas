'use client';

import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle } from 'lucide-react';

interface HelpFormProps {
  prefilledSubject?: string;
  /** When 'dark', adjusts text and border colors for use on bg-primary-950 sections */
  variant?: 'light' | 'dark';
}

export function HelpForm({ prefilledSubject = '', variant = 'light' }: HelpFormProps) {
  const isDark = variant === 'dark';
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
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
            <CheckCircle className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600 dark:text-green-400'}`} aria-hidden="true" />
          </div>
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-secondary-900 dark:text-secondary-100'}`}>
          Message sent!
        </h3>
        <p className={`mb-4 ${isDark ? 'text-primary-200/60' : 'text-secondary-600 dark:text-secondary-400'}`}>
          We&apos;ll get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          className={isDark ? 'border-secondary-600 text-white hover:bg-white/10' : ''}
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

  const labelCls = isDark ? 'text-primary-200/80' : '';
  const inputCls = isDark
    ? 'bg-secondary-800/50 border-secondary-700 text-white placeholder:text-secondary-500 focus-visible:ring-primary-500 focus-visible:ring-offset-primary-950'
    : '';
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={nameId} className={labelCls}>Name</Label>
          <Input
            id={nameId}
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputCls}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={emailId} className={labelCls}>Email</Label>
          <Input
            id={emailId}
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputCls}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={subjectId} className={labelCls}>Subject</Label>
        <select
          id={subjectId}
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
            isDark
              ? 'bg-secondary-800/50 border-secondary-700 text-white ring-offset-primary-950'
              : 'border-secondary-200 dark:border-secondary-700 text-secondary-900 dark:text-secondary-100 dark:ring-offset-secondary-900'
          }`}
          style={isDark ? undefined : { backgroundColor: 'rgb(var(--form-element-bg))' }}
          required
        >
          <option value="" className={isDark ? 'bg-secondary-800 text-secondary-400' : ''}>Select a topic</option>
          <option value="general" className={isDark ? 'bg-secondary-800' : ''}>General Question</option>
          <option value="billing" className={isDark ? 'bg-secondary-800' : ''}>Billing & Subscriptions</option>
          <option value="technical" className={isDark ? 'bg-secondary-800' : ''}>Technical Issue</option>
          <option value="feature" className={isDark ? 'bg-secondary-800' : ''}>Feature Request</option>
          <option value="enterprise" className={isDark ? 'bg-secondary-800' : ''}>Enterprise Inquiry</option>
          <option value="other" className={isDark ? 'bg-secondary-800' : ''}>Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={messageId} className={labelCls}>Message</Label>
        <Textarea
          id={messageId}
          placeholder="How can we help you?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`min-h-[140px] ${inputCls}`}
          required
        />
      </div>

      <Button
        type="submit"
        className={`w-full ${isDark ? 'bg-primary-500 hover:bg-primary-600 text-white' : ''}`}
        disabled={isSubmitting}
      >
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
