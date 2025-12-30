/**
 * PDF Cover Page Component
 */

import { Page, View, Text } from '@react-pdf/renderer';
import { styles, colors } from './styles';

interface CoverPageProps {
  title: string;
  clientName: string;
  clientCompany: string;
  senderName: string;
  senderCompany: string;
  date: string;
  tagline?: string;
}

export function CoverPage({
  title,
  clientName,
  clientCompany,
  senderName,
  senderCompany,
  date,
  tagline,
}: CoverPageProps) {
  return (
    <Page size="A4" style={styles.coverPage}>
      {/* Header with primary color */}
      <View style={styles.coverHeader}>
        <Text style={styles.coverTitle}>{title}</Text>
        {tagline && <Text style={styles.coverSubtitle}>{tagline}</Text>}
      </View>

      {/* Body content */}
      <View style={styles.coverBody}>
        {/* Prepared For */}
        <View style={styles.coverInfo}>
          <Text style={styles.coverLabel}>Prepared For</Text>
          <Text style={styles.coverValue}>{clientName}</Text>
          <Text style={{ ...styles.coverValue, color: colors.textLight }}>
            {clientCompany}
          </Text>
        </View>

        {/* Prepared By */}
        <View style={styles.coverInfo}>
          <Text style={styles.coverLabel}>Prepared By</Text>
          <Text style={styles.coverValue}>{senderName}</Text>
          <Text style={{ ...styles.coverValue, color: colors.textLight }}>
            {senderCompany}
          </Text>
        </View>

        {/* Date */}
        <View style={styles.coverInfo}>
          <Text style={styles.coverLabel}>Date</Text>
          <Text style={styles.coverValue}>{date}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.coverFooter}>
        <Text style={styles.coverCompany}>{senderCompany}</Text>
        <Text style={styles.coverDate}>Confidential</Text>
      </View>
    </Page>
  );
}
