/**
 * DOCX Proposal Generator
 * Generates professionally formatted Word documents from proposal sections
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  convertInchesToTwip,
  Header,
  Footer,
  PageNumber,
  ISectionOptions,
} from 'docx';
import type { ProposalSection } from '@/types/proposal';

// Colors
const COLORS = {
  primary: '0ea5e9',
  primaryDark: '0284c7',
  text: '0f172a',
  secondary: '64748b',
  muted: '94a3b8',
};

// Content element types
type ContentElement = Paragraph | Table;

interface ProposalDocxOptions {
  title: string;
  sections: ProposalSection[];
  clientName: string;
  clientCompany: string;
  senderName: string;
  senderCompany: string;
  includeCoverPage?: boolean;
  includeTableOfContents?: boolean;
}

/**
 * Generate a DOCX document from proposal data
 */
export async function generateProposalDocx(options: ProposalDocxOptions): Promise<Blob> {
  const {
    title,
    sections,
    clientName,
    clientCompany,
    senderName,
    senderCompany,
    includeCoverPage = true,
  } = options;

  const enabledSections = sections
    .filter((s) => s.isEnabled)
    .sort((a, b) => a.order - b.order);

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const children: ContentElement[] = [];

  // Cover Page
  if (includeCoverPage) {
    children.push(...createCoverPage(title, clientName, clientCompany, senderName, senderCompany, date));
  }

  // Content Sections
  for (const section of enabledSections) {
    children.push(...createSection(section));
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 24, // 12pt
          },
          paragraph: {
            spacing: { line: 276 }, // 1.15 line spacing
          },
        },
        heading1: {
          run: {
            font: 'Calibri',
            size: 36, // 18pt
            bold: true,
            color: COLORS.primary,
          },
          paragraph: {
            spacing: { before: 400, after: 200 },
          },
        },
        heading2: {
          run: {
            font: 'Calibri',
            size: 28, // 14pt
            bold: true,
            color: COLORS.primaryDark,
          },
          paragraph: {
            spacing: { before: 300, after: 150 },
          },
        },
        heading3: {
          run: {
            font: 'Calibri',
            size: 24, // 12pt
            bold: true,
            color: COLORS.text,
          },
          paragraph: {
            spacing: { before: 200, after: 100 },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            font: 'Calibri',
            size: 24,
          },
          paragraph: {
            spacing: { after: 120, line: 276 },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
                    size: 18,
                    color: COLORS.secondary,
                  }),
                  new TextRun({
                    text: '  |  ',
                    size: 18,
                    color: COLORS.muted,
                  }),
                  new TextRun({
                    text: senderCompany,
                    size: 18,
                    color: COLORS.secondary,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Confidential  |  ',
                    size: 18,
                    color: COLORS.muted,
                  }),
                  new TextRun({
                    children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: COLORS.muted,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children,
      } as ISectionOptions,
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Create cover page elements
 */
function createCoverPage(
  title: string,
  clientName: string,
  clientCompany: string,
  senderName: string,
  senderCompany: string,
  date: string
): Paragraph[] {
  return [
    // Spacer
    new Paragraph({ spacing: { before: 2000 } }),

    // Title
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 72, // 36pt
          color: COLORS.primary,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    // Subtitle
    new Paragraph({
      children: [
        new TextRun({
          text: 'Business Proposal',
          size: 32,
          color: COLORS.secondary,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),

    // Prepared for
    new Paragraph({
      children: [
        new TextRun({
          text: 'Prepared for',
          size: 24,
          color: COLORS.muted,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 600 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: clientName,
          bold: true,
          size: 32,
          color: COLORS.text,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: clientCompany,
          size: 28,
          color: COLORS.secondary,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    // Prepared by
    new Paragraph({
      children: [
        new TextRun({
          text: 'Prepared by',
          size: 24,
          color: COLORS.muted,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: senderName,
          bold: true,
          size: 32,
          color: COLORS.text,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: senderCompany,
          size: 28,
          color: COLORS.secondary,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),

    // Date
    new Paragraph({
      children: [
        new TextRun({
          text: date,
          size: 24,
          color: COLORS.muted,
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    }),

    // Page break
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
}

/**
 * Create section elements from a proposal section
 */
function createSection(section: ProposalSection): ContentElement[] {
  const elements: ContentElement[] = [];

  // Section title
  elements.push(
    new Paragraph({
      text: section.title,
      heading: HeadingLevel.HEADING_1,
    })
  );

  // Parse and add content
  const contentElements = parseMarkdownContent(section.content);
  elements.push(...contentElements);

  // Add spacing after section
  elements.push(new Paragraph({ spacing: { after: 300 } }));

  return elements;
}

/**
 * Parse markdown-like content into DOCX elements
 */
function parseMarkdownContent(content: string): ContentElement[] {
  const elements: ContentElement[] = [];
  const lines = content.split('\n');

  let tableRows: string[][] = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      if (inTable && tableRows.length > 0) {
        elements.push(createTable(tableRows));
        tableRows = [];
        inTable = false;
      }
      continue;
    }

    // Skip mock mode warnings and separators
    if (trimmed.includes('MOCK MODE') || trimmed === '---') {
      continue;
    }

    // Table row
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Skip separator rows (|---|---|)
      if (trimmed.match(/^\|[\s\-:|]+\|$/)) {
        continue;
      }
      inTable = true;
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable && tableRows.length > 0) {
      elements.push(createTable(tableRows));
      tableRows = [];
      inTable = false;
    }

    // Heading 2 (##)
    if (trimmed.startsWith('## ')) {
      elements.push(
        new Paragraph({
          text: trimmed.slice(3),
          heading: HeadingLevel.HEADING_2,
        })
      );
      continue;
    }

    // Heading 3 (###)
    if (trimmed.startsWith('### ')) {
      elements.push(
        new Paragraph({
          text: trimmed.slice(4),
          heading: HeadingLevel.HEADING_3,
        })
      );
      continue;
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(createBulletParagraph(trimmed.slice(2)));
      continue;
    }

    // Numbered list
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      elements.push(createNumberedParagraph(numberedMatch[2]));
      continue;
    }

    // Regular paragraph
    elements.push(createFormattedParagraph(trimmed));
  }

  // Handle remaining table
  if (tableRows.length > 0) {
    elements.push(createTable(tableRows));
  }

  return elements;
}

/**
 * Create a bullet point paragraph
 */
function createBulletParagraph(text: string): Paragraph {
  return new Paragraph({
    children: parseInlineFormatting(text),
    bullet: {
      level: 0,
    },
    spacing: { after: 80 },
  });
}

/**
 * Create a numbered list paragraph
 */
function createNumberedParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: '• ' }),
      ...parseInlineFormatting(text),
    ],
    indent: { left: convertInchesToTwip(0.25) },
    spacing: { after: 80 },
  });
}

/**
 * Create a formatted paragraph with inline styles
 */
function createFormattedParagraph(text: string): Paragraph {
  return new Paragraph({
    children: parseInlineFormatting(text),
    spacing: { after: 120 },
  });
}

/**
 * Parse inline formatting (bold, italic) into TextRuns
 */
function parseInlineFormatting(text: string): TextRun[] {
  const runs: TextRun[] = [];

  // Simple regex-based parsing for **bold** and *italic*
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      runs.push(
        new TextRun({
          text: text.slice(lastIndex, match.index),
        })
      );
    }

    if (match[2]) {
      // Bold (**text**)
      runs.push(
        new TextRun({
          text: match[2],
          bold: true,
        })
      );
    } else if (match[3]) {
      // Italic (*text*)
      runs.push(
        new TextRun({
          text: match[3],
          italics: true,
        })
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    runs.push(
      new TextRun({
        text: text.slice(lastIndex),
      })
    );
  }

  // If no formatting found, return single run
  if (runs.length === 0) {
    runs.push(new TextRun({ text }));
  }

  return runs;
}

/**
 * Create a table from rows
 */
function createTable(rows: string[][]): Table {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: rows.map((cells, rowIndex) =>
      new TableRow({
        children: cells.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      bold: rowIndex === 0,
                      size: 22,
                    }),
                  ],
                  spacing: { before: 60, after: 60 },
                }),
              ],
              shading: rowIndex === 0 ? { fill: 'f1f5f9' } : undefined,
              margins: {
                top: convertInchesToTwip(0.05),
                bottom: convertInchesToTwip(0.05),
                left: convertInchesToTwip(0.1),
                right: convertInchesToTwip(0.1),
              },
            })
        ),
      })
    ),
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
    },
  });
}
