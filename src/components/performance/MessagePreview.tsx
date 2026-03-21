'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, User, Bot } from 'lucide-react';

const TRUNCATE_LENGTH = 200;

interface MessagePreviewProps {
  userMessage: string | null;
  assistantResponse: string | null;
}

function MessageBubble({
  label,
  text,
  icon: Icon,
  borderColor,
}: {
  label: string;
  text: string;
  icon: typeof User;
  borderColor: string;
}) {
  const needsTruncation = text.length > TRUNCATE_LENGTH;
  const [expanded, setExpanded] = useState(false);

  const displayed = expanded || !needsTruncation
    ? text
    : text.slice(0, TRUNCATE_LENGTH) + '...';

  return (
    <div className={`bg-secondary-800/40 rounded border-l-2 ${borderColor}`}>
      <div className="flex items-start gap-2 px-3 py-2">
        <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-secondary-400" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-secondary-400 mb-1">{label}</p>
          <p className="text-xs text-secondary-200 whitespace-pre-wrap break-words leading-relaxed">
            {displayed}
          </p>
          {needsTruncation && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-[10px] text-primary-400 hover:text-primary-300 mt-1 transition-colors"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MessagePreview({ userMessage, assistantResponse }: MessagePreviewProps) {
  if (!userMessage && !assistantResponse) return null;

  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[10px] text-secondary-400 hover:text-secondary-200 transition-colors mb-2"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        Message Preview
      </button>

      {open && (
        <div className="space-y-2">
          {userMessage && (
            <MessageBubble
              label="User"
              text={userMessage}
              icon={User}
              borderColor="border-blue-500/60"
            />
          )}
          {assistantResponse && (
            <MessageBubble
              label="Assistant"
              text={assistantResponse}
              icon={Bot}
              borderColor="border-emerald-500/60"
            />
          )}
        </div>
      )}
    </div>
  );
}
