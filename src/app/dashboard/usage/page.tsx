'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Sparkles,
  Mail,
  FileText,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import type { Usage, Generation } from '@/types/database';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function UsagePage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'email' | 'proposal'>('all');

  const router = useRouter();
  const supabase = createClient() as any;

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const [usageResult, generationsResult] = await Promise.all([
        supabase
          .from('usage')
          .select('*')
          .eq('user_id', user.id)
          .order('period_start', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (usageResult.data) {
        setUsage(usageResult.data);
      }

      if (generationsResult.data) {
        setGenerations(generationsResult.data);
      }

      setLoading(false);
    }

    loadData();
  }, [router, supabase]);

  const filteredGenerations = generations.filter((gen) => {
    if (filter === 'all') return true;
    return gen.type === filter;
  });

  const stats = {
    totalGenerations: generations.length,
    emailGenerations: generations.filter((g) => g.type === 'email').length,
    proposalGenerations: generations.filter((g) => g.type === 'proposal').length,
    successRate: generations.length > 0
      ? Math.round((generations.filter((g) => g.status === 'completed').length / generations.length) * 100)
      : 0,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-16 bg-secondary-100 dark:bg-secondary-800 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-secondary-100 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const creditPercentage = usage
    ? (usage.credits_used / usage.credits_limit) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Usage & History</h1>
          <p className="text-secondary-600 dark:text-secondary-400">Track your AI generations and credit usage</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/pricing">
            <ArrowUpRight className="w-4 h-4 mr-2" aria-hidden="true" />
            Upgrade Plan
          </a>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Credits Used</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {usage?.credits_used || 0}
                  <span className="text-sm font-normal text-secondary-500 dark:text-secondary-400">
                    /{usage?.credits_limit || 100}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div
                className="w-full bg-secondary-100 dark:bg-secondary-700 rounded-full h-2"
                role="progressbar"
                aria-valuenow={usage?.credits_used || 0}
                aria-valuemin={0}
                aria-valuemax={usage?.credits_limit || 100}
              >
                <div
                  className={`h-2 rounded-full transition-all ${
                    creditPercentage > 80 ? 'bg-red-500' :
                    creditPercentage > 50 ? 'bg-yellow-500' :
                    'bg-primary-500'
                  }`}
                  style={{ width: `${Math.min(creditPercentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Generations</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.totalGenerations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Emails Generated</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.emailGenerations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Proposals Generated</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{stats.proposalGenerations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Period */}
      {usage && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-secondary-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Current Billing Period</p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {new Date(usage.period_start).toLocaleDateString()} - {new Date(usage.period_end).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Resets in</p>
                <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {Math.max(0, Math.ceil((new Date(usage.period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Generation History
              </CardTitle>
              <CardDescription>Your recent AI generations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-secondary-400" aria-hidden="true" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'email' | 'proposal')}
                className="text-sm border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter generations"
              >
                <option value="all">All Types</option>
                <option value="email">Emails Only</option>
                <option value="proposal">Proposals Only</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredGenerations.length > 0 ? (
            <div className="space-y-3">
              {filteredGenerations.map((gen) => (
                <div
                  key={gen.id}
                  className="flex items-center justify-between p-4 border border-secondary-100 dark:border-secondary-800 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      gen.type === 'email' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {gen.type === 'email' ? (
                        <Mail className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
                      ) : (
                        <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100 capitalize">{gen.type} Generation</p>
                      <div className="flex items-center gap-3 text-sm text-secondary-500 dark:text-secondary-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {formatRelativeTime(gen.created_at)}
                        </span>
                        {gen.duration_ms && (
                          <span>{(gen.duration_ms / 1000).toFixed(1)}s</span>
                        )}
                        <span>{gen.tokens_input + gen.tokens_output} tokens</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      gen.status === 'completed' ? 'success' :
                      gen.status === 'failed' ? 'destructive' :
                      'warning'
                    }
                  >
                    {gen.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-secondary-400" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">No generations yet</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">Start using our AI tools to see your history</p>
              <Button asChild>
                <a href="/tools/email-writer">
                  <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                  Try Email Writer
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
