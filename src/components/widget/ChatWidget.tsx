'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import type { WidgetConfig, Chatbot } from '@/lib/chatbots/types';

// Map of Google Font names to their URL-friendly versions
const GOOGLE_FONTS: Record<string, string> = {
  'Inter': 'Inter:wght@400;500;600;700',
  'Roboto': 'Roboto:wght@400;500;700',
  'Open Sans': 'Open+Sans:wght@400;500;600;700',
  'Poppins': 'Poppins:wght@400;500;600;700',
  'Lato': 'Lato:wght@400;700',
  'Montserrat': 'Montserrat:wght@400;500;600;700',
  'Nunito': 'Nunito:wght@400;500;600;700',
  'Raleway': 'Raleway:wght@400;500;600;700',
  'Source Sans Pro': 'Source+Sans+Pro:wght@400;600;700',
  'Ubuntu': 'Ubuntu:wght@400;500;700',
  'DM Sans': 'DM+Sans:wght@400;500;600;700',
  'Manrope': 'Manrope:wght@400;500;600;700',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans:wght@400;500;600;700',
  'Playfair Display': 'Playfair+Display:wght@400;500;600;700',
  'Merriweather': 'Merriweather:wght@400;700',
  'Lora': 'Lora:wght@400;500;600;700',
  'Source Serif Pro': 'Source+Serif+Pro:wght@400;600;700',
  'JetBrains Mono': 'JetBrains+Mono:wght@400;500;700',
  'Fira Code': 'Fira+Code:wght@400;500;700',
  'Source Code Pro': 'Source+Code+Pro:wght@400;500;700',
  'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;500;700',
  'Quicksand': 'Quicksand:wght@400;500;600;700',
  'Comfortaa': 'Comfortaa:wght@400;500;700',
  'Varela Round': 'Varela+Round',
};

function extractFontName(fontFamily: string): string | null {
  // Extract the first font name from the font-family string
  const match = fontFamily.match(/^([^,]+)/);
  if (!match) return null;
  return match[1].trim().replace(/['"]/g, '');
}

function loadGoogleFont(fontFamily: string): void {
  const fontName = extractFontName(fontFamily);
  if (!fontName || !GOOGLE_FONTS[fontName]) return;

  const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(fontId)) return; // Already loaded

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS[fontName]}&display=swap`;
  document.head.appendChild(link);
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  chatbotId: string;
  chatbot: Partial<Chatbot>;
  config: WidgetConfig;
}

export function ChatWidget({ chatbotId, chatbot, config }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(config.autoOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Google Font if needed
  useEffect(() => {
    if (config.fontFamily) {
      loadGoogleFont(config.fontFamily);
    }
  }, [config.fontFamily]);

  // Auto-open after delay
  useEffect(() => {
    if (config.autoOpen && config.autoOpenDelay > 0) {
      const timer = setTimeout(() => setIsOpen(true), config.autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [config.autoOpen, config.autoOpenDelay]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0 && chatbot.welcome_message) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: chatbot.welcome_message,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, chatbot.welcome_message]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat/${chatbotId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          session_id: sessionId,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: data.data.message_id || `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, chatbotId, sessionId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Generate CSS from config
  const styles = generateStyles(config);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Chat bubble button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-widget-button"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chat-widget-container">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="chat-widget-header-content">
              {chatbot.logo_url && (
                <img
                  src={chatbot.logo_url}
                  alt={chatbot.name || 'Chat'}
                  className="chat-widget-logo"
                />
              )}
              <span className="chat-widget-title">
                {config.headerText || chatbot.name || 'Chat'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chat-widget-close"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-widget-message chat-widget-message-${message.role}`}
              >
                <div className={`chat-widget-bubble chat-widget-bubble-${message.role}`}>
                  {message.content}
                </div>
                <div className="chat-widget-timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-widget-message chat-widget-message-assistant">
                <div className="chat-widget-bubble chat-widget-bubble-assistant">
                  <div className="chat-widget-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-widget-input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={chatbot.placeholder_text || 'Type your message...'}
              className="chat-widget-input"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="chat-widget-send"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>

          {/* Branding */}
          {config.showBranding && (
            <div className="chat-widget-branding">
              Powered by <a href="/" target="_blank" rel="noopener noreferrer">AI SaaS</a>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function generateStyles(config: WidgetConfig): string {
  const position = config.position || 'bottom-right';
  const [vertical, horizontal] = position.split('-');

  return `
    .chat-widget-button {
      position: fixed;
      ${vertical}: ${config.offsetY}px;
      ${horizontal}: ${config.offsetX}px;
      width: ${config.buttonSize}px;
      height: ${config.buttonSize}px;
      border-radius: 50%;
      background: ${config.primaryColor};
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s, box-shadow 0.2s;
      z-index: 9999;
    }

    .chat-widget-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .chat-widget-container {
      position: fixed;
      ${vertical}: ${config.offsetY}px;
      ${horizontal}: ${config.offsetX}px;
      width: ${config.width}px;
      height: ${config.height}px;
      max-height: calc(100vh - 40px);
      background: ${config.backgroundColor};
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      font-family: ${config.fontFamily};
      font-size: ${config.fontSize}px;
    }

    .chat-widget-header {
      background: ${config.primaryColor};
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chat-widget-header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chat-widget-logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      object-fit: cover;
    }

    .chat-widget-title {
      font-weight: 600;
      font-size: 16px;
    }

    .chat-widget-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .chat-widget-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .chat-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chat-widget-message {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .chat-widget-message-user {
      align-items: flex-end;
    }

    .chat-widget-message-assistant {
      align-items: flex-start;
    }

    .chat-widget-bubble {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 16px;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .chat-widget-bubble-user {
      background: ${config.userBubbleColor};
      color: white;
      border-bottom-right-radius: 4px;
    }

    .chat-widget-bubble-assistant {
      background: ${config.botBubbleColor};
      color: ${config.textColor};
      border-bottom-left-radius: 4px;
    }

    .chat-widget-timestamp {
      font-size: 11px;
      color: #9ca3af;
      padding: 0 8px;
    }

    .chat-widget-typing {
      display: flex;
      gap: 4px;
      padding: 4px 0;
    }

    .chat-widget-typing span {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .chat-widget-typing span:nth-child(1) { animation-delay: 0s; }
    .chat-widget-typing span:nth-child(2) { animation-delay: 0.2s; }
    .chat-widget-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
    }

    .chat-widget-input-container {
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }

    .chat-widget-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 24px;
      font-family: inherit;
      font-size: inherit;
      outline: none;
      transition: border-color 0.2s;
    }

    .chat-widget-input:focus {
      border-color: ${config.primaryColor};
    }

    .chat-widget-input:disabled {
      background: #f9fafb;
    }

    .chat-widget-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${config.primaryColor};
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }

    .chat-widget-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chat-widget-send:not(:disabled):hover {
      opacity: 0.9;
    }

    .chat-widget-branding {
      padding: 8px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }

    .chat-widget-branding a {
      color: ${config.primaryColor};
      text-decoration: none;
    }

    .chat-widget-branding a:hover {
      text-decoration: underline;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    ${config.customCss || ''}
  `;
}
