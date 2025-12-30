'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { ProposalSection } from '@/types/proposal';
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Edit3,
  X,
} from 'lucide-react';

interface SectionEditorProps {
  section: ProposalSection;
  isRegenerating: boolean;
  canRegenerate: boolean;
  canReorder: boolean;
  dragProps?: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent<HTMLElement>) => void;
    onDragEnd: () => void;
    onDragOver: (e: React.DragEvent<HTMLElement>) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent<HTMLElement>) => void;
    className: string;
  };
  onContentChange: (content: string) => void;
  onToggle: () => void;
  onRegenerate: (instructions?: string) => void;
}

export function SectionEditor({
  section,
  isRegenerating,
  canRegenerate,
  canReorder,
  dragProps,
  onContentChange,
  onToggle,
  onRegenerate,
}: SectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(section.content);
  const [copied, setCopied] = useState(false);
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);
  const [regenerateInstructions, setRegenerateInstructions] = useState('');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(section.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onContentChange(editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(section.content);
    setIsEditing(false);
  };

  const handleRegenerate = () => {
    onRegenerate(regenerateInstructions || undefined);
    setShowRegenerateInput(false);
    setRegenerateInstructions('');
  };

  return (
    <Card
      className={`transition-all ${
        !section.isEnabled ? 'opacity-50' : ''
      } ${dragProps?.className || ''}`}
      {...(canReorder && dragProps ? {
        draggable: dragProps.draggable,
        onDragStart: dragProps.onDragStart,
        onDragEnd: dragProps.onDragEnd,
        onDragOver: dragProps.onDragOver,
        onDragLeave: dragProps.onDragLeave,
        onDrop: dragProps.onDrop,
      } : {})}
    >
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {canReorder && (
              <GripVertical className="h-5 w-5 cursor-move text-secondary-400" />
            )}
            <h3 className="font-medium">{section.title}</h3>
            {section.isEdited && (
              <Badge variant="secondary" className="text-xs">
                Edited
              </Badge>
            )}
            {section.isRequired && (
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Toggle visibility */}
            {!section.isRequired && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                title={section.isEnabled ? 'Hide section' : 'Show section'}
              >
                {section.isEnabled ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Copy */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              title="Copy section"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            {/* Regenerate */}
            {canRegenerate && section.isEnabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRegenerateInput(!showRegenerateInput)}
                disabled={isRegenerating}
                title="Regenerate section"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`}
                />
              </Button>
            )}

            {/* Edit */}
            {section.isEnabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (isEditing) {
                    handleCancelEdit();
                  } else {
                    setEditContent(section.content);
                    setIsEditing(true);
                  }
                }}
                title={isEditing ? 'Cancel edit' : 'Edit section'}
              >
                {isEditing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit3 className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Expand/Collapse */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && section.isEnabled && (
        <CardContent className="pt-0">
          {/* Regenerate instructions */}
          {showRegenerateInput && (
            <div className="mb-4 space-y-2 rounded-md bg-secondary-50 p-3">
              <label className="text-sm font-medium">
                Regeneration Instructions (optional)
              </label>
              <Textarea
                value={regenerateInstructions}
                onChange={(e) => setRegenerateInstructions(e.target.value)}
                placeholder="e.g., Make it more concise, add more technical details..."
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                >
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowRegenerateInput(false);
                    setRegenerateInstructions('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-secondary-700">
                {section.content}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
