'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WidgetConfig } from '@/lib/chatbots/types';

// Email regex for client-side validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sanitize HTML to prevent XSS — strips all tags from rendered output
function sanitizeHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '');
}

// ============================================
// TICKET FORM
// ============================================

interface TicketFormProps {
  chatbotId: string;
  config: { showPhone?: boolean; showSubject?: boolean; showPriority?: boolean };
  widgetConfig: WidgetConfig;
  onSuccess: () => void;
  onBack?: () => void;
}

export function FallbackTicketForm({ chatbotId, config, widgetConfig, onSuccess, onBack }: TicketFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const inputStyle = (hasError?: boolean) => ({
    width: '100%', padding: '8px 12px', fontSize: '13px',
    border: `1px solid ${hasError ? '#ef4444' : widgetConfig.formBorderColor || '#e5e7eb'}`,
    borderRadius: '6px', backgroundColor: widgetConfig.formInputBackgroundColor || '#fff',
    color: widgetConfig.formInputTextColor || '#0f172a', outline: 'none', marginBottom: hasError ? '2px' : '10px',
  });
  const labelStyle = { display: 'block' as const, fontSize: '12px', fontWeight: 500 as const, marginBottom: '4px', color: widgetConfig.formLabelColor || '#0f172a' };
  const fieldErrorStyle = { color: '#ef4444', fontSize: '11px', marginBottom: '8px', display: 'block' as const };

  if (success) {
    return (
      <div className="chat-widget-ticket-success" style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 20 }}>&#10003;</div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: widgetConfig.textColor || '#0f172a' }}>Ticket submitted!</p>
        <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', marginTop: 4 }}>Reference: {success}</p>
        {onBack && (
          <button onClick={onBack} style={{ marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: widgetConfig.primaryColor || '#0ea5e9', padding: '8px 16px', minHeight: '44px' }}>
            Back to chat
          </button>
        )}
      </div>
    );
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address';
    if (!form.message.trim()) errors.message = 'Message is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/widget/${chatbotId}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "We couldn't submit your ticket. Please try again.");
      setSuccess(data.data?.reference || 'Submitted');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't submit your ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="ticket-name" style={labelStyle}>Name *</label>
      <input id="ticket-name" className="chat-widget-ticket-field" style={inputStyle(!!fieldErrors.name)} value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFieldErrors(fe => ({ ...fe, name: '' })); }} placeholder="Your name" aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? 'ticket-name-err' : undefined} />
      {fieldErrors.name && <span id="ticket-name-err" style={fieldErrorStyle} role="alert">{fieldErrors.name}</span>}

      <label htmlFor="ticket-email" style={labelStyle}>Email *</label>
      <input id="ticket-email" className="chat-widget-ticket-field" style={inputStyle(!!fieldErrors.email)} type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFieldErrors(fe => ({ ...fe, email: '' })); }} placeholder="your@email.com" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'ticket-email-err' : undefined} />
      {fieldErrors.email && <span id="ticket-email-err" style={fieldErrorStyle} role="alert">{fieldErrors.email}</span>}

      {config.showPhone && <>
        <label htmlFor="ticket-phone" style={labelStyle}>Phone</label>
        <input id="ticket-phone" className="chat-widget-ticket-field" style={inputStyle()} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone number" />
      </>}

      {config.showSubject && <>
        <label htmlFor="ticket-subject" style={labelStyle}>Subject</label>
        <input id="ticket-subject" className="chat-widget-ticket-field" style={inputStyle()} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Subject" />
      </>}

      {config.showPriority && <>
        <label htmlFor="ticket-priority" style={labelStyle}>Priority</label>
        <select id="ticket-priority" className="chat-widget-ticket-field" style={{ ...inputStyle(), cursor: 'pointer' }} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </>}

      <label htmlFor="ticket-message" style={labelStyle}>Message *</label>
      <textarea id="ticket-message" className="chat-widget-ticket-field" style={{ ...inputStyle(!!fieldErrors.message), minHeight: '80px', maxHeight: '200px', resize: 'vertical' as const }} value={form.message} onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setFieldErrors(fe => ({ ...fe, message: '' })); }} placeholder="Describe your issue..." aria-invalid={!!fieldErrors.message} aria-describedby={fieldErrors.message ? 'ticket-msg-err' : undefined} />
      {fieldErrors.message && <span id="ticket-msg-err" style={fieldErrorStyle} role="alert">{fieldErrors.message}</span>}

      {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }} role="alert">{error}</p>}

      <button className="chat-widget-ticket-submit" type="submit" disabled={submitting} style={{
        width: '100%', padding: '10px', border: 'none', borderRadius: '6px', cursor: submitting ? 'not-allowed' : 'pointer',
        backgroundColor: widgetConfig.primaryColor || '#0ea5e9', color: widgetConfig.formSubmitButtonTextColor || '#fff',
        fontSize: '14px', fontWeight: 500, opacity: submitting ? 0.7 : 1,
      }}>
        {submitting ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  );
}

