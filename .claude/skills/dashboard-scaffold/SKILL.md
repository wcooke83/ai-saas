---
name: dashboard-scaffold
description: Generate authenticated user dashboards with common SaaS patterns including sidebar navigation, stats cards, and data tables. Use when building user dashboards or admin panels.
---

# Dashboard Scaffold Skill

Generate authenticated user dashboards with common SaaS patterns.

## Arguments
- `product`: Name of the SaaS product
- `--layout`: `sidebar` | `topnav` | `minimal` (default: sidebar)
- `--pages`: Comma-separated list of pages to include

## Pages Available

| Page | Description |
|------|-------------|
| `overview` | Main dashboard with stats cards, recent activity |
| `settings` | User settings, profile, preferences |
| `billing` | Subscription status, usage, invoices |
| `usage` | Usage metrics, charts, limits |
| `history` | Generation/action history with filters |
| `templates` | Saved templates or presets |
| `team` | Team members, invites (if multi-user) |
| `api-keys` | API key management |
| `integrations` | Third-party connections |

Default pages: `overview,history,settings,billing`

## Instructions

When invoked:

1. **Read design system**: Load `src/styles/design-system.ts`

2. **Generate layout structure**:
   ```
   src/app/(dashboard)/
   ├── layout.tsx              # Dashboard layout with sidebar/nav
   ├── page.tsx                # Redirects to /overview
   ├── overview/page.tsx
   ├── settings/page.tsx
   ├── billing/page.tsx
   └── [other pages]/page.tsx

   src/components/dashboard/
   ├── Sidebar.tsx
   ├── Header.tsx
   ├── StatsCard.tsx
   ├── UsageChart.tsx
   └── DataTable.tsx
   ```

3. **Include auth protection**: Wrap with Supabase session check

4. **Use design system tokens**: All components reference design-system.ts

## Component Templates

### Dashboard Layout (Sidebar)
```tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-background-secondary">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Sidebar Component
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  History,
  Settings,
  CreditCard,
  FileText,
  Users,
  Key,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'History', href: '/history', icon: History },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'API Keys', href: '/api-keys', icon: Key },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  user: { email?: string; user_metadata?: { full_name?: string } };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background-primary border-r border-border-light flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border-light">
        <span className="text-xl font-bold text-primary-500">ProductName</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-text-secondary hover:bg-secondary-100 hover:text-text-primary'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border-light">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600">
              {user.email?.[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs text-text-tertiary truncate">{user.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
```

### Stats Card Component
```tsx
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
}

export function StatsCard({ title, value, change, changeLabel, icon: Icon }: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && <TrendingUp className="w-4 h-4 text-success-main" />}
              {isNegative && <TrendingDown className="w-4 h-4 text-error-main" />}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive && 'text-success-main',
                  isNegative && 'text-error-main',
                  !isPositive && !isNegative && 'text-text-secondary'
                )}
              >
                {isPositive && '+'}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-text-tertiary">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-500" />
        </div>
      </div>
    </Card>
  );
}
```

### Overview Page
```tsx
import { createClient } from '@/lib/supabase/server';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card } from '@/components/ui/card';
import { FileText, Zap, Clock, TrendingUp } from 'lucide-react';

export default async function OverviewPage() {
  const supabase = createClient();

  // Fetch user stats
  const { data: stats } = await supabase
    .from('usage')
    .select('*')
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-text-secondary">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Generations"
          value={stats?.total_generations || 0}
          change={12}
          changeLabel="vs last month"
          icon={FileText}
        />
        <StatsCard
          title="Credits Used"
          value={`${stats?.credits_used || 0}/${stats?.credits_limit || 100}`}
          icon={Zap}
        />
        <StatsCard
          title="Avg. Response Time"
          value="1.2s"
          change={-8}
          changeLabel="faster"
          icon={Clock}
        />
        <StatsCard
          title="Success Rate"
          value="99.2%"
          icon={TrendingUp}
        />
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {/* Activity list */}
      </Card>
    </div>
  );
}
```

### Data Table Component
```tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Copy, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onView?: (row: T) => void;
  onCopy?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onView,
  onCopy,
  onDelete,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={String(col.key)}>{col.header}</TableHead>
          ))}
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={String(col.key)}>
                {col.render ? col.render(row[col.key], row) : String(row[col.key])}
              </TableCell>
            ))}
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(row)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </DropdownMenuItem>
                  )}
                  {onCopy && (
                    <DropdownMenuItem onClick={() => onCopy(row)}>
                      <Copy className="w-4 h-4 mr-2" /> Copy
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(row)}
                      className="text-error-main"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Example Usage

```
/dashboard "EmailGenius"
/dashboard "ReportBot" --layout topnav --pages overview,history,templates,billing
/dashboard "ProposalAI" --pages overview,history,team,api-keys,settings,billing
```

## Output Checklist

- [ ] Auth protection on layout
- [ ] Responsive sidebar (collapsible on mobile)
- [ ] Active nav state highlighted
- [ ] User info displayed with sign out
- [ ] Stats cards with loading states
- [ ] Data tables with pagination ready
- [ ] Empty states for no data
- [ ] Breadcrumbs if nested routes
