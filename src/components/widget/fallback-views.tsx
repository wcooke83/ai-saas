'use client';

import { useState } from 'react';
import type { WidgetConfig } from '@/lib/chatbots/types';

// ============================================
// TICKET FORM
// ============================================

interface TicketFormProps {
  chatbotId: string;
  config: { showPhone?: boolean; showSubject?: boolean; showPriority?: boolean };
  widgetConfig: WidgetConfig;
  onSuccess: () => void;
}

export function FallbackTicketForm({ chatbotId, config, widgetConfig, onSuccess }: TicketFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputStyle = {
    width: '100%', padding: '8px 12px', fontSize: '13px', border: `1px solid ${widgetConfig.formBorderColor || '#e5e7eb'}`,
    borderRadius: '6px', backgroundColor: widgetConfig.formInputBackgroundColor || '#fff',
    color: widgetConfig.formInputTextColor || '#0f172a', outline: 'none', marginBottom: '10px',
  };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: widgetConfig.formLabelColor || '#0f172a' };

  if (success) {
    return (
      <div className="chat-widget-ticket-success" style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 20 }}>&#10003;</div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: widgetConfig.textColor || '#0f172a' }}>Ticket submitted!</p>
        <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', marginTop: 4 }}>Reference: {success}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Name, email, and message are required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/widget/${chatbotId}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to submit');
      setSuccess(data.data?.reference || 'Submitted');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={labelStyle}>Name *</label>
      <input className="chat-widget-ticket-field" style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required />

      <label style={labelStyle}>Email *</label>
      <input className="chat-widget-ticket-field" style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required />

      {config.showPhone && <>
        <label style={labelStyle}>Phone</label>
        <input className="chat-widget-ticket-field" style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone number" />
      </>}

      {config.showSubject && <>
        <label style={labelStyle}>Subject</label>
        <input className="chat-widget-ticket-field" style={inputStyle} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Subject" />
      </>}

      {config.showPriority && <>
        <label style={labelStyle}>Priority</label>
        <select className="chat-widget-ticket-field" style={{ ...inputStyle, cursor: 'pointer' }} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </>}

      <label style={labelStyle}>Message *</label>
      <textarea className="chat-widget-ticket-field" style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your issue..." required />

      {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }}>{error}</p>}

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
}

export function FallbackContactForm({ chatbotId, widgetConfig, onSuccess }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputStyle = {
    width: '100%', padding: '8px 12px', fontSize: '13px', border: `1px solid ${widgetConfig.formBorderColor || '#e5e7eb'}`,
    borderRadius: '6px', backgroundColor: widgetConfig.formInputBackgroundColor || '#fff',
    color: widgetConfig.formInputTextColor || '#0f172a', outline: 'none', marginBottom: '10px',
  };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: widgetConfig.formLabelColor || '#0f172a' };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 20 }}>&#10003;</div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: widgetConfig.textColor || '#0f172a' }}>Message sent!</p>
        <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', marginTop: 4 }}>We'll get back to you soon.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('All fields are required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/widget/${chatbotId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to submit');
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="chat-widget-contact-submit" onSubmit={handleSubmit}>
      <label style={labelStyle}>Name *</label>
      <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required />

      <label style={labelStyle}>Email *</label>
      <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required />

      <label style={labelStyle}>Message *</label>
      <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Your message..." required />

      {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }}>{error}</p>}

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

  if (!packages || packages.length === 0) {
    return <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', textAlign: 'center' }}>No credit packages available.</p>;
  }

  const handleBuy = async (pkg: typeof packages[0]) => {
    setLoading(pkg.id || pkg.name);
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
        window.open(data.data.checkoutUrl, '_blank');
      }
    } catch (err) {
      console.error('Purchase error:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {packages.map((pkg) => (
        <div key={pkg.id || pkg.name} className="chat-widget-package-card" style={{
          border: `1px solid ${widgetConfig.formBorderColor || '#e5e7eb'}`,
          borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: widgetConfig.textColor || '#0f172a' }}>{pkg.name}</p>
            <p style={{ fontSize: '12px', color: widgetConfig.formDescriptionColor || '#6b7280' }}>{pkg.creditAmount} credits</p>
          </div>
          <button
            className="chat-widget-package-buy"
            onClick={() => handleBuy(pkg)}
            disabled={loading === (pkg.id || pkg.name)}
            style={{
              padding: '6px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer',
              backgroundColor: widgetConfig.primaryColor || '#0ea5e9', color: '#fff',
              fontSize: '13px', fontWeight: 500, opacity: loading === (pkg.id || pkg.name) ? 0.7 : 1,
            }}
          >
            {loading === (pkg.id || pkg.name) ? '...' : `$${(pkg.priceCents / 100).toFixed(2)}`}
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

  // Load articles on mount
  const loadArticles = async (q?: string) => {
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
  };

  if (!loaded) {
    loadArticles();
  }

  const handleSearch = () => {
    setLoaded(false);
    loadArticles(query);
  };

  if (selectedArticle) {
    return (
      <div className="chat-widget-article-detail" style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
        <button
          onClick={() => setSelectedArticle(null)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: widgetConfig.primaryColor || '#0ea5e9', marginBottom: '12px', padding: 0 }}
        >
          &larr; Back to articles
        </button>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: widgetConfig.textColor || '#0f172a', marginBottom: '8px' }}>{selectedArticle.title}</h3>
        <div style={{ fontSize: '13px', lineHeight: 1.6, color: widgetConfig.textColor || '#0f172a' }} dangerouslySetInnerHTML={{ __html: simpleMarkdown(selectedArticle.body) }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div className="chat-widget-articles-search" style={{ padding: '12px 16px', borderBottom: `1px solid ${widgetConfig.formBorderColor || '#e5e7eb'}` }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
        {!loaded ? (
          <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', textAlign: 'center', padding: '20px' }}>Loading...</p>
        ) : articles.length === 0 ? (
          <p style={{ fontSize: '13px', color: widgetConfig.formDescriptionColor || '#6b7280', textAlign: 'center', padding: '20px' }}>{emptyMessage}</p>
        ) : (
          articles.map(article => (
            <div
              key={article.id}
              className="chat-widget-article-card"
              onClick={() => setSelectedArticle(article)}
              style={{
                padding: '10px', borderRadius: '6px', marginBottom: '6px', cursor: 'pointer',
                border: `1px solid ${widgetConfig.formBorderColor || '#e5e7eb'}`,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = widgetConfig.formInputBackgroundColor || '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
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
