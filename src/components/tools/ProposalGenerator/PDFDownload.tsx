'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { ProposalDocument } from '@/lib/pdf/templates/proposal';
import type { ProposalSection } from '@/types/proposal';
import { Loader2, FileDown } from 'lucide-react';

interface PDFDownloadProps {
  title: string;
  sections: ProposalSection[];
  clientName: string;
  clientCompany: string;
  senderName: string;
  senderCompany: string;
  disabled?: boolean;
}

export function PDFDownload({
  title,
  sections,
  clientName,
  clientCompany,
  senderName,
  senderCompany,
  disabled = false,
}: PDFDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (disabled || isGenerating) return;

    setIsGenerating(true);

    try {
      const doc = (
        <ProposalDocument
          title={title}
          sections={sections}
          clientName={clientName}
          clientCompany={clientCompany}
          senderName={senderName}
          senderCompany={senderCompany}
          options={{
            includeCoverPage: true,
            includeTableOfContents: sections.filter(s => s.isEnabled).length > 4,
            includePageNumbers: true,
            addWatermark: false,
          }}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitizeFilename(title)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={disabled || isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
        </>
      )}
    </Button>
  );
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50);
}
