'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Code,
  Key,
  ArrowRight,
  AlertCircle,
  MessageSquare,
  Info,
  Mail,
  FileText,
  PenTool,
  Megaphone,
  Share2,
  LucideIcon,
  Plug,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { H1 } from '@/components/ui/heading';
import { toolsList } from '@/lib/constants/tools-config';

// Map icon names to actual icon components
const iconMap: Record<string, LucideIcon> = {
  Mail,
  FileText,
  PenTool,
  MessageSquare,
  Megaphone,
  Share2,
};

interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
}

export default function IntegrationsPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchApiKeys() {
      try {
        const response = await fetch('/api/keys');
        if (response.ok) {
          const result = await response.json();
          setApiKeys(result.data || []);
        } else {
          setHasError(true);
          toast.error('Failed to load API keys');
        }
      } catch (err) {
        console.error('Failed to fetch API keys:', err);
        setHasError(true);
        toast.error('Failed to load API keys. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchApiKeys();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
          <Plug className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <H1 variant="dashboard">Integrations</H1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Add AI tools to your website with embed codes or REST API
          </p>
        </div>
      </div>

      {/* API Key Notice */}
      {!hasError && apiKeys.length === 0 && (
        <Card className="border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                  Create an API Key to get started
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  You need an API key to embed tools on your website or use the REST API.
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href="/dashboard/api-keys?return=/dashboard/integrations">
                    <Key className="w-4 h-4 mr-2" />
                    Create API Key
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div className="flex flex-wrap gap-4">
        <Button variant={apiKeys.length === 0 ? 'default' : 'outline'} asChild>
          <Link href="/dashboard/api-keys">
            <Key className="w-4 h-4 mr-2" />
            Manage API Keys
            {apiKeys.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {apiKeys.length}
              </Badge>
            )}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/sdk">
            <Code className="w-4 h-4 mr-2" />
            API Documentation
          </Link>
        </Button>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Available Tools
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {toolsList.map((tool) => {
            const Icon = iconMap[tool.iconName] || Code;
            return (
              <Card
                key={tool.id}
                className="hover:border-primary-300 dark:hover:border-primary-700 transition-colors flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tool.iconBg}`}>
                      <Icon className={`w-5 h-5 ${tool.iconColor}`} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                      <div className="flex gap-2 mt-1" role="list" aria-label="Available integrations">
                        {tool.hasEmbed && (
                          <Badge variant="outline" className="text-xs" role="listitem">
                            Embed
                          </Badge>
                        )}
                        {tool.hasApi && (
                          <Badge variant="outline" className="text-xs" role="listitem">
                            API
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <CardDescription className="flex-1">{tool.description}</CardDescription>
                  {!tool.hasEmbed && tool.noEmbedReason && (
                    <div className="flex items-start gap-2 text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800/50 p-2 rounded">
                      <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{tool.noEmbedReason}</span>
                    </div>
                  )}
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/integrations/${tool.id}`}>
                      View Embed & API Options
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {/* Chatbots Card */}
          <Card className="hover:border-primary-300 dark:hover:border-primary-700 transition-colors flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/50">
                  <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">Custom Chatbots</CardTitle>
                  <div className="flex gap-2 mt-1" role="list" aria-label="Available integrations">
                    <Badge variant="outline" className="text-xs" role="listitem">
                      Embed
                    </Badge>
                    <Badge variant="outline" className="text-xs" role="listitem">
                      API
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 gap-4">
              <CardDescription className="flex-1">
                Build AI chatbots trained on your own knowledge base and deploy them on your website.
              </CardDescription>
              <Button className="w-full" asChild>
                <Link href="/dashboard/chatbots">
                  Manage Chatbots
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
