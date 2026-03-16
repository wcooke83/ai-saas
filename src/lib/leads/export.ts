/**
 * CSV Export Utilities for Leads and Conversations
 */

export interface Lead {
  id: string;
  session_id: string;
  form_data: Record<string, string>;
  created_at: string;
}

export interface Conversation {
  id: string;
  session_id: string;
  channel: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

/**
 * Escape a value for CSV format
 * - Wraps in quotes if contains comma, quote, or newline
 * - Doubles quotes to escape them
 */
function escapeCsvValue(value: string): string {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // Check if we need to quote the value
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Double quotes to escape
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Generate CSV content from leads data
 */
export function generateLeadsCsv(leads: Lead[]): string {
  if (leads.length === 0) {
    return '';
  }

  // Collect all unique form field keys
  const allKeys = new Set<string>();
  leads.forEach(lead => {
    Object.keys(lead.form_data).forEach(key => allKeys.add(key));
  });
  const sortedKeys = Array.from(allKeys).sort();

  // Build headers
  const headers = ['ID', 'Session ID', 'Created At', ...sortedKeys.map(key => key.charAt(0).toUpperCase() + key.slice(1))];
  const lines: string[] = [headers.join(',')];

  // Build data rows
  leads.forEach(lead => {
    const row = [
      escapeCsvValue(lead.id),
      escapeCsvValue(lead.session_id),
      escapeCsvValue(lead.created_at),
      ...sortedKeys.map(key => escapeCsvValue(lead.form_data[key] || '')),
    ];
    lines.push(row.join(','));
  });

  return lines.join('\n');
}

/**
 * Generate CSV content from conversations data
 */
export function generateConversationsCsv(conversations: Conversation[]): string {
  if (conversations.length === 0) {
    return '';
  }

  const headers = ['ID', 'Session ID', 'Channel', 'Created At', 'Updated At'];
  const lines: string[] = [headers.join(',')];

  conversations.forEach(conv => {
    const row = [
      escapeCsvValue(conv.id),
      escapeCsvValue(conv.session_id),
      escapeCsvValue(conv.channel),
      escapeCsvValue(conv.created_at),
      escapeCsvValue(conv.updated_at),
    ];
    lines.push(row.join(','));
  });

  return lines.join('\n');
}

/**
 * Trigger a CSV file download
 */
export function downloadCsv(content: string, filename: string): void {
  if (!content) {
    console.warn('No CSV content to download');
    return;
  }

  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}
