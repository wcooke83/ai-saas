'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import { ProviderSelector } from '@/components/calendar/provider-selector';
import { CalcomConnectForm } from '@/components/calendar/calcom-connect-form';
import { CalendlyOAuthButton } from '@/components/calendar/calendly-oauth-button';
import { ConnectionStatus } from '@/components/calendar/connection-status';
import { BookingHistory } from '@/components/calendar/booking-history';
import { BusinessHoursEditor } from '@/components/calendar/business-hours-editor';
import { EventTypeConfigForm } from '@/components/calendar/event-type-config';
import type {
  CalendarProvider,
  CalendarIntegration,
  CalendarBooking,
  BusinessHoursEntry,
  EventTypeConfig,
} from '@/lib/calendar/types';
import { DEFAULT_BUSINESS_HOURS, DEFAULT_EVENT_TYPE } from '@/lib/calendar/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CalendarSettingsPage({ params }: PageProps) {
  const { id: chatbotId } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CalendarProvider | null>(null);
  const [integration, setIntegration] = useState<CalendarIntegration | null>(null);
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);

  // Hosted Cal.com config
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
      if (int) {
        setSelectedProvider(int.provider);
      }

      // Fetch setup config (event type + business hours)
      const setupRes = await fetch(`/api/calendar/setup?chatbotId=${chatbotId}`);
      if (setupRes.ok) {
        const setupData = await setupRes.json();
        if (setupData.data?.eventType) {
          setEventTypeConfig(setupData.data.eventType);
        }
        if (setupData.data?.businessHours) {
          setBusinessHours(setupData.data.businessHours);
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

  // Check URL for connection success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected')) {
      toast.success(`${urlParams.get('connected')} connected successfully!`);
      window.history.replaceState({}, '', window.location.pathname);
      fetchData();
    }
    if (urlParams.get('error')) {
      toast.error('Connection failed. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [fetchData]);

  async function handleSaveHosted() {
    setSaving(true);
    try {
      const res = await fetch('/api/calendar/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId,
          eventType: eventTypeConfig,
          businessHours,
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
      setSelectedProvider(null);
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>
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

      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Calendar Provider</CardTitle>
          <CardDescription>Choose how you want to manage your booking calendar.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderSelector
            selected={selectedProvider}
            connectedProvider={integration?.provider as CalendarProvider | undefined}
            onSelect={setSelectedProvider}
          />
        </CardContent>
      </Card>

      {/* Hosted Cal.com — Event Type + Business Hours */}
      {selectedProvider === 'hosted_calcom' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appointment Settings</CardTitle>
              <CardDescription>Configure what type of appointments can be booked through your chatbot.</CardDescription>
            </CardHeader>
            <CardContent>
              <EventTypeConfigForm value={eventTypeConfig} onChange={setEventTypeConfig} />
            </CardContent>
          </Card>

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
            <Button onClick={handleSaveHosted} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {integration?.provider === 'hosted_calcom' ? 'Update' : 'Enable'} Calendar
            </Button>
            {integration?.provider === 'hosted_calcom' && (
              <Button variant="outline" onClick={handleTest} disabled={testing}>
                {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Test Connection
              </Button>
            )}
          </div>
        </>
      )}

      {selectedProvider === 'customer_calcom' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connect Your Cal.com</CardTitle>
            <CardDescription>Enter your Cal.com API key and instance URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <CalcomConnectForm chatbotId={chatbotId} onConnected={fetchData} />
          </CardContent>
        </Card>
      )}

      {selectedProvider === 'calendly' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connect Calendly</CardTitle>
            <CardDescription>Authorize access to your Calendly account.</CardDescription>
          </CardHeader>
          <CardContent>
            {integration?.provider === 'calendly' ? (
              <p className="text-sm text-green-600">Calendly is connected.</p>
            ) : (
              <CalendlyOAuthButton chatbotId={chatbotId} />
            )}
          </CardContent>
        </Card>
      )}

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
