# PDF Generator Skill

Generate PDF documents using react-pdf and Puppeteer for complex layouts.

## Trigger
`/pdf-generator` or `/pdf`

## Arguments
- `name`: Template name (e.g., "invoice", "report", "contract")
- `--method`: `react-pdf` | `puppeteer` (default: react-pdf)
- `--type`: `single` | `multi-page` | `dynamic`

## When to Use Each Method

| Method | Best For |
|--------|----------|
| `react-pdf` | Simple documents, invoices, reports with consistent structure |
| `puppeteer` | Complex layouts, charts, existing HTML templates, pixel-perfect rendering |

## Instructions

When invoked:

1. **Generate files**:
   ```
   src/lib/pdf/templates/[name].tsx     # PDF template
   src/app/api/pdf/[name]/route.ts      # Generation endpoint
   ```

2. **Include**:
   - Template with design system colors
   - API route with auth
   - Download/preview options

## React-PDF Templates

### Setup (`src/lib/pdf/setup.ts`)
```typescript
import { Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Inter-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/Inter-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
});

// Design system colors for PDF
export const pdfColors = {
  primary: '#0ea5e9',
  secondary: '#64748b',
  text: {
    primary: '#0f172a',
    secondary: '#475569',
  },
  border: '#e2e8f0',
  background: '#f8fafc',
};

// Common styles
export const pdfStyles = {
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    color: pdfColors.text.primary,
  },
  header: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
  },
  subheader: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
    color: pdfColors.text.primary,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    color: pdfColors.text.secondary,
  },
  table: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: pdfColors.background,
    padding: 8,
    fontWeight: 600,
  },
  tableCell: {
    padding: 8,
    borderBottom: `1px solid ${pdfColors.border}`,
  },
};
```

### Invoice Template (`src/lib/pdf/templates/invoice.tsx`)
```typescript
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { pdfColors } from '../setup';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 40,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: pdfColors.primary,
  },
  invoiceNumber: {
    fontSize: 12,
    color: pdfColors.text.secondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
    color: pdfColors.text.primary,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: pdfColors.text.secondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: pdfColors.text.primary,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: pdfColors.background,
    padding: 10,
    fontWeight: 600,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: pdfColors.border,
  },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: pdfColors.text.secondary,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 600,
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: 700,
    color: pdfColors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: pdfColors.text.secondary,
    fontSize: 9,
  },
});

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: {
    name: string;
    address: string;
    email: string;
  };
  to: {
    name: string;
    company?: string;
    address: string;
    email: string;
  };
  items: InvoiceItem[];
  notes?: string;
}

export function InvoiceTemplate({ data }: { data: InvoiceData }) {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{data.invoiceNumber}</Text>
          </View>
          {/* Add logo here if needed */}
          {/* <Image src="/logo.png" style={styles.logo} /> */}
        </View>

        {/* From / To */}
        <View style={[styles.section, styles.row]}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.value}>{data.from.name}</Text>
            <Text style={styles.value}>{data.from.address}</Text>
            <Text style={styles.value}>{data.from.email}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.value}>{data.to.name}</Text>
            {data.to.company && <Text style={styles.value}>{data.to.company}</Text>}
            <Text style={styles.value}>{data.to.address}</Text>
            <Text style={styles.value}>{data.to.email}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.label}>Invoice Date</Text>
            <Text style={styles.value}>{data.date}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Due Date</Text>
            <Text style={styles.value}>{data.dueDate}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Price</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.colTotal}>${(item.quantity * item.price).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (10%)</Text>
            <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, { borderTopWidth: 1, borderTopColor: pdfColors.border, paddingTop: 8, marginTop: 4 }]}>
            <Text style={styles.grandTotal}>Total</Text>
            <Text style={styles.grandTotal}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={[styles.section, { marginTop: 40 }]}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.value}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business!
        </Text>
      </Page>
    </Document>
  );
}
```

### Report Template (`src/lib/pdf/templates/report.tsx`)
```typescript
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { pdfColors } from '../setup';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
  },
  coverPage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: pdfColors.primary,
    marginBottom: 10,
  },
  coverSubtitle: {
    fontSize: 14,
    color: pdfColors.text.secondary,
    marginBottom: 40,
  },
  coverMeta: {
    fontSize: 10,
    color: pdfColors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: pdfColors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
  pageNumber: {
    fontSize: 10,
    color: pdfColors.text.secondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 20,
    marginBottom: 10,
    color: pdfColors.text.primary,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: pdfColors.text.secondary,
    marginBottom: 10,
  },
  bulletList: {
    marginLeft: 20,
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 15,
    color: pdfColors.primary,
  },
  statCard: {
    backgroundColor: pdfColors.background,
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: pdfColors.primary,
  },
  statLabel: {
    fontSize: 10,
    color: pdfColors.text.secondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statsCol: {
    flex: 1,
  },
});

interface ReportSection {
  title: string;
  content: string;
  bullets?: string[];
}

interface ReportData {
  title: string;
  subtitle?: string;
  date: string;
  author: string;
  stats?: { label: string; value: string }[];
  sections: ReportSection[];
}

export function ReportTemplate({ data }: { data: ReportData }) {
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <Text style={styles.coverTitle}>{data.title}</Text>
        {data.subtitle && <Text style={styles.coverSubtitle}>{data.subtitle}</Text>}
        <Text style={styles.coverMeta}>Prepared by {data.author}</Text>
        <Text style={styles.coverMeta}>{data.date}</Text>
      </Page>

      {/* Content Pages */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{data.title}</Text>
          <Text style={styles.pageNumber}>Page 1</Text>
        </View>

        {/* Stats */}
        {data.stats && (
          <View style={styles.statsRow}>
            {data.stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, styles.statsCol]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sections */}
        {data.sections.map((section, index) => (
          <View key={index}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.paragraph}>{section.content}</Text>
            {section.bullets && (
              <View style={styles.bulletList}>
                {section.bullets.map((bullet, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.paragraph}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}
```