// ============================================
// CONTACT FORM
// ============================================

interface ContactFormProps {
  chatbotId: string;
  widgetConfig: WidgetConfig;
  onSuccess: () => void;
  onBack?: () => void;
}

export function FallbackContactForm({ chatbotId, widgetConfig, onSuccess, onBack }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const inputStyle = (hasError?: boolean) => ({
    width: '100%', padding: '8px 12px', fontSize: '13px',
    border: `1px solid ${hasError ? '#ef4444' : widgetConfig.formBorderColor || '#e5e7eb'}`,
    borderRadius: '6px', backgroundColor: widgetConfig.formInputBackgroundColor || '#fff',
    color: widgetConfig.formInputTextColor || '#0f172a', outline: 'none', marginBottom: hasError ? '2px' : '10px',
  });
  const labelStyle = { display: 'block' as const, fontSize: '12px', fontWeight: 500 as const, marginBottom: '4px', color: widgetConfig.formLabelColor || '#0f172a' };
  const fieldErrorStyle = { color: '#ef4444', fontSize: '11px', marginBottom: '8px', display: 'block' as const };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 20 }}>&#10003;</div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: widgetConfig.textColor || '#0f172a' }}>Message sent!</p>
        <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', marginTop: 4 }}>We'll get back to you soon.</p>
        {onBack && (
          <button onClick={onBack} style={{ marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: widgetConfig.primaryColor || '#0ea5e9', padding: '8px 16px', minHeight: '44px' }}>
            Back to chat
          </button>
        )}
      </div>
    );
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address';
    if (!form.message.trim()) errors.message = 'Message is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/widget/${chatbotId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "We couldn't send your message. Please try again.");
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="chat-widget-contact-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="contact-name" style={labelStyle}>Name *</label>
      <input id="contact-name" style={inputStyle(!!fieldErrors.name)} value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFieldErrors(fe => ({ ...fe, name: '' })); }} placeholder="Your name" aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? 'contact-name-err' : undefined} />
      {fieldErrors.name && <span id="contact-name-err" style={fieldErrorStyle} role="alert">{fieldErrors.name}</span>}

      <label htmlFor="contact-email" style={labelStyle}>Email *</label>
      <input id="contact-email" style={inputStyle(!!fieldErrors.email)} type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFieldErrors(fe => ({ ...fe, email: '' })); }} placeholder="your@email.com" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'contact-email-err' : undefined} />
      {fieldErrors.email && <span id="contact-email-err" style={fieldErrorStyle} role="alert">{fieldErrors.email}</span>}

      <label htmlFor="contact-message" style={labelStyle}>Message *</label>
      <textarea id="contact-message" style={{ ...inputStyle(!!fieldErrors.message), minHeight: '80px', maxHeight: '200px', resize: 'vertical' as const }} value={form.message} onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setFieldErrors(fe => ({ ...fe, message: '' })); }} placeholder="Your message..." aria-invalid={!!fieldErrors.message} aria-describedby={fieldErrors.message ? 'contact-msg-err' : undefined} />
      {fieldErrors.message && <span id="contact-msg-err" style={fieldErrorStyle} role="alert">{fieldErrors.message}</span>}

      {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }} role="alert">{error}</p>}

      <button type="submit" disabled={submitting} style={{
        width: '100%', padding: '10px', border: 'none', borderRadius: '6px', cursor: submitting ? 'not-allowed' : 'pointer',
        backgroundColor: widgetConfig.primaryColor || '#0ea5e9', color: widgetConfig.formSubmitButtonTextColor || '#fff',
        fontSize: '14px', fontWeight: 500, opacity: submitting ? 0.7 : 1,
      }}>
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

// ============================================
// PURCHASE CREDITS
// ============================================

interface PurchaseCreditsProps {
  chatbotId: string;
  packages: Array<{ id?: string; name: string; creditAmount: number; priceCents: number; stripePriceId: string }>;
  widgetConfig: WidgetConfig;
}

