'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateProposalDocx } from '@/lib/docx/proposal-generator';
import type { ProposalSection, ExportFormat } from '@/types/proposal';
import { Download, FileText, File, FileType, ChevronDown, Loader2 } from 'lucide-react';

interface ExportMenuProps {
  title: string;
  sections: ProposalSection[];
  canExportPDF: boolean;
  canExportDOCX: boolean;
  isPro: boolean;
  branding?: {
    companyName: string;
    primaryColor?: string;
  };
  clientInfo?: {
    clientName: string;
    clientCompany: string;
  };
  senderInfo?: {
    senderName: string;
    senderCompany: string;
  };
  apiEndpoint?: string;
  apiKey?: string;
}

export function ExportMenu({
  title,
  sections,
  canExportPDF,
  canExportDOCX,
  isPro,
  branding,
  clientInfo,
  senderInfo,
  apiEndpoint = '/api/tools/proposal-generator/export',
  apiKey,
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const enabledSections = sections.filter(s => s.isEnabled);

  const handleExport = async (format: ExportFormat) => {
    if (format === 'docx' && !canExportDOCX) return;
    if (format === 'pdf' && !canExportPDF) return;

    setIsExporting(format);
    setIsOpen(false);

    try {
      if (format === 'markdown') {
        // Generate markdown locally
        const markdown = generateMarkdownForPDF(title, enabledSections, branding);
        downloadBlob(new Blob([markdown], { type: 'text/markdown' }), `${sanitizeFilename(title)}.md`);
      } else if (format === 'pdf') {
        // Dynamically import react-pdf to reduce initial bundle size
        const { pdf } = await import('@react-pdf/renderer');
        const { ProposalDocument } = await import('@/lib/pdf/templates/proposal');

        const doc = (
          <ProposalDocument
            title={title}
            sections={enabledSections}
            clientName={clientInfo?.clientName || 'Client'}
            clientCompany={clientInfo?.clientCompany || 'Company'}
            senderName={senderInfo?.senderName || branding?.companyName || 'Sender'}
            senderCompany={senderInfo?.senderCompany || branding?.companyName || 'Company'}
            options={{
              includeCoverPage: true,
              includeTableOfContents: enabledSections.length > 4,
              includePageNumbers: true,
              addWatermark: !isPro,
            }}
          />
        );

        const blob = await pdf(doc).toBlob();
        downloadBlob(blob, `${sanitizeFilename(title)}.pdf`);
      } else if (format === 'docx') {
        // Generate DOCX client-side using docx library
        const blob = await generateProposalDocx({
          title,
          sections: enabledSections,
          clientName: clientInfo?.clientName || 'Client',
          clientCompany: clientInfo?.clientCompany || 'Company',
          senderName: senderInfo?.senderName || branding?.companyName || 'Sender',
          senderCompany: senderInfo?.senderCompany || branding?.companyName || 'Company',
          includeCoverPage: true,
          includeTableOfContents: enabledSections.length > 4,
        });
        downloadBlob(blob, `${sanitizeFilename(title)}.docx`);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleCopyAll = async () => {
    const fullText = enabledSections
      .sort((a, b) => a.order - b.order)
      .map(s => `## ${s.title}\n\n${s.content}`)
      .join('\n\n---\n\n');

    await navigator.clipboard.writeText(`# ${title}\n\n${fullText}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={enabledSections.length === 0}
      >
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Export
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full z-20 mt-2 w-56 rounded-md border p-2 shadow-lg"
            style={{ backgroundColor: 'rgb(var(--modal-bg))', borderColor: 'rgb(var(--modal-border))' }}
          >
            {/* Markdown */}
            <button
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800"
              onClick={() => handleExport('markdown')}
              disabled={!!isExporting}
            >
              <FileText className="h-4 w-4" />
              <div className="flex-1">
                <div>Markdown</div>
                <div className="text-xs text-secondary-400 dark:text-secondary-500">.md file</div>
              </div>
            </button>

            {/* PDF */}
            <button
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-secondary-700 dark:text-secondary-300 ${
                canExportPDF
                  ? 'hover:bg-secondary-50 dark:hover:bg-secondary-800'
                  : 'cursor-not-allowed opacity-50'
              }`}
              onClick={() => handleExport('pdf')}
              disabled={!canExportPDF || !!isExporting}
            >
              <File className="h-4 w-4" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  PDF
                  {!isPro && <Badge variant="secondary" className="text-xs">Watermarked</Badge>}
                </div>
                <div className="text-xs text-secondary-400 dark:text-secondary-500">.pdf file</div>
              </div>
            </button>

            {/* DOCX */}
            <button
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-secondary-700 dark:text-secondary-300 ${
                canExportDOCX
                  ? 'hover:bg-secondary-50 dark:hover:bg-secondary-800'
                  : 'cursor-not-allowed opacity-50'
              }`}
              onClick={() => handleExport('docx')}
              disabled={!canExportDOCX || !!isExporting}
            >
              <FileType className="h-4 w-4" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  Word Document
                  {!canExportDOCX && <Badge variant="secondary" className="text-xs">Pro</Badge>}
                </div>
                <div className="text-xs text-secondary-400 dark:text-secondary-500">.docx file</div>
              </div>
            </button>

            <div className="my-2" style={{ borderTop: '1px solid rgb(var(--modal-border))' }} />

            {/* Copy All */}
            <button
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800"
              onClick={handleCopyAll}
            >
              <FileText className="h-4 w-4" />
              <div>Copy All Text</div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ===================
// HELPERS
// ===================

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateMarkdownForPDF(
  title: string,
  sections: ProposalSection[],
  branding?: { companyName: string }
): string {
  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push('');
  if (branding) {
    lines.push(`**Prepared by ${branding.companyName}**`);
    lines.push('');
  }
  lines.push(`*Generated on ${new Date().toLocaleDateString()}*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  sections
    .sort((a, b) => a.order - b.order)
    .forEach((section) => {
      lines.push(`## ${section.title}`);
      lines.push('');
      lines.push(section.content);
      lines.push('');
      lines.push('---');
      lines.push('');
    });

  return lines.join('\n');
}

