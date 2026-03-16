/**
 * Wiki Page API
 * GET /api/wiki/[slug] - Returns markdown content and metadata for a specific wiki page
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    
    // Load wiki index to find the file
    const wikiIndexPath = path.join(process.cwd(), 'docs', 'wiki', 'index.json');
    
    if (!fs.existsSync(wikiIndexPath)) {
      return NextResponse.json(
        { success: false, error: 'Wiki index not found' },
        { status: 404 }
      );
    }

    const indexContent = fs.readFileSync(wikiIndexPath, 'utf-8');
    const index = JSON.parse(indexContent);

    // Find the page in the index
    let pageInfo = null;
    let categoryInfo = null;

    for (const category of index.categories) {
      const page = category.pages.find((p: { id: string }) => p.id === slug);
      if (page) {
        pageInfo = page;
        categoryInfo = category;
        break;
      }
    }

    if (!pageInfo) {
      return NextResponse.json(
        { success: false, error: 'Page not found in index' },
        { status: 404 }
      );
    }

    // Read the markdown file
    const filePath = path.join(process.cwd(), 'docs', 'wiki', pageInfo.file);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'Markdown file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    return NextResponse.json({
      success: true,
      data: {
        slug,
        content,
        frontmatter,
        pageInfo,
        category: {
          id: categoryInfo.id,
          title: categoryInfo.title,
          icon: categoryInfo.icon,
        },
      },
    });
  } catch (error) {
    console.error('Error reading wiki page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load wiki page' },
      { status: 500 }
    );
  }
}
