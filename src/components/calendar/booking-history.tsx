'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { CalendarDays, Clock, User, Mail, X, Search } from 'lucide-react';
import type { CalendarBooking } from '@/lib/calendar/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  rescheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  no_show: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400',
};

const PAGE_SIZE = 20;

interface BookingHistoryProps {
  bookings: CalendarBooking[];
  onCancel: (bookingId: string) => void;
}

export function BookingHistory({ bookings, onCancel }: BookingHistoryProps) {
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter chain: search → date range → status
  let filtered = bookings;

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.attendee_name.toLowerCase().includes(q) ||
        b.attendee_email.toLowerCase().includes(q)
    );
  }

  if (dateFrom) {
    filtered = filtered.filter((b) => b.start_time.slice(0, 10) >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter((b) => b.start_time.slice(0, 10) <= dateTo);
  }

  if (filter !== 'all') {
    filtered = filtered.filter((b) => b.status === filter);
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Count bookings per status
  const counts: Record<string, number> = { all: bookings.length };
  for (const b of bookings) {
    counts[b.status] = (counts[b.status] || 0) + 1;
  }

  const handleCancel = (bookingId: string) => {
    if (confirmingId === bookingId) {
      onCancel(bookingId);
      setConfirmingId(null);
    } else {
      setConfirmingId(bookingId);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-500">
        <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No bookings yet</p>
      </div>
    );
  }

  const statuses = ['all', 'confirmed', 'pending', 'cancelled', 'rescheduled'];
  const statusTooltips: Record<string, string> = {
    all: 'Show all bookings',
    confirmed: 'Bookings that have been confirmed',
    pending: 'Bookings awaiting confirmation',
    cancelled: 'Bookings that were cancelled',
    rescheduled: 'Bookings that were moved to a different time',
  };

  return (
    <div className="space-y-4">
      {/* Search and date filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tooltip content="Search bookings by customer name or email address">
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-400" />
            <Input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Search by name or email..."
              className="pl-8 h-8 text-xs"
            />
          </div>
        </Tooltip>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-secondary-500">From</span>
          <Tooltip content="Filter bookings from this date">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
              className="w-36 h-8 text-xs px-2"
            />
          </Tooltip>
          <span className="text-xs text-secondary-500">To</span>
          <Tooltip content="Filter bookings up to this date">
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
              className="w-36 h-8 text-xs px-2"
            />
          </Tooltip>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Filter bookings by status">
        {statuses.map((status) => {
          const count = counts[status] || 0;
          if (status !== 'all' && count === 0) return null;
          return (
            <Tooltip key={status} content={statusTooltips[status] || status}>
              <button
                type="button"
                role="radio"
                aria-checked={filter === status}
                onClick={() => { setFilter(status); setPage(0); }}
                className={cn(
                  'px-3 py-1 text-xs rounded-full capitalize transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 outline-none',
                  filter === status
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                )}
              >
                {status} ({count})
              </button>
            </Tooltip>
          );
        })}
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-6 text-secondary-500">
          <p className="text-sm">No {filter} bookings found.</p>
        </div>
      ) : (
        <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
          {paginated.map((booking) => (
            <div key={booking.id} className="py-3 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={cn('text-xs', statusColors[booking.status])}>
                    {booking.status}
                  </Badge>
                  <span className="text-xs text-secondary-500">
                    {booking.provider}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-700 dark:text-secondary-300">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {booking.attendee_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {booking.attendee_email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-secondary-500 mt-1">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(booking.start_time).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(booking.start_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                    {' - '}
                    {new Date(booking.end_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              {booking.status === 'confirmed' && (
                confirmingId === booking.id ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs h-7"
                      onClick={() => handleCancel(booking.id)}
                      aria-label={`Confirm cancel booking for ${booking.attendee_name}`}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7"
                      onClick={() => setConfirmingId(null)}
                    >
                      No
                    </Button>
                  </div>
                ) : (
                  <Tooltip content="Cancel this booking. The customer will need to be notified separately.">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 shrink-0"
                      onClick={() => handleCancel(booking.id)}
                      aria-label={`Cancel booking for ${booking.attendee_name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </Tooltip>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-secondary-500">
            {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
