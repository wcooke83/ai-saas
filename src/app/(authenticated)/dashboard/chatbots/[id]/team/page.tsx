'use client';

import { use, useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Loader2,
  UserCircle2,
  Pencil,
  ShieldOff,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';

interface Assignment {
  id: string;
  agent_id: string;
  agent_name: string | null;
  agent_email: string;
  can_handle_conversations: true;
  can_modify_settings: boolean;
  can_manage_knowledge: boolean;
  can_view_analytics: boolean;
  status: 'active' | 'revoked';
  created_at: string;
}

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function formatAddedDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Added today';
  if (diffDays === 1) return 'Added yesterday';
  if (diffDays < 30) return `Added ${diffDays} days ago`;
  return `Added ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

interface PermissionsState {
  can_modify_settings: boolean;
  can_manage_knowledge: boolean;
  can_view_analytics: boolean;
}

const PERMISSION_LABELS: { key: keyof PermissionsState; label: string; description: string }[] = [
  {
    key: 'can_modify_settings',
    label: 'Modify Settings',
    description: 'Can edit chatbot name, prompt, and configuration',
  },
  {
    key: 'can_manage_knowledge',
    label: 'Manage Knowledge',
    description: 'Can add, edit, and delete knowledge sources',
  },
  {
    key: 'can_view_analytics',
    label: 'View Analytics',
    description: 'Can view conversation analytics and metrics',
  },
];

export default function TeamPage({ params }: TeamPageProps) {
  const { id } = use(params);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Add agent form
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState('');
  const [addPermissions, setAddPermissions] = useState<PermissionsState>({
    can_modify_settings: false,
    can_manage_knowledge: false,
    can_view_analytics: false,
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Edit state: maps assignment id → local permissions being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPermissions, setEditPermissions] = useState<PermissionsState>({
    can_modify_settings: false,
    can_manage_knowledge: false,
    can_view_analytics: false,
  });
  const [editSaving, setEditSaving] = useState(false);

  // Revoke confirm dialog
  const [revokeTarget, setRevokeTarget] = useState<Assignment | null>(null);
  const [revoking, setRevoking] = useState(false);

  const fetchAssignments = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(`/api/chatbots/${id}/agents`, {
        credentials: 'include',
        signal,
      });
      if (!res.ok) throw new Error('Failed to load team members');
      const data = await res.json();
      setAssignments(data.assignments ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      toast.error(err instanceof Error ? err.message : 'Failed to load team');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAssignments(controller.signal);
    return () => controller.abort();
  }, [fetchAssignments]);

  const handleAddAgent = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setAddError('Email is required');
      return;
    }
    setAddSubmitting(true);
    setAddError(null);
    try {
      const res = await fetch(`/api/chatbots/${id}/agents`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, ...addPermissions }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error?.message || data.message || 'Failed to assign agent');
        return;
      }
      setAssignments((prev) => [data.assignment, ...prev]);
      setEmail('');
      setAddPermissions({ can_modify_settings: false, can_manage_knowledge: false, can_view_analytics: false });
      setShowAddForm(false);
      toast.success(`${data.assignment.agent_name ?? trimmedEmail} added to team`);
    } catch {
      setAddError('Something went wrong. Please try again.');
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setEmail('');
    setAddError(null);
    setAddPermissions({ can_modify_settings: false, can_manage_knowledge: false, can_view_analytics: false });
  };

  const startEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setEditPermissions({
      can_modify_settings: assignment.can_modify_settings,
      can_manage_knowledge: assignment.can_manage_knowledge,
      can_view_analytics: assignment.can_view_analytics,
    });
  };

  const handleSaveEdit = async (assignmentId: string) => {
    setEditSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/agents/${assignmentId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPermissions),
      });
      if (!res.ok) throw new Error('Failed to update permissions');
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId ? { ...a, ...editPermissions } : a
        )
      );
      setEditingId(null);
      toast.success('Permissions updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update permissions');
    } finally {
      setEditSaving(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/agents/${revokeTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to revoke access');
      setAssignments((prev) => prev.filter((a) => a.id !== revokeTarget.id));
      toast.success(`Access revoked for ${revokeTarget.agent_name ?? revokeTarget.agent_email}`);
      setRevokeTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to revoke access');
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <ChatbotPageHeader
        chatbotId={id}
        title="Team"
        actions={
          !showAddForm ? (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Agent
            </Button>
          ) : null
        }
      />

      {/* Add agent form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Agent</CardTitle>
            <CardDescription>
              Assign a VocUI account to this chatbot. They will be able to handle conversations from the mobile app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Email input */}
            <div className="space-y-2">
              <Label htmlFor="agent-email">Email address</Label>
              <Input
                id="agent-email"
                type="email"
                placeholder="agent@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (addError) setAddError(null);
                }}
                className={addError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                disabled={addSubmitting}
              />
              {addError && (
                <p className="text-sm text-red-500">{addError}</p>
              )}
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Permissions</Label>

              {/* Handle Conversations — always on */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 opacity-70">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-500"
                  aria-label="Handle Conversations (required)"
                />
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    Handle Conversations
                    <span className="ml-2 text-xs text-secondary-400 dark:text-secondary-500 font-normal">required</span>
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Can view and respond to live conversations in the mobile app
                  </p>
                </div>
              </div>

              {/* Optional permissions */}
              {PERMISSION_LABELS.map(({ key, label, description }) => (
                <div
                  key={key}
                  className="flex items-start gap-3 p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors cursor-pointer"
                  onClick={() =>
                    setAddPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                >
                  <input
                    type="checkbox"
                    checked={addPermissions[key]}
                    onChange={() =>
                      setAddPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
                    disabled={addSubmitting}
                  />
                  <div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{label}</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button onClick={handleAddAgent} disabled={addSubmitting}>
                {addSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Assign Agent
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancelAdd} disabled={addSubmitting}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent list */}
      {assignments.length === 0 ? (
        !showAddForm && (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                No agents assigned yet
              </h3>
              <p className="text-secondary-500 max-w-md text-sm">
                Add an agent to let them handle conversations from the mobile app.
              </p>
              <Button className="mt-6" onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Agent
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const isEditing = editingId === assignment.id;
            const displayName = assignment.agent_name ?? assignment.agent_email;

            return (
              <Card key={assignment.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                        {getInitials(assignment.agent_name, assignment.agent_email)}
                      </span>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      {/* Name + date */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-secondary-900 dark:text-secondary-100 truncate">
                            {displayName}
                          </p>
                          {assignment.agent_name && (
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                              {assignment.agent_email}
                            </p>
                          )}
                          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">
                            {formatAddedDate(assignment.created_at)}
                          </p>
                        </div>

                        {/* Action buttons */}
                        {!isEditing && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(assignment)}
                              className="text-secondary-500 hover:text-secondary-900 dark:hover:text-secondary-100"
                            >
                              <Pencil className="w-4 h-4 mr-1.5" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRevokeTarget(assignment)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <ShieldOff className="w-4 h-4 mr-1.5" />
                              Revoke
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Permission badges (view mode) */}
                      {!isEditing && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            Conversations
                          </Badge>
                          {assignment.can_modify_settings && (
                            <Badge variant="secondary" className="text-xs">
                              Settings
                            </Badge>
                          )}
                          {assignment.can_manage_knowledge && (
                            <Badge variant="secondary" className="text-xs">
                              Knowledge
                            </Badge>
                          )}
                          {assignment.can_view_analytics && (
                            <Badge variant="secondary" className="text-xs">
                              Analytics
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Inline edit form */}
                      {isEditing && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-2">
                            Edit permissions
                          </p>

                          {/* Handle Conversations — always on, disabled */}
                          <div className="flex items-center gap-2.5 opacity-60">
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="h-4 w-4 rounded border-secondary-300 text-primary-500"
                            />
                            <span className="text-sm text-secondary-700 dark:text-secondary-300">
                              Handle Conversations
                              <span className="ml-1.5 text-xs text-secondary-400">(required)</span>
                            </span>
                          </div>

                          {PERMISSION_LABELS.map(({ key, label }) => (
                            <div
                              key={key}
                              className="flex items-center gap-2.5 cursor-pointer"
                              onClick={() =>
                                setEditPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
                              }
                            >
                              <input
                                type="checkbox"
                                checked={editPermissions[key]}
                                onChange={() =>
                                  setEditPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
                                disabled={editSaving}
                              />
                              <span className="text-sm text-secondary-700 dark:text-secondary-300">
                                {label}
                              </span>
                            </div>
                          ))}

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(assignment.id)}
                              disabled={editSaving}
                            >
                              {editSaving ? (
                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              disabled={editSaving}
                            >
                              <X className="w-3.5 h-3.5 mr-1.5" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Revoke confirm dialog */}
      <ConfirmDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => { if (!open) setRevokeTarget(null); }}
        title="Revoke access?"
        description={
          revokeTarget
            ? `${revokeTarget.agent_name ?? revokeTarget.agent_email} will lose access to this chatbot immediately.`
            : undefined
        }
        confirmText="Revoke Access"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleRevoke}
        isLoading={revoking}
      />
    </div>
  );
}
