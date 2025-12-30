/**
 * Main Proposal PDF Document Component
 */

import { Document, Page, View, Text } from '@react-pdf/renderer';
import { CoverPage } from './CoverPage';
import { Section, TableOfContents } from './SectionPage';
import { styles } from './styles';
import type { ProposalSection } from '@/types/proposal';

interface ProposalDocumentProps {
  title: string;
  sections: ProposalSection[];
  clientName: string;
  clientCompany: string;
  senderName: string;
  senderCompany: string;
  options: {
    includeCoverPage: boolean;
    includeTableOfContents: boolean;
    includePageNumbers: boolean;
    addWatermark: boolean;
  };
  tagline?: string;
}

export function ProposalDocument({
  title,
  sections,
  clientName,
  clientCompany,
  senderName,
  senderCompany,
  options,
  tagline,
}: ProposalDocumentProps) {
  const enabledSections = sections
    .filter((s) => s.isEnabled)
    .sort((a, b) => a.order - b.order);

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate page numbers for TOC (approximate)
  const tocSections = enabledSections.map((section, index) => ({
    title: section.title,
    page: options.includeCoverPage ? index + 3 : index + 2,
  }));

  return (
    <Document>
      {/* Cover Page */}
      {options.includeCoverPage && (
        <CoverPage
          title={title}
          clientName={clientName}
          clientCompany={clientCompany}
          senderName={senderName}
          senderCompany={senderCompany}
          date={date}
          tagline={tagline}
        />
      )}

      {/* Table of Contents */}
      {options.includeTableOfContents && enabledSections.length > 3 && (
        <Page size="A4" style={styles.page}>
          <Header title={title} company={senderCompany} />
          <TableOfContents sections={tocSections} />
          {options.includePageNumbers && (
            <Footer
              text={`${senderCompany} | Confidential`}
              pageNumber={options.includeCoverPage ? 2 : 1}
            />
          )}
        </Page>
      )}

      {/* Content Pages */}
      <Page size="A4" style={styles.page}>
        <Header title={title} company={senderCompany} />

        {enabledSections.map((section, index) => (
          <Section key={section.id} title={section.title} content={section.content} />
        ))}

        {/* Watermark for free tier */}
        {options.addWatermark && (
          <Text style={styles.watermark}>
            Generated with AI SaaS Tools - Free Tier
          </Text>
        )}

        {options.includePageNumbers && (
          <Footer
            text={`${senderCompany} | Confidential`}
            pageNumber={
              options.includeCoverPage
                ? options.includeTableOfContents
                  ? 3
                  : 2
                : 1
            }
          />
        )}
      </Page>
    </Document>
  );
}

function Header({ title, company }: { title: string; company: string }) {
  return (
    <View style={styles.header} fixed>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerCompany}>{company}</Text>
    </View>
  );
}

function Footer({ text, pageNumber }: { text: string; pageNumber: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>{text}</Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber: pn, totalPages }) => `Page ${pn} of ${totalPages}`}
      />
    </View>
  );
}

// Export for use in API routes or client-side rendering
export { CoverPage, Section, TableOfContents };
