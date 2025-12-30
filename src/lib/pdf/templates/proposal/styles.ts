/**
 * PDF Styles for Proposal Document
 */

import { StyleSheet } from '@react-pdf/renderer';

// Brand colors
export const colors = {
  primary: '#0ea5e9',
  primaryDark: '#0284c7',
  secondary: '#64748b',
  text: '#0f172a',
  textLight: '#475569',
  textMuted: '#94a3b8',
  background: '#ffffff',
  backgroundAlt: '#f8fafc',
  border: '#e2e8f0',
  accent: '#a855f7',
};

export const styles = StyleSheet.create({
  // Page
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 50,
    backgroundColor: colors.background,
    color: colors.text,
  },

  // Cover Page
  coverPage: {
    fontFamily: 'Helvetica',
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: colors.background,
  },
  coverHeader: {
    backgroundColor: colors.primary,
    height: 200,
    padding: 50,
    justifyContent: 'flex-end',
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 10,
  },
  coverSubtitle: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
  },
  coverBody: {
    padding: 50,
    flex: 1,
  },
  coverInfo: {
    marginBottom: 30,
  },
  coverLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  coverValue: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 15,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
  },
  coverCompany: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  coverDate: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 5,
  },

  // Header & Footer
  header: {
    position: 'absolute',
    top: 20,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  headerCompany: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: colors.textMuted,
  },
  pageNumber: {
    fontSize: 9,
    color: colors.textMuted,
  },

  // Table of Contents
  tocTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 30,
  },
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tocItemText: {
    fontSize: 12,
    color: colors.text,
  },
  tocItemPage: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Section
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.6,
    color: colors.text,
  },
  sectionSpacing: {
    marginBottom: 30,
  },

  // Typography
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    color: colors.text,
    marginBottom: 10,
  },
  heading2: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 15,
    marginBottom: 8,
  },
  heading3: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textLight,
    marginTop: 10,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },

  // Lists
  list: {
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  listBullet: {
    width: 15,
    fontSize: 11,
    color: colors.primary,
  },
  listText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.5,
    color: colors.text,
  },

  // Table (for pricing)
  table: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    color: colors.text,
  },
  tableCellHeader: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
  },

  // Watermark
  watermark: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    opacity: 0.5,
    transform: 'rotate(-30deg)',
  },

  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: 20,
  },
});
