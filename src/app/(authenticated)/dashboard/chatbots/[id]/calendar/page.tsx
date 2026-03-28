'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import { ConnectionStatus } from '@/components/calendar/connection-status';
import { BookingHistory } from '@/components/calendar/booking-history';
import { BusinessHoursEditor } from '@/components/calendar/business-hours-editor';
import { EventTypeConfigForm } from '@/components/calendar/event-type-config';
import { StickySaveBar } from '@/components/calendar/sticky-save-bar';
import { ServiceManager } from '@/components/calendar/service-manager';
import { ProviderManager } from '@/components/calendar/provider-manager';
import { HolidaysManager } from '@/components/calendar/holidays-manager';
import { DateOverridesManager } from '@/components/calendar/date-overrides-manager';
import type {
  CalendarIntegration,
  CalendarBooking,
  BusinessHoursEntry,
  BusinessHoursSet,
  DateOverrideEntry,
  HolidayEntry,
  EventTypeConfig,
  EAConnectionState,
  EAService,
  EAProvider,
  ProviderServicePriceOverrides,
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
  const [activeTab, setActiveTab] = useState('connection');
  const [integration, setIntegration] = useState<CalendarIntegration | null>(null);
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [connectionState, setConnectionState] = useState<EAConnectionState>('not_connected');

  // EA services & providers
  const [services, setServices] = useState<EAService[]>([]);
  const [providers, setProviders] = useState<EAProvider[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');

  // Provider-level price overrides
  const [providerServicePrices, setProviderServicePrices] = useState<ProviderServicePriceOverrides>({});

  // Event type + business hours
  const [eventTypeConfig, setEventTypeConfig] = useState<EventTypeConfig>({
    ...DEFAULT_EVENT_TYPE,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [businessHours, setBusinessHours] = useState<BusinessHoursEntry[]>(DEFAULT_BUSINESS_HOURS);
  const [businessHoursSets, setBusinessHoursSets] = useState<BusinessHoursSet[]>([]);
  const [dateOverrides, setDateOverrides] = useState<DateOverrideEntry[]>([]);
  const [scopedHolidays, setScopedHolidays] = useState<HolidayEntry[]>([]);

  // Dirty tracking
  const initialStateRef = useRef<string>('');
  const currentState = JSON.stringify({
    selectedServiceId,
    selectedProviderId,
    eventTypeConfig,
    businessHours,
    businessHoursSets,
    dateOverrides,
    scopedHolidays,
    providerServicePrices,
  });
  const isDirty = initialStateRef.current !== '' && currentState !== initialStateRef.current;

  // Warn on unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const fetchData = useCallback(async () => {
    try {
      const [calRes, setupRes] = await Promise.all([
        fetch(`/api/calendar/integrations?chatbotId=${chatbotId}`),
        fetch(`/api/calendar/setup?chatbotId=${chatbotId}`),
      ]);

      if (!calRes.ok) throw new Error('Failed to fetch');
      const calData = await calRes.json();
      const int = calData.data?.integration;
      setIntegration(int || null);
      setBookings(calData.data?.bookings || []);

      if (setupRes.ok) {
        const setupData = await setupRes.json();
        const d = setupData.data;

        if (d?.connectionState) setConnectionState(d.connectionState);
        if (d?.eventType) setEventTypeConfig(d.eventType);
        if (d?.businessHours) setBusinessHours(d.businessHours);
        if (d?.businessHoursSets) setBusinessHoursSets(d.businessHoursSets);
        if (d?.dateOverrides) setDateOverrides(d.dateOverrides);
        if (d?.holidays) setScopedHolidays(d.holidays);
        if (d?.services) setServices(d.services);
        if (d?.providers) setProviders(d.providers);

        const svcId = d?.serviceId ? String(d.serviceId) : '';
        const prvId = d?.providerId ? String(d.providerId) : '';
        setSelectedServiceId(svcId);
        setSelectedProviderId(prvId);

        const prices = (d?.providerServicePrices ?? {}) as ProviderServicePriceOverrides;
        setProviderServicePrices(prices);

        // Snapshot initial state for dirty tracking
        initialStateRef.current = JSON.stringify({
          selectedServiceId: svcId,
          selectedProviderId: prvId,
          eventTypeConfig: d?.eventType || eventTypeConfig,
          businessHours: d?.businessHours || businessHours,
          businessHoursSets: d?.businessHoursSets || [],
          dateOverrides: d?.dateOverrides || [],
          scopedHolidays: d?.holidays || [],
          providerServicePrices: prices,
        });
      }
    } catch {
      toast.error('Failed to load calendar settings');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbotId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/calendar/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data.data || []);
      }
    } catch {
      // silent
    }
  }, []);

  const refetchProviders = useCallback(async () => {
    try {
      const res = await fetch('/api/calendar/providers');
      if (res.ok) {
        const data = await res.json();
        setProviders(data.data || []);
      }
    } catch {
      // silent
    }
  }, []);

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
          businessHoursSets,
          dateOverrides,
          scopedHolidays,
          serviceId: selectedServiceId || undefined,
          providerId: selectedProviderId || undefined,
          providerServicePrices,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Failed to save');
      }
      toast.success('Calendar settings saved');
      // Reset dirty tracking
      initialStateRef.current = currentState;
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
      setConnectionState('not_connected');
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

      const res = await fetch('/api/calendar/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId,
          dateFrom,
          dateTo: dateFrom,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!res.ok) throw new Error('Test failed');
      const data = await res.json();
      const slotCount = data.data?.slots?.length || 0;
      toast.success(`Connection working! Found ${slotCount} available slots for tomorrow.`);
      setConnectionState('connected');
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

  const activeBookingCount = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-10 w-96 rounded-md" />
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

      <ConnectionStatus
        integration={integration}
        connectionState={connectionState}
        activeBookingCount={activeBookingCount}
        onDisconnect={handleDisconnect}
        onTest={handleTest}
        testing={testing}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="connection">Services &amp; Providers</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="history">
            Booking History
            {activeBookingCount > 0 && (
              <Tooltip content="Number of confirmed and pending bookings">
                <Badge variant="outline" className="ml-2 text-xs">
                  {activeBookingCount}
                </Badge>
              </Tooltip>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Services & Providers */}
        <TabsContent value="connection">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Services</CardTitle>
                <CardDescription>Manage the services your chatbot can book appointments for.</CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceManager
                  services={services}
                  selectedServiceId={selectedServiceId}
                  onSelectService={setSelectedServiceId}
                  onServicesChange={refetchServices}
                  connectionState={connectionState}
                  eventTypeDuration={eventTypeConfig.durationMinutes}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Providers</CardTitle>
                <CardDescription>Staff members who handle bookings for your services.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderManager
                  providers={providers}
                  services={services}
                  selectedProviderId={selectedProviderId}
                  onSelectProvider={setSelectedProviderId}
                  onProvidersChange={refetchProviders}
                  connectionState={connectionState}
                  providerServicePrices={providerServicePrices}
                  onProviderServicePricesChange={setProviderServicePrices}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Scheduling */}
        <TabsContent value="scheduling">
          <div className="space-y-6 mt-4">
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
                <CardTitle className="text-base">Business Hours</CardTitle>
                <CardDescription>Set which days and times you accept bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessHoursEditor
                  globalHours={businessHours}
                  onGlobalChange={setBusinessHours}
                  scopedSets={businessHoursSets}
                  onScopedSetsChange={setBusinessHoursSets}
                  services={services}
                  providers={providers}
                />
              </CardContent>
            </Card>

            <HolidaysManager
              connectionState={connectionState}
              services={services}
              providers={providers}
              scopedHolidays={scopedHolidays}
              onScopedHolidaysChange={setScopedHolidays}
            />

            <DateOverridesManager
              services={services}
              providers={providers}
              businessHours={businessHours}
              value={dateOverrides}
              onChange={setDateOverrides}
            />
          </div>
        </TabsContent>

        {/* Tab 3: Booking History */}
        <TabsContent value="history">
          <div className="mt-4">
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
        </TabsContent>
      </Tabs>

      {activeTab !== 'history' && (
        <StickySaveBar
          isDirty={isDirty}
          saving={saving}
          onSave={handleSave}
          onTest={integration ? handleTest : undefined}
          testing={testing}
          isNewSetup={!integration}
          hasIntegration={!!integration}
        />
      )}
    </div>
  );
}