export function FallbackPurchaseCredits({ chatbotId, packages, widgetConfig }: PurchaseCreditsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!packages || packages.length === 0) {
    return <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', textAlign: 'center' }}>No credit packages available.</p>;
  }

  const handleBuy = async (pkg: typeof packages[0]) => {
    setLoading(pkg.id || pkg.name);
    setError(null);
    try {
      const res = await fetch(`/api/widget/${chatbotId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to start checkout');
      if (data.data?.checkoutUrl) {
        // Use location.href instead of window.open to avoid popup blockers
        window.location.href = data.data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="chat-widget-purchase-packages" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {error && <p className="chat-widget-purchase-error" style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center', padding: '4px' }} role="alert">{error}</p>}
      {packages.map((pkg) => (
        <div key={pkg.id || pkg.name} className="chat-widget-package-card" style={{
          border: `1px solid ${widgetConfig.formBorderColor || '#e5e7eb'}`,
          borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: widgetConfig.textColor || '#0f172a' }}>{pkg.name}</p>
            <p style={{ fontSize: '12px', color: widgetConfig.formDescriptionColor || '#6b7280' }}>{pkg.creditAmount} additional messages</p>
          </div>
          <button
            className="chat-widget-package-buy"
            onClick={() => handleBuy(pkg)}
            disabled={loading === (pkg.id || pkg.name)}
            aria-label={`Buy ${pkg.name} for $${(pkg.priceCents / 100).toFixed(2)}`}
            style={{
              padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer',
              backgroundColor: widgetConfig.primaryColor || '#0ea5e9', color: '#fff',
              fontSize: '13px', fontWeight: 500, opacity: loading === (pkg.id || pkg.name) ? 0.7 : 1,
              minHeight: '36px',
            }}
          >
            {loading === (pkg.id || pkg.name) ? 'Loading...' : `$${(pkg.priceCents / 100).toFixed(2)}`}
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// HELP ARTICLES
// ============================================

interface HelpArticlesProps {
  chatbotId: string;
  searchPlaceholder: string;
  emptyMessage: string;
  widgetConfig: WidgetConfig;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  body: string;
}

export function FallbackHelpArticles({ chatbotId, searchPlaceholder, emptyMessage, widgetConfig }: HelpArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const loadArticles = useCallback(async (q?: string) => {
    try {
      const url = `/api/widget/${chatbotId}/articles${q ? `?q=${encodeURIComponent(q)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setArticles(data.data?.articles || []);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoaded(true);
    }
  }, [chatbotId]);

  // Load articles on mount
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleSearch = () => {
    setLoaded(false);
    loadArticles(query);
  };

  const handleArticleKeyDown = (e: React.KeyboardEvent, article: Article) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedArticle(article);
    }
  };

  if (selectedArticle) {
    return (
      <div className="chat-widget-article-detail" style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
        <button
          onClick={() => setSelectedArticle(null)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: widgetConfig.primaryColor || '#0ea5e9', marginBottom: '12px', padding: '8px 0', minHeight: '44px' }}
        >
          &larr; Back to articles
        </button>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: widgetConfig.textColor || '#0f172a', marginBottom: '8px' }}>{selectedArticle.title}</h3>
        <div
          style={{ fontSize: '13px', lineHeight: 1.6, color: widgetConfig.textColor || '#0f172a' }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(simpleMarkdown(selectedArticle.body)) }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div className="chat-widget-articles-search" style={{ padding: '12px 16px', borderBottom: `1px solid ${widgetConfig.formBorderColor || '#e5e7eb'}` }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <label htmlFor="article-search" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Search articles</label>
          <input
            id="article-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder={searchPlaceholder}
            style={{
              flex: 1, padding: '8px 12px', fontSize: '13px', border: `1px solid ${widgetConfig.formBorderColor || '#e5e7eb'}`,
              borderRadius: '6px', backgroundColor: widgetConfig.formInputBackgroundColor || '#fff',
              color: widgetConfig.formInputTextColor || '#0f172a', outline: 'none',
            }}
          />
          <button onClick={handleSearch} style={{
            padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer',
            backgroundColor: widgetConfig.primaryColor || '#0ea5e9', color: '#fff', fontSize: '13px',
          }}>
            Search
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }} role="list" aria-label="Help articles">
        {!loaded ? (
          <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', textAlign: 'center', padding: '20px' }}>Loading...</p>
        ) : articles.length === 0 ? (
          <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', textAlign: 'center', padding: '20px' }}>{emptyMessage}</p>
        ) : (
          articles.map(article => (
            <div
              key={article.id}
              className="chat-widget-article-card"
              role="listitem"
              tabIndex={0}
              onClick={() => setSelectedArticle(article)}
              onKeyDown={(e) => handleArticleKeyDown(e, article)}
              style={{
                padding: '10px', borderRadius: '6px', marginBottom: '6px', cursor: 'pointer',
                border: `1px solid ${widgetConfig.formBorderColor || '#e5e7eb'}`,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = widgetConfig.formInputBackgroundColor || '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              onFocus={e => (e.currentTarget.style.background = widgetConfig.formInputBackgroundColor || '#f8fafc')}
              onBlur={e => (e.currentTarget.style.background = 'transparent')}
            >
              <p style={{ fontSize: '14px', fontWeight: 500, color: widgetConfig.textColor || '#0f172a', marginBottom: '2px' }}>{article.title}</p>
              <p style={{ fontSize: '12px', color: widgetConfig.formDescriptionColor || '#6b7280' }}>{article.summary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Simple markdown to HTML for article bodies
function simpleMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h4 style="font-size:14px;font-weight:600;margin:12px 0 4px;">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="font-size:15px;font-weight:600;margin:14px 0 6px;">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 style="font-size:16px;font-weight:600;margin:16px 0 8px;">$1</h2>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:16px;">$1</li>')
    .replace(/\n/g, '<br/>');
}
