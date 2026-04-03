'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  Plus,
  Minus,
  Search,
  Clock,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  AlertTriangle,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserOption {
  id: string;
  email: string;
}

interface CreditAdjustment {
  id: string;
  user_id: string;
  admin_id: string;
  amount: number;
  reason: string;
  effective_at: string;
  created_at: string;
  target_user?: { id: string; email: string };
  admin_user?: { id: string; email: string };
}

interface UsageInfo {
  credits_used: number;
  credits_limit: number;
  period_start: string;
  period_end: string;
}

export default function AdminCreditsPage() {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [adjustments, setAdjustments] = useState<CreditAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [amount, setAmount] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [reason, setReason] = useState('');
  const [effectiveAt, setEffectiveAt] = useState('');
  const [selectedUserUsage, setSelectedUserUsage] = useState<UsageInfo | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const supabase = createClient() as any;

  const loadData = useCallback(async () => {
    setLoading(true);

    // Load users
    const { data: usersData } = await supabase
      .from('profiles')
      .select('id, email')
      .order('email');

    if (usersData) {
      setUsers(usersData);
    }

    // Load recent adjustments
    try {
      const res = await fetch('/api/admin/credits?limit=50');
      const json = await res.json();
      if (json.success && json.data) {
        setAdjustments(json.data);
      }
    } catch (err) {
      console.error('Failed to load adjustments:', err);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load selected user's usage info
  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUserUsage(null);
      return;
    }

    const loadUsage = async () => {
      setLoadingUsage(true);
      const { data } = await supabase
        .from('usage')
        .select('credits_used, credits_limit, period_start, period_end')
        .eq('user_id', selectedUserId)
        .order('period_start', { ascending: false })
        .limit(1)
        .single();

      setSelectedUserUsage(data || null);
      setLoadingUsage(false);
    };

    loadUsage();
  }, [selectedUserId, supabase]);

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSelectUser = (user: UserOption) => {
    setSelectedUserId(user.id);
    setUserSearch(user.email);
    setShowUserDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }
    if (!amount || parseInt(amount) === 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!reason.trim()) {
      setError('Please enter a reason');
      return;
    }

    setSubmitting(true);

    try {
      const finalAmount = adjustmentType === 'add' ? Math.abs(parseInt(amount)) : -Math.abs(parseInt(amount));

      const res = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUserId,
          amount: finalAmount,
          reason: reason.trim(),
          effective_at: effectiveAt || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to create adjustment');
      }

      setSuccess(
        `Successfully ${adjustmentType === 'add' ? 'added' : 'removed'} ${Math.abs(finalAmount).toLocaleString()} credits. New usage: ${json.data.new_credits_used?.toLocaleString() ?? 'N/A'}`
      );

      // Reset form
      setAmount('');
      setReason('');
      setEffectiveAt('');

      // Reload data
      await loadData();

      // Refresh usage for selected user
      if (selectedUserId) {
        const { data } = await supabase
          .from('usage')
          .select('credits_used, credits_limit, period_start, period_end')
          .eq('user_id', selectedUserId)
          .order('period_start', { ascending: false })
          .limit(1)
          .single();
        setSelectedUserUsage(data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create adjustment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
          <Coins className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <H1 variant="dashboard">Credit Adjustments</H1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Manually add or remove credits for users. Adjustments appear in their usage history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adjustment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              New Adjustment
            </CardTitle>
            <CardDescription>
              Add or remove credits from a user&apos;s current billing period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  User
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowUserDropdown(true);
                      if (!e.target.value) setSelectedUserId('');
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    placeholder="Search by email..."
                    className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                {showUserDropdown && userSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.slice(0, 10).map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleSelectUser(user)}
                          className={cn(
                            'w-full text-left px-4 py-2 text-sm hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors',
                            selectedUserId === user.id && 'bg-primary-50 dark:bg-primary-900/30'
                          )}
                        >
                          <span className="text-secondary-900 dark:text-secondary-100">{user.email}</span>
                          <span className="text-secondary-400 text-xs ml-2">{user.id.slice(0, 8)}...</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-secondary-500">No users found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected User Usage Info */}
              {selectedUserId && (
                <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                  {loadingUsage ? (
                    <div className="flex items-center gap-2 text-sm text-secondary-500">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading usage...
                    </div>
                  ) : selectedUserUsage ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-600 dark:text-secondary-400">Current Usage</span>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          {selectedUserUsage.credits_used.toLocaleString()} / {selectedUserUsage.credits_limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all',
                            (selectedUserUsage.credits_used / selectedUserUsage.credits_limit) > 0.9
                              ? 'bg-red-500'
                              : (selectedUserUsage.credits_used / selectedUserUsage.credits_limit) > 0.7
                              ? 'bg-yellow-500'
                              : 'bg-primary-500'
                          )}
                          style={{
                            width: `${Math.min(100, (selectedUserUsage.credits_used / selectedUserUsage.credits_limit) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">
                        Period: {new Date(selectedUserUsage.period_start).toLocaleDateString()} - {new Date(selectedUserUsage.period_end).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-secondary-500">No usage record found for this user</div>
                  )}
                </div>
              )}

              {/* Adjustment Type */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('add')}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors',
                      adjustmentType === 'add'
                        ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    Add Usage
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('remove')}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors',
                      adjustmentType === 'remove'
                        ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                    )}
                  >
                    <Minus className="w-4 h-4" />
                    Credit Back
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Amount (tokens)
                </label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {amount && selectedUserUsage && adjustmentType === 'add' && (
                  <p className="mt-1 text-xs text-secondary-500">
                    New usage will be: {(selectedUserUsage.credits_used + parseInt(amount || '0')).toLocaleString()} / {selectedUserUsage.credits_limit.toLocaleString()}
                    {(selectedUserUsage.credits_used + parseInt(amount || '0')) >= selectedUserUsage.credits_limit && (
                      <span className="text-red-500 font-medium ml-1">(over limit!)</span>
                    )}
                  </p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Reason
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Testing credit limit behavior, Goodwill credit for service issue..."
                  rows={2}
                  className="resize-none"
                />
              </div>

              {/* Effective Date */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Effective Date <span className="text-secondary-400 font-normal">(optional, defaults to now)</span>
                </label>
                <input
                  type="datetime-local"
                  value={effectiveAt}
                  onChange={(e) => setEffectiveAt(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Preview */}
              {selectedUserId && amount && reason && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <p className="font-medium">Confirm Adjustment</p>
                      <p className="mt-1">
                        {adjustmentType === 'add' ? 'Adding' : 'Removing'}{' '}
                        <strong>{parseInt(amount).toLocaleString()} tokens</strong>{' '}
                        {adjustmentType === 'add' ? 'to' : 'from'}{' '}
                        <strong>{userSearch}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error / Success Messages */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                  <X className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || !selectedUserId || !amount || !reason.trim()}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Apply Adjustment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Adjustments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Adjustments
            </CardTitle>
            <CardDescription>
              History of all credit adjustments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adjustments.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {adjustments.map((adj) => (
                  <div
                    key={adj.id}
                    className="flex items-start justify-between p-3 border border-secondary-100 dark:border-secondary-800 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'p-2 rounded-lg mt-0.5',
                          adj.amount > 0
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : 'bg-green-100 dark:bg-green-900/30'
                        )}
                      >
                        {adj.amount > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-secondary-900 dark:text-secondary-100">
                            {adj.amount > 0 ? '+' : ''}{adj.amount.toLocaleString()} tokens
                          </span>
                          <Badge variant={adj.amount > 0 ? 'destructive' : 'success'} className="text-xs">
                            {adj.amount > 0 ? 'Added Usage' : 'Credited Back'}
                          </Badge>
                        </div>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-0.5">
                          {adj.reason}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {adj.target_user?.email || adj.user_id.slice(0, 8) + '...'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {adj.admin_user?.email || 'Admin'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(adj.effective_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-secondary-400" />
                </div>
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">
                  No adjustments yet
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Credit adjustments will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