### API Route (`src/app/api/pdf/[template]/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createClient } from '@/lib/supabase/server';
import { APIError, handleAPIError } from '@/lib/api-utils';
import { InvoiceTemplate } from '@/lib/pdf/templates/invoice';
import { ReportTemplate } from '@/lib/pdf/templates/report';

const templates = {
  invoice: InvoiceTemplate,
  report: ReportTemplate,
};

export async function POST(
  req: NextRequest,
  { params }: { params: { template: string } }
) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new APIError('Unauthorized', 401);
    }

    const template = params.template as keyof typeof templates;
    const Template = templates[template];

    if (!Template) {
      throw new APIError('Template not found', 404);
    }

    const data = await req.json();

    // Generate PDF
    const buffer = await renderToBuffer(<Template data={data} />);

    // Return PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${template}-${Date.now()}.pdf"`,
      },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
```

## Puppeteer Templates (Complex PDFs)

### Puppeteer Setup (`src/lib/pdf/puppeteer.ts`)
```typescript
import puppeteer, { Browser } from 'puppeteer';

let browser: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
}

export async function generatePDFFromHTML(
  html: string,
  options?: {
    format?: 'A4' | 'Letter';
    landscape?: boolean;
    margin?: { top?: string; right?: string; bottom?: string; left?: string };
  }
): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: options?.format || 'A4',
    landscape: options?.landscape || false,
    margin: options?.margin || { top: '40px', right: '40px', bottom: '40px', left: '40px' },
    printBackground: true,
  });

  await page.close();

  return Buffer.from(pdf);
}
```

### HTML Template for Puppeteer
```typescript
// src/lib/pdf/templates/complex-report.ts
export function complexReportHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #0f172a;
      line-height: 1.5;
    }

    .page {
      padding: 40px;
      page-break-after: always;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0ea5e9;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .title {
      font-size: 28px;
      font-weight: 700;
      color: #0ea5e9;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #0ea5e9;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #0f172a;
    }

    .chart-placeholder {
      background: #f1f5f9;
      height: 200px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: #f8fafc;
      font-weight: 600;
    }

    .footer {
      position: fixed;
      bottom: 20px;
      left: 40px;
      right: 40px;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="title">${data.title}</div>
      <div>${data.date}</div>
    </div>

    <div class="stats-grid">
      ${data.stats.map((stat: any) => `
        <div class="stat-card">
          <div class="stat-value">${stat.value}</div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <div class="section-title">Summary</div>
      <p>${data.summary}</p>
    </div>

    <div class="section">
      <div class="section-title">Data Table</div>
      <table>
        <thead>
          <tr>
            ${data.tableHeaders.map((h: string) => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.tableRows.map((row: string[]) => `
            <tr>
              ${row.map(cell => `<td>${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="footer">
    Generated on ${new Date().toLocaleDateString()} | Confidential
  </div>
</body>
</html>
  `;
}
```

### Puppeteer API Route
```typescript
// src/app/api/pdf/complex/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePDFFromHTML } from '@/lib/pdf/puppeteer';
import { complexReportHTML } from '@/lib/pdf/templates/complex-report';
import { APIError, handleAPIError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new APIError('Unauthorized', 401);
    }

    const data = await req.json();
    const html = complexReportHTML(data);
    const pdf = await generatePDFFromHTML(html);

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-${Date.now()}.pdf"`,
      },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
```

## Client-Side Download Hook
```typescript
// src/hooks/usePDFDownload.ts
import { useState } from 'react';

export function usePDFDownload() {
  const [loading, setLoading] = useState(false);

  const download = async (template: string, data: any, filename?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pdf/${template}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to generate PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `${template}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF download error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { download, loading };
}
```

## Example Usage

```
/pdf invoice --method react-pdf
/pdf report --method react-pdf --type multi-page
/pdf complex-report --method puppeteer
```

## Checklist

- [ ] Font files in public/fonts (for react-pdf)
- [ ] Templates match design system colors
- [ ] Auth check on API routes
- [ ] Proper error handling
- [ ] File downloads working
- [ ] Puppeteer configured for serverless (if needed)
