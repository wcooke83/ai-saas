'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-secondary dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom heading renderer with anchor links
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-secondary-900 dark:text-secondary-100" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-secondary-900 dark:text-secondary-100" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-secondary-900 dark:text-secondary-100" {...props}>
              {children}
            </h3>
          ),
          // Code blocks
          code: ({ inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Pre blocks (code blocks container)
          pre: ({ children, ...props }) => {
            const codeChild = Array.isArray(children) ? children[0] : children;
            const codeClassName = (codeChild as any)?.props?.className || '';
            const hasHljs = codeClassName.includes('hljs');
            return (
              <pre className={`bg-secondary-900 dark:bg-secondary-950 rounded-lg ${hasHljs ? 'p-0' : 'p-4'} overflow-x-auto my-4`} {...props}>
                {children}
              </pre>
            );
          },
          // Links
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
              {...props}
            >
              {children}
            </a>
          ),
          // Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-primary-500 pl-4 py-2 my-4 bg-secondary-50 dark:bg-secondary-800/50 italic text-secondary-700 dark:text-secondary-300"
              {...props}
            >
              {children}
            </blockquote>
          ),
          // Tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-secondary-50 dark:bg-secondary-800" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-4 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-100" {...props}>
              {children}
            </td>
          ),
          // Lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside my-4 space-y-2 text-secondary-700 dark:text-secondary-300" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside my-4 space-y-2 text-secondary-700 dark:text-secondary-300" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-secondary-700 dark:text-secondary-300" {...props}>
              {children}
            </li>
          ),
          // Paragraphs
          p: ({ children, ...props }) => (
            <p className="my-4 text-secondary-700 dark:text-secondary-300 leading-relaxed" {...props}>
              {children}
            </p>
          ),
          // Horizontal rule
          hr: ({ ...props }) => (
            <hr className="my-8 border-secondary-200 dark:border-secondary-700" {...props} />
          ),
          // Images
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg my-4 max-w-full h-auto"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
