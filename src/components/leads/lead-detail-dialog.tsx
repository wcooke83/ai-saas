'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Calendar, Hash, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  session_id: string;
  form_data: Record<string, string>;
  created_at: string;
}

interface LeadDetailDialogProps {
  lead: Lead | null;
  chatbotId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LeadDetailDialog({
  lead,
  chatbotId,
  open,
  onOpenChange,
}: LeadDetailDialogProps) {
  if (!open || !lead) return null;

  const getIconForKey = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('email')) return Mail;
    if (lowerKey.includes('name')) return User;
    if (lowerKey.includes('phone')) return Hash;
    return Hash;
  };

  const entries = Object.entries(lead.form_data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-full">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            Lead Details
          </DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(lead.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Session Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-500">Session ID</span>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {lead.session_id.slice(0, 16)}...
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-500">Submitted</span>
                </div>
                <span className="text-sm font-medium">
                  {formatDate(lead.created_at)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Form Data */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              Form Data
            </h4>
            <div className="grid gap-2">
              {entries.map(([key, value]) => {
                const Icon = getIconForKey(key);
                return (
                  <div
                    key={key}
                    className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg"
                  >
                    <div className="p-1.5 bg-white dark:bg-secondary-700 rounded">
                      <Icon className="w-4 h-4 text-secondary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-secondary-500 capitalize mb-0.5">
                        {key}
                      </p>
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 break-all">
                        {value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link href={`/dashboard/chatbots/${chatbotId}/leads?session=${lead.session_id}`}>
                <MessageSquare className="w-4 h-4 mr-2" />
                View Conversation
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
