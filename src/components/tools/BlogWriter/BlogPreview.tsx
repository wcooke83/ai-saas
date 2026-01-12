'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  Check,
  Download,
  ArrowLeft,
  RefreshCw,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GeneratedBlogPost } from '@/lib/ai/prompts/blog-writer';

interface BlogPreviewProps {
  post: GeneratedBlogPost;
  onGoBack: () => void;
  onReset: () => void;
  className?: string;
}

export function BlogPreview({ post, onGoBack, onReset, className }: BlogPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [seoExpanded, setSeoExpanded] = useState(true);

  const copyToClipboard = async () => {
    const fullContent = `# ${post.title}\n\n${post.content}`;
    await navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const fullContent = `# ${post.title}\n\n${post.content}`;
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sanitizeFilename(post.title)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* SEO Metadata */}
      <Card>
        <CardHeader className="pb-2">
          <button
            type="button"
            onClick={() => setSeoExpanded(!seoExpanded)}
            className="flex items-center justify-between w-full"
          >
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-primary-500" aria-hidden="true" />
              SEO Metadata
            </CardTitle>
            {seoExpanded ? (
              <ChevronUp className="h-4 w-4 text-secondary-500" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 text-secondary-500" aria-hidden="true" />
            )}
          </button>
        </CardHeader>
        {seoExpanded && (
          <CardContent className="space-y-4 pt-2">
            {/* Meta Description */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400">
                Meta Description ({post.metaDescription.length} characters)
              </p>
              <div className="rounded-md bg-secondary-50 dark:bg-secondary-800 p-3 text-sm text-secondary-700 dark:text-secondary-300">
                {post.metaDescription || 'No meta description generated'}
              </div>
            </div>

            {/* Suggested Title Tags */}
            {post.suggestedTitleTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400">
                  Suggested Title Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.suggestedTitleTags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Blog Post Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-500" aria-hidden="true" />
              {post.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{post.wordCount} words</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Content Preview */}
          <div className="prose prose-sm dark:prose-invert max-w-none rounded-md bg-secondary-50 dark:bg-secondary-800 p-4 overflow-auto max-h-[500px]">
            <MarkdownRenderer content={post.content} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={onGoBack}>
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Edit Outline
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Start Over
        </Button>
        <div className="flex-1" />
        <Button variant="outline" onClick={downloadMarkdown}>
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          Download .md
        </Button>
        <Button onClick={copyToClipboard}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Simple markdown renderer (basic formatting only)
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-lg font-semibold mt-4 mb-2 text-secondary-900 dark:text-secondary-100">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold mt-6 mb-3 text-secondary-900 dark:text-secondary-100">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold mt-6 mb-4 text-secondary-900 dark:text-secondary-100">
          {line.slice(2)}
        </h1>
      );
    }
    // List items
    else if (line.match(/^[-*]\s/)) {
      elements.push(
        <li key={key++} className="ml-4 text-secondary-700 dark:text-secondary-300">
          {formatInlineMarkdown(line.slice(2))}
        </li>
      );
    }
    // Numbered list items
    else if (line.match(/^\d+\.\s/)) {
      const text = line.replace(/^\d+\.\s/, '');
      elements.push(
        <li key={key++} className="ml-4 list-decimal text-secondary-700 dark:text-secondary-300">
          {formatInlineMarkdown(text)}
        </li>
      );
    }
    // Empty lines (paragraph breaks)
    else if (line.trim() === '') {
      elements.push(<br key={key++} />);
    }
    // Regular paragraphs
    else {
      elements.push(
        <p key={key++} className="mb-3 text-secondary-700 dark:text-secondary-300 leading-relaxed">
          {formatInlineMarkdown(line)}
        </p>
      );
    }
  }

  return <>{elements}</>;
}

// Format inline markdown (bold, italic, code)
function formatInlineMarkdown(text: string): React.ReactNode {
  // Handle bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Handle italic
    const italicParts = part.split(/(\*[^*]+\*)/g);
    return italicParts.map((ip, j) => {
      if (ip.startsWith('*') && ip.endsWith('*') && !ip.startsWith('**')) {
        return <em key={`${i}-${j}`}>{ip.slice(1, -1)}</em>;
      }
      // Handle inline code
      const codeParts = ip.split(/(`[^`]+`)/g);
      return codeParts.map((cp, k) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return (
            <code
              key={`${i}-${j}-${k}`}
              className="px-1 py-0.5 bg-secondary-200 dark:bg-secondary-700 rounded text-sm"
            >
              {cp.slice(1, -1)}
            </code>
          );
        }
        return cp;
      });
    });
  });
}

// Sanitize filename
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}
