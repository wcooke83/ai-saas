'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Palette,
  Type,
  Layout,
  MousePointer,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  Check,
  Accessibility,
  Smartphone,
  Code,
  FileText,
  Sparkles,
  Key,
  Mail,
} from 'lucide-react';

const tabs = [
  { id: 'design-system', label: 'Design System', icon: Palette },
  { id: 'components', label: 'UI Components', icon: Layout },
  { id: 'patterns', label: 'Patterns', icon: Code },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
];

export function SDKTabs() {
  const [activeTab, setActiveTab] = useState('design-system');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Copied to clipboard', {
      description: text.length > 50 ? `${text.slice(0, 50)}...` : text,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-secondary-200 dark:border-secondary-800 mb-8 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-t',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:border-secondary-300 dark:hover:border-secondary-600'
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {activeTab === 'design-system' && (
          <div className="space-y-8">
            {/* Colors */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Color Palette
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Primary Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Primary Colors</CardTitle>
                    <CardDescription>Used for CTAs, links, and interactive elements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: 'primary-50', color: 'bg-primary-50', text: 'text-primary-900' },
                        { name: 'primary-100', color: 'bg-primary-100', text: 'text-primary-900' },
                        { name: 'primary-500', color: 'bg-primary-500', text: 'text-white' },
                        { name: 'primary-600', color: 'bg-primary-600', text: 'text-white' },
                        { name: 'primary-700', color: 'bg-primary-700', text: 'text-white' },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className={cn('flex items-center justify-between p-3 rounded-md', item.color, item.text)}
                        >
                          <span className="font-mono text-sm">{item.name}</span>
                          <button
                            onClick={() => copyToClipboard(item.name, item.name)}
                            className="p-1 hover:bg-white/20 rounded"
                            aria-label={`Copy ${item.name}`}
                          >
                            {copied === item.name ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Secondary Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Secondary (Neutral) Colors</CardTitle>
                    <CardDescription>Used for text, borders, and backgrounds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: 'secondary-50', color: 'bg-secondary-50', text: 'text-secondary-900' },
                        { name: 'secondary-100', color: 'bg-secondary-100', text: 'text-secondary-900' },
                        { name: 'secondary-200', color: 'bg-secondary-200', text: 'text-secondary-900' },
                        { name: 'secondary-500', color: 'bg-secondary-500', text: 'text-white' },
                        { name: 'secondary-600', color: 'bg-secondary-600', text: 'text-white' },
                        { name: 'secondary-900', color: 'bg-secondary-900', text: 'text-white' },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className={cn('flex items-center justify-between p-3 rounded-md', item.color, item.text)}
                        >
                          <span className="font-mono text-sm">{item.name}</span>
                          <button
                            onClick={() => copyToClipboard(item.name, item.name)}
                            className="p-1 hover:bg-white/20 rounded"
                            aria-label={`Copy ${item.name}`}
                          >
                            {copied === item.name ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Semantic Colors */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Semantic Colors</CardTitle>
                    <CardDescription>Used for status indicators and feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Success</p>
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded bg-green-50 border border-green-200" />
                          <div className="w-10 h-10 rounded bg-green-500" />
                          <div className="w-10 h-10 rounded bg-green-700" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Warning</p>
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded bg-yellow-50 border border-yellow-200" />
                          <div className="w-10 h-10 rounded bg-yellow-500" />
                          <div className="w-10 h-10 rounded bg-yellow-700" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Error</p>
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded bg-red-50 border border-red-200" />
                          <div className="w-10 h-10 rounded bg-red-500" />
                          <div className="w-10 h-10 rounded bg-red-700" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Info</p>
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200" />
                          <div className="w-10 h-10 rounded bg-blue-500" />
                          <div className="w-10 h-10 rounded bg-blue-700" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Typography */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Typography
              </h2>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <h1 className="text-4xl font-bold">Heading 1</h1>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-4xl font-bold</code>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <h2 className="text-3xl font-bold">Heading 2</h2>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-3xl font-bold</code>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <h3 className="text-2xl font-semibold">Heading 3</h3>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-2xl font-semibold</code>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <h4 className="text-xl font-semibold">Heading 4</h4>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-xl font-semibold</code>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <p className="text-base">Body Text (Base)</p>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-base</code>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <p className="text-sm text-secondary-600">Secondary Text</p>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-sm text-secondary-600</code>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs text-secondary-500">Caption / Helper Text</p>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-xs text-secondary-500</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Spacing */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Spacing Scale
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4">
                    {[1, 2, 3, 4, 6, 8, 12, 16].map((size) => (
                      <div key={size} className="flex flex-col items-center gap-2">
                        <div
                          className="bg-primary-500 rounded"
                          style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
                        />
                        <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">{size}</code>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-4">
                    Use Tailwind spacing utilities: <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded">p-4</code>,{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded">m-6</code>,{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded">gap-8</code>
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-8">
            {/* Buttons */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Buttons
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Button Variants</CardTitle>
                  <CardDescription>Use appropriate variants based on action priority</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <Button>Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="xl">Extra Large</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button disabled>Disabled</Button>
                      <Button>
                        <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                        With Icon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Badges */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Badges</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Form Inputs */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Form Inputs</h2>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="example-input">Input Label</Label>
                      <Input id="example-input" placeholder="Enter text..." />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Helper text goes here</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="example-input-error">Input with Error</Label>
                      <Input
                        id="example-input-error"
                        placeholder="Invalid input"
                        className="border-red-500 focus-visible:ring-red-500"
                        aria-invalid="true"
                        aria-describedby="error-message"
                      />
                      <p id="error-message" className="text-xs text-red-600 dark:text-red-400">This field is required</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="example-textarea">Textarea</Label>
                    <Textarea id="example-textarea" placeholder="Enter longer text..." rows={3} />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Cards */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Cards</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>A simple card with header and content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Card content goes here.</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
                        <Sparkles className="w-4 h-4 text-primary-500" />
                      </div>
                      <CardTitle className="text-lg">Interactive Card</CardTitle>
                    </div>
                    <CardDescription>With hover effect</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Action</Button>
                  </CardContent>
                </Card>
                <Card className="border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20">
                  <CardHeader>
                    <CardTitle>Highlighted Card</CardTitle>
                    <CardDescription>For important content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Featured content here.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Alerts */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Alerts & Feedback</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm">Success! Your changes have been saved.</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400" role="alert">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm">Error: Something went wrong. Please try again.</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm">Warning: This action cannot be undone.</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-400">
                    <Info className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm">Info: Your session will expire in 5 minutes.</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-8">
            {/* Loading States */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Loading States</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skeleton Loading</CardTitle>
                  <CardDescription>Use skeletons to indicate loading content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4" />
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2" />
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-5/6" />
                  </div>
                  <pre className="text-xs bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`<div className="animate-pulse">
  <div className="h-4 bg-secondary-200 rounded w-3/4" />
</div>`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* Empty States */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Empty States</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 border-2 border-dashed border-secondary-200 dark:border-secondary-700 rounded-lg">
                    <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-secondary-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-1">No items yet</h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">Get started by creating your first item</p>
                    <Button>
                      <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                      Create Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Form Patterns */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Form Patterns</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Form with Validation</CardTitle>
                  <CardDescription>Standard form layout with labels, inputs, and validation</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <Label htmlFor="form-name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input id="form-name" placeholder="Enter your name" aria-required="true" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="form-email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input id="form-email" type="email" placeholder="you@example.com" aria-required="true" />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">We&apos;ll never share your email.</p>
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit">Submit</Button>
                      <Button type="button" variant="outline">Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* API Key Display */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Sensitive Data Display</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">API Key Pattern</CardTitle>
                  <CardDescription>Displaying sensitive data with copy functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg border dark:border-secondary-700">
                    <Key className="w-4 h-4 text-secondary-400" aria-hidden="true" />
                    <code className="flex-1 font-mono text-sm">sk_live_•••••••••••••••••</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('sk_live_example_key', 'api-key')}
                    >
                      {copied === 'api-key' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Accessibility Standards
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    We follow WCAG 2.1 AA guidelines. All components must meet these requirements:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Color contrast ratio >= 4.5:1 for normal text',
                      'Color contrast ratio >= 3:1 for large text (18px+ or 14px bold)',
                      'Interactive elements have visible focus states',
                      'Touch targets minimum 44x44px',
                      'Color is not the only indicator of state',
                      'All images have alt text',
                      'Forms have associated labels',
                      'Error messages use aria-live regions',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-secondary-700 dark:text-secondary-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Focus States */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Focus States</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Focus Ring Pattern</CardTitle>
                  <CardDescription>All interactive elements must have visible focus indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Button>Tab to me</Button>
                    <Input placeholder="Or focus here" className="max-w-xs" />
                  </div>
                  <pre className="text-xs bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`// Standard focus ring classes
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2

// For inputs (already included in component)
focus-visible:ring-2 focus-visible:ring-primary-500`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* ARIA Labels */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">ARIA Patterns</h2>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Form Labels</h3>
                    <pre className="text-xs bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`// Always associate labels with inputs
<Label htmlFor="email">Email</Label>
<Input id="email" aria-required="true" />`}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Error Messages</h3>
                    <pre className="text-xs bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`// Announce errors to screen readers
<div role="alert" aria-live="polite">
  Error message here
</div>`}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Icon Buttons</h3>
                    <pre className="text-xs bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`// Always provide accessible names for icon-only buttons
<Button aria-label="Delete item">
  <Trash className="w-4 h-4" aria-hidden="true" />
</Button>`}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Skip Links</h3>
                    <pre className="text-xs bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`// Add skip links for keyboard navigation
<a href="#main-content" className="sr-only focus:not-sr-only ...">
  Skip to main content
</a>`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Mobile */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Mobile Considerations
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {[
                      'Touch targets minimum 44x44px (min-h-[44px] min-w-[44px])',
                      'Adequate spacing between interactive elements',
                      'Responsive layouts that work on all screen sizes',
                      'No horizontal scrolling on mobile viewports',
                      'Forms work with mobile keyboards (correct input types)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-secondary-700 dark:text-secondary-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
