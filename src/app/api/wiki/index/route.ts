/**
 * Wiki Index API
 * GET /api/wiki/index - Returns the wiki index with all categories and pages
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const wikiIndexPath = path.join(process.cwd(), 'docs', 'wiki', 'index.json');
    
    if (!fs.existsSync(wikiIndexPath)) {
      return NextResponse.json(
        { success: false, error: 'Wiki index not found' },
        { status: 404 }
      );
    }

    const indexContent = fs.readFileSync(wikiIndexPath, 'utf-8');
    const index = JSON.parse(indexContent);

    return NextResponse.json({
      success: true,
      data: index,
    });
  } catch (error) {
    console.error('Error reading wiki index:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load wiki index' },
      { status: 500 }
    );
  }
}
