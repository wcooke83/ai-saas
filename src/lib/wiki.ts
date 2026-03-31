import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface WikiPage {
  id: string;
  title: string;
  description: string;
  file: string;
  order: number;
}

export interface WikiCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  pages: WikiPage[];
}

export interface WikiIndex {
  categories: WikiCategory[];
}

export interface WikiPageData {
  slug: string;
  content: string;
  frontmatter: {
    title: string;
    description: string;
    category: string;
    order: number;
  };
  pageInfo: WikiPage;
  category: {
    id: string;
    title: string;
    icon: string;
  };
  prevPage: WikiPage | null;
  nextPage: WikiPage | null;
}

export function getWikiIndex(): WikiIndex {
  const indexPath = path.join(process.cwd(), 'docs', 'wiki', 'index.json');
  const content = fs.readFileSync(indexPath, 'utf-8');
  return JSON.parse(content) as WikiIndex;
}

export function getWikiPage(slug: string): WikiPageData | null {
  const index = getWikiIndex();

  let pageInfo: WikiPage | null = null;
  let category: WikiCategory | null = null;

  for (const cat of index.categories) {
    const page = cat.pages.find((p) => p.id === slug);
    if (page) {
      pageInfo = page;
      category = cat;
      break;
    }
  }

  if (!pageInfo || !category) {
    return null;
  }

  const filePath = path.join(process.cwd(), 'docs', 'wiki', pageInfo.file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  const sortedPages = [...category.pages].sort((a, b) => a.order - b.order);
  const currentIndex = sortedPages.findIndex((p) => p.id === slug);
  const prevPage = currentIndex > 0 ? sortedPages[currentIndex - 1] : null;
  const nextPage = currentIndex < sortedPages.length - 1 ? sortedPages[currentIndex + 1] : null;

  return {
    slug,
    content,
    frontmatter: frontmatter as WikiPageData['frontmatter'],
    pageInfo,
    category: {
      id: category.id,
      title: category.title,
      icon: category.icon,
    },
    prevPage,
    nextPage,
  };
}

export function getAllWikiSlugs(): string[] {
  const index = getWikiIndex();
  return index.categories.flatMap((cat) => cat.pages.map((p) => p.id));
}
