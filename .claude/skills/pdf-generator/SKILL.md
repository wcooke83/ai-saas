---
name: pdf-generator
description: Generate PDF documents using react-pdf or Puppeteer for complex layouts. Use when creating invoices, reports, contracts, or any downloadable PDF documents.
---

# PDF Generator Skill

Generate PDF documents using react-pdf and Puppeteer for complex layouts.

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
