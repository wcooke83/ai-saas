'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import { ConnectionStatus } from '@/components/calendar/connection-status';
import { BookingHistory } from '@/components/calendar/booking-history';
import { BusinessHoursEditor } from '@/components/calendar/business-hours-editor';
import { EventTypeConfigForm } from '@/components/calendar/event-type-config';
import type {
  CalendarIntegration,
  CalendarBooking,
  BusinessHoursEntry,
  EventTypeConfig,
} from '@/lib/calendar/types';
import { DEFAULT_BUSINESS_HOURS, DEFAULT_EVENT_TYPE } from '@/lib/calendar/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface EAService {
  id: number;
  name: string;
  duration: number;
}

interface EAProvider {
  id: number;
  firstName: string;
  lastName: string;
}

export default function CalendarSettingsPage({ params }: PageProps) {
  const { id: chatbotId } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [integration, setIntegration] = useState<CalendarIntegration | null>(null);
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);

  // Easy!Appointments config
  const [services, setServices] = useState<EAService[]>([]);
  const [providers, setProviders] = useState<EAProvider[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');

  // Event type + business hours config
  const [eventTypeConfig, setEventTypeConfig] = useState<EventTypeConfig>({
    ...DEFAULT_EVENT_TYPE,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [businessHours, setBusinessHours] = useState<BusinessHoursEntry[]>(DEFAULT_BUSINESS_HOURS);

  const fetchData = useCallback(async () => {
    try {
      // Fetch integration + bookings
      const calRes = await fetch(`/api/calendar/integrations?chatbotId=${chatbotId}`);
      if (!calRes.ok) throw new Error('Failed to fetch');
      const data = await calRes.json();
      const int = data.data?.integration;
      setIntegration(int || null);
      setBookings(data.data?.bookings || []);

      // Fetch setup config (event type + business hours + EA services/providers)
      const setupRes = await fetch(`/api/calendar/setup?chatbotId=${chatbotId}`);
      if (setupRes.ok) {
        const setupData = await setupRes.json();
        if (setupData.data?.eventType) {
          setEventTypeConfig(setupData.data.eventType);
        }
        if (setupData.data?.businessHours) {
          setBusinessHours(setupData.data.businessHours);
        }
        if (setupData.data?.services) {
          setServices(setupData.data.services);
        }
        if (setupData.data?.providers) {
          setProviders(setupData.data.providers);
        }
        if (setupData.data?.serviceId) {
          setSelectedServiceId(String(setupData.data.serviceId));
        }
        if (setupData.data?.providerId) {
          setSelectedProviderId(String(setupData.data.providerId));
        }
      }
    } catch {
      toast.error('Failed to load calendar settings');
    } finally {
      setLoading(false);
    }
  }, [chatbotId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/calendar/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId,
          eventType: eventTypeConfig,
          businessHours,
          serviceId: selectedServiceId || undefined,
          providerId: selectedProviderId || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Failed to save');
      }
      toast.success('Calendar settings saved');
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    if (!integration) return;
    try {
      const res = await fetch(`/api/calendar/integrations?id=${integration.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to disconnect');
      toast.success('Calendar disconnected');
      setIntegration(null);
    } catch {
      toast.error('Failed to disconnect');
    }
  }

  async function handleTest() {
    setTesting(true);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateFrom = tomorrow.toISOString().split('T')[0];
      const dateTo = dateFrom;

      const res = await fetch('/api/calendar/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId,
          dateFrom,
          dateTo,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!res.ok) throw new Error('Test failed');
      const data = await res.json();
      const slotCount = data.data?.slots?.length || 0;
      toast.success(`Connection working! Found ${slotCount} available slots for tomorrow.`);
    } catch {
      toast.error('Test failed. Check your calendar configuration.');
    } finally {
      setTesting(false);
    }
  }

  async function handleCancelBooking(bookingId: string) {
    try {
      const res = await fetch(`/api/calendar/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to cancel');
      toast.success('Booking cancelled');
      fetchData();
    } catch {
      toast.error('Failed to cancel booking');
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ChatbotPageHeader
        chatbotId={chatbotId}
        title="Calendar Booking"
        badges={
          integration ? (
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              Calendar Active
            </Badge>
          ) : null
        }
      />

      {/* Connection Status */}
      {integration && (
        <ConnectionStatus
          integration={integration}
          onDisconnect={handleDisconnect}
          onTest={handleTest}
          testing={testing}
        />
      )}

      {/* Easy!Appointments Service & Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Easy!Appointments Connection</CardTitle>
          <CardDescription>
            Select the service and provider from your Easy!Appointments instance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.length > 0 ? (
            <div>
              <Label htmlFor="ea-service">Service</Label>
              <select
                id="ea-service"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select a service...</option>
                {services.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name} ({s.duration} min)
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-secondary-500">
              No services found. Make sure Easy!Appointments is configured and has at least one service.
            </p>
          )}

          {providers.length > 0 && (
            <div>
              <Label htmlFor="ea-provider">Provider</Label>
              <select
                id="ea-provider"
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select a provider...</option>
                {providers.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appointment Settings</CardTitle>
          <CardDescription>Configure what type of appointments can be booked through your chatbot.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventTypeConfigForm value={eventTypeConfig} onChange={setEventTypeConfig} />
        </CardContent>
      </Card>

      {/* Availability / Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Availability</CardTitle>
          <CardDescription>Set which days and times you accept bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessHoursEditor value={businessHours} onChange={setBusinessHours} />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {integration ? 'Update' : 'Enable'} Calendar
        </Button>
        {integration && (
          <Button variant="outline" onClick={handleTest} disabled={testing}>
            {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Test Connection
          </Button>
        )}
      </div>

      {/* Booking History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking History</CardTitle>
          <CardDescription>Recent appointments booked through your chatbot.</CardDescription>
        </CardHeader>
        <CardContent>
          <BookingHistory bookings={bookings} onCancel={handleCancelBooking} />
        </CardContent>
      </Card>
    </div>
  );
}
