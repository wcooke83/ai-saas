'use client';

import { useState, useEffect, use } from 'react';
import { toast } from 'sonner';
import { Loader2, BookOpen, Trash2, Eye, EyeOff, Globe, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import { ArticleGeneration } from '@/components/chatbots/ArticleGeneration';

interface Article {
  id: string;
  title: string;
  summary: string;
  body: string;
  published: boolean;
  sort_order: number;
  source_url: string | null;
  extraction_prompt_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function ArticlesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sourcesCount, setSourcesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [editForm, setEditForm] = useState({ title: '', summary: '', body: '' });
  const [publishing, setPublishing] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/articles`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.data.articles);
        setSourcesCount(data.data.knowledgeSourcesCount);
      }
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const togglePublished = async (articleId: string, published: boolean) => {
    try {
      const res = await fetch(`/api/chatbots/${id}/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published }),
      });
      if (!res.ok) throw new Error('Failed');
      setArticles(prev => prev.map(a => a.id === articleId ? { ...a, published } : a));
    } catch {
      toast.error('Failed to update');
    }
  };

  const deleteArticle = async (articleId: string, title?: string) => {
    if (!confirm(`Delete article "${title || 'this article'}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/chatbots/${id}/articles/${articleId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setArticles(prev => prev.filter(a => a.id !== articleId));
      toast.success('Article deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const res = await fetch(`/api/chatbots/${id}/articles/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setArticles(prev => prev.map(a => a.id === editing.id ? data.data.article : a));
      setEditing(null);
      toast.success('Article saved');
    } catch {
      toast.error('Failed to save');
    }
  };

  const publishAll = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/articles/publish-all`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed');
      toast.success(data.data?.message || 'All drafts published');
      fetchArticles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const draftCount = articles.filter(a => !a.published).length;

  if (editing) {
    return (
      <div className="space-y-6">
        <button onClick={() => setEditing(null)} className="text-sm text-primary-600 hover:underline">&larr; Back to articles</button>
        <Card>
          <CardHeader>
            <CardTitle>Edit Article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Summary</Label>
              <Input value={editForm.summary} onChange={e => setEditForm(f => ({ ...f, summary: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Body (Markdown)</Label>
              <textarea
                className="w-full min-h-[200px] rounded-md border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 px-3 py-2 text-sm font-mono"
                value={editForm.body}
                onChange={e => setEditForm(f => ({ ...f, body: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveEdit}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ChatbotPageHeader
        chatbotId={id}
        title="Help Articles"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-500">
              {articles.length} articles from {sourcesCount} sources
            </span>
            {draftCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={publishAll}
                disabled={publishing}
              >
                {publishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCheck className="w-4 h-4 mr-2" />}
                Publish All ({draftCount})
              </Button>
            )}
          </div>
        }
      />

      {/* Shared generation controls: URL, prompts, schedule */}
      <ArticleGeneration
        chatbotId={id}
        onGenerated={fetchArticles}
        showKnowledgeGenerate
      />

      {/* Articles List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-secondary-400" /></div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-secondary-300 mb-4" />
            <p className="text-secondary-500">No help articles generated yet</p>
            <p className="text-sm text-secondary-400 mt-1">Generate from your knowledge sources or scrape a website URL above</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map(article => (
            <Card key={article.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium truncate">{article.title}</h3>
                      <Badge variant="outline" className={article.published ? 'text-green-600 border-green-300' : 'text-secondary-500 border-secondary-300'}>
                        {article.published ? 'Published' : 'Draft'}
                      </Badge>
                      {article.source_url && (
                        <Badge variant="outline" className="text-blue-600 border-blue-300 text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          URL
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-secondary-500 truncate">{article.summary}</p>
                    {article.source_url && (
                      <p className="text-xs text-secondary-400 truncate mt-0.5">{article.source_url}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditing(article);
                        setEditForm({ title: article.title, summary: article.summary, body: article.body });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(article.id, !article.published)}
                      title={article.published ? 'Unpublish' : 'Publish'}
                    >
                      {article.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteArticle(article.id, article.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
