/**
 * PDF Section Renderer Component
 */

import { View, Text } from '@react-pdf/renderer';
import { styles, colors } from './styles';

interface SectionProps {
  title: string;
  content: string;
}

/**
 * Parse markdown-like content into PDF elements
 */
function parseContent(content: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  const lines = content.split('\n');
  let listItems: string[] = [];
  let inList = false;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <View key={`list-${elements.length}`} style={styles.list}>
          {listItems.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );
      listItems = [];
    }
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      if (inList) flushList();
      continue;
    }

    // Skip mock mode warning
    if (line.includes('MOCK MODE') || line.startsWith('---')) {
      continue;
    }

    // Heading 2 (## or **)
    if (line.startsWith('## ') || (line.startsWith('**') && line.endsWith('**') && line.length > 4)) {
      if (inList) flushList();
      const text = line.replace(/^## /, '').replace(/^\*\*/, '').replace(/\*\*$/, '');
      elements.push(
        <Text key={`h2-${i}`} style={styles.heading2}>
          {text}
        </Text>
      );
      continue;
    }

    // Heading 3 (### or ***)
    if (line.startsWith('### ')) {
      if (inList) flushList();
      const text = line.replace(/^### /, '');
      elements.push(
        <Text key={`h3-${i}`} style={styles.heading3}>
          {text}
        </Text>
      );
      continue;
    }

    // List item (- or * or •)
    if (line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/)) {
      inList = true;
      const text = line.replace(/^[-*•]\s/, '').replace(/^\d+\.\s/, '');
      listItems.push(text);
      continue;
    }

    // Table row (|)
    if (line.startsWith('|') && line.endsWith('|')) {
      if (inList) flushList();
      // Skip table separator rows
      if (line.includes('---')) continue;

      const cells = line
        .split('|')
        .filter(cell => cell.trim())
        .map(cell => cell.trim());

      const isHeader = i > 0 && lines[i + 1]?.includes('---');

      elements.push(
        <View
          key={`row-${i}`}
          style={isHeader ? styles.tableRowHeader : styles.tableRow}
        >
          {cells.map((cell, j) => (
            <Text
              key={j}
              style={isHeader ? styles.tableCellHeader : styles.tableCell}
            >
              {cell.replace(/\*\*/g, '')}
            </Text>
          ))}
        </View>
      );
      continue;
    }

    // Regular paragraph
    if (inList) flushList();

    // Handle inline formatting
    let text = line;
    // Remove markdown bold markers for display
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');

    elements.push(
      <Text key={`p-${i}`} style={styles.paragraph}>
        {text}
      </Text>
    );
  }

  // Flush any remaining list
  if (inList) flushList();

  return elements;
}

export function Section({ title, content }: SectionProps) {
  return (
    <View style={styles.sectionSpacing} wrap={false}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{parseContent(content)}</View>
    </View>
  );
}

export function TableOfContents({
  sections,
}: {
  sections: Array<{ title: string; page: number }>;
}) {
  return (
    <View>
      <Text style={styles.tocTitle}>Table of Contents</Text>
      {sections.map((section, index) => (
        <View key={index} style={styles.tocItem}>
          <Text style={styles.tocItemText}>{section.title}</Text>
          <Text style={styles.tocItemPage}>{section.page}</Text>
        </View>
      ))}
    </View>
  );
}
