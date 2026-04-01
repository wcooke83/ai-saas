'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  Loader2,
  Send,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'What can you help me with?',
  'What services do you offer?',
  'Tell me about yourself.',
];

export function TestStep() {
  const { chatbotId, chatbot, goToStep, completeCurrentStep, loading: ctxLoading } =
    useOnboarding();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [hasReceivedResponse, setHasReceivedResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>(`onboarding_${crypto.randomUUID()}`);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!chatbotId || !text.trim() || sending) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setSending(true);

      const assistantId = crypto.randomUUID();
      // Add an empty assistant message that we'll stream into
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ]);

      try {
        const res = await fetch(`/api/onboarding/${chatbotId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            stream: true,
            session_id: sessionIdRef.current,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || 'Failed to get a response');
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const event = JSON.parse(line);
              if (event.type === 'token') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + event.content }
                      : m
                  )
                );
              } else if (event.type === 'error') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          content:
                            m.content ||
                            'Sorry, I had trouble generating a response. Please try again.',
                        }
                      : m
                  )
                );
              }
            } catch {
              // Ignore malformed JSON lines
            }
          }
        }

        setHasReceivedResponse(true);
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    m.content ||
                    'Sorry, something went wrong. Please try again.',
                }
              : m
          )
        );
      } finally {
        setSending(false);
        inputRef.current?.focus();
      }
    },
    [chatbotId, sending]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleNext = () => {
    completeCurrentStep();
  };

  const chatbotName = chatbot?.name || 'your chatbot';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Test your chatbot
        </h2>
        <p className="mt-1 text-secondary-500 dark:text-secondary-400">
          Try a conversation with {chatbotName}. See how it responds to questions
          using your content.
        </p>
      </div>

      {/* Chat area */}
      <div
        className="rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden"
        style={{ backgroundColor: 'rgb(var(--card-bg))' }}
      >
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: chatbot?.widget_config?.primaryColor || '#0ea5e9' }}
          >
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
            {chatbotName}
          </span>
        </div>

        {/* Messages */}
        <div className="h-[320px] sm:h-[380px] overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                <Sparkles className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Try asking a question
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                  Type your own message or pick a suggestion below
                </p>
              </div>

              {/* Suggested questions */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    disabled={sending}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 motion-safe:transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100'
                )}
              >
                {msg.content || (
                  <span className="inline-flex items-center gap-1 text-secondary-400">
                    <Loader2 className="h-3 w-3 motion-safe:animate-spin" />
                    Thinking...
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions (shown after messages exist too) */}
        {messages.length > 0 && !sending && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.filter(
              (q) => !messages.some((m) => m.role === 'user' && m.content === q)
            ).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                disabled={sending}
                className="px-2.5 py-1 text-xs rounded-full border border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 motion-safe:transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-3 border-t border-secondary-200 dark:border-secondary-700"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 bg-transparent text-sm text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 outline-none disabled:opacity-50"
            autoFocus
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || sending}
            className="shrink-0"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 motion-safe:animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>

      {/* Success callout */}
      {hasReceivedResponse && (
        <div
          className="flex items-center gap-3 p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
          role="status"
          aria-live="polite"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 shrink-0">
            <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Your chatbot is working!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
              Add more knowledge sources later to improve its answers.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col gap-3 pt-2 border-t border-secondary-200 dark:border-secondary-700 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => goToStep(2)} className="self-start">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={handleNext}
            disabled={ctxLoading}
            className="text-sm text-center text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 motion-safe:transition-colors"
          >
            Skip for now
          </button>
          <Button
            onClick={handleNext}
            disabled={ctxLoading}
            size="lg"
            className="w-full sm:w-auto"
          >
            {ctxLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 motion-safe:animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Next: Style your widget
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
