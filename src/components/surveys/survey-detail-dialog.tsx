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
import { ClipboardList, Calendar, Hash, MessageSquare, Star, X } from 'lucide-react';
import Link from 'next/link';
import type { SurveyResponse } from '@/lib/chatbots/types';

interface SurveyDetailDialogProps {
  response: SurveyResponse | null;
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

function formatValue(value: string | number | string[]): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(value);
}

function isRating(value: unknown): value is number {
  return typeof value === 'number' && value >= 1 && value <= 5;
}

export function SurveyDetailDialog({
  response,
  chatbotId,
  open,
  onOpenChange,
}: SurveyDetailDialogProps) {
  if (!open || !response) return null;

  const entries = Object.entries(response.responses);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-full">
              <ClipboardList className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            Survey Response
          </DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(response.created_at)}
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
                  {response.session_id
                    ? `${response.session_id.slice(0, 16)}...`
                    : 'N/A'}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary-500" />
                  <span className="text-sm text-secondary-500">Submitted</span>
                </div>
                <span className="text-sm font-medium">
                  {formatDate(response.created_at)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Survey Responses */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              Responses
            </h4>
            <div className="grid gap-2">
              {entries.length === 0 ? (
                <p className="text-sm text-secondary-500 italic">
                  No response data available
                </p>
              ) : (
                entries.map(([key, value]) => {
                  const isRatingValue = isRating(value);
                  return (
                    <div
                      key={key}
                      className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg"
                    >
                      <div className="p-1.5 bg-white dark:bg-secondary-700 rounded">
                        {isRatingValue ? (
                          <Star className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <ClipboardList className="w-4 h-4 text-secondary-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-secondary-500 capitalize mb-0.5">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <div className="flex items-center gap-2">
                          {isRatingValue ? (
                            <>
                              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                {value}
                              </span>
                              <span className="text-xs text-secondary-400">
                                / 5
                              </span>
                            </>
                          ) : (
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 break-all">
                              {formatValue(value)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Actions */}
          {response.session_id && (
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link
                  href={`/dashboard/chatbots/${chatbotId}/leads?session=${response.session_id}`}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Conversation
                </Link>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
