/**
 * Calendar Tool Handler
 * Intercepts AI tool calls and routes them to CalendarService.
 * Returns stringified results for the AI to interpret.
 */

import { CalendarService } from '@/lib/calendar/service';

export async function handleCalendarToolCall(
  toolName: string,
  args: Record<string, unknown>,
  context: { chatbotId: string; sessionId: string }
): Promise<string> {
  try {
    switch (toolName) {
      case 'check_availability': {
        const availability = await CalendarService.getAvailability(context.chatbotId, {
          dateFrom: args.date_from as string,
          dateTo: args.date_to as string,
          timezone: args.timezone as string,
          duration: args.duration_minutes as number | undefined,
        });

        if (availability.slots.length === 0) {
          return JSON.stringify({
            available: false,
            message: 'No available time slots found for the requested dates.',
            timezone: availability.timezone,
          });
        }

        // Group slots by date for readable output
        const grouped: Record<string, string[]> = {};
        for (const slot of availability.slots) {
          const date = new Date(slot.start).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: availability.timezone,
          });
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(
            new Date(slot.start).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: availability.timezone,
            })
          );
        }

        return JSON.stringify({
          available: true,
          timezone: availability.timezone,
          slots_by_date: grouped,
          total_slots: availability.slots.length,
          raw_slots: availability.slots.slice(0, 20), // Limit to 20 for context window
        });
      }

      case 'create_booking': {
        const booking = await CalendarService.createBooking(
          context.chatbotId,
          context.sessionId,
          {
            start: args.start_time as string,
            end: args.end_time as string,
            attendeeName: args.attendee_name as string,
            attendeeEmail: args.attendee_email as string,
            attendeeTimezone: args.attendee_timezone as string,
            notes: args.notes as string | undefined,
          }
        );

        if (booking.schedulingUrl) {
          // Calendly case - return scheduling link
          return JSON.stringify({
            success: true,
            status: 'pending',
            message: 'Please complete your booking using the link below.',
            scheduling_url: booking.schedulingUrl,
            booking_id: booking.id,
          });
        }

        return JSON.stringify({
          success: true,
          status: booking.status,
          booking_id: booking.id,
          start: booking.start,
          end: booking.end,
          meeting_url: booking.meetingUrl || null,
          attendee_name: booking.attendeeName,
          attendee_email: booking.attendeeEmail,
        });
      }

      case 'cancel_booking': {
        await CalendarService.cancelBooking(
          args.booking_id as string,
          args.reason as string | undefined
        );
        return JSON.stringify({
          success: true,
          message: 'Booking has been cancelled.',
        });
      }

      case 'reschedule_booking': {
        const rescheduled = await CalendarService.rescheduleBooking(
          args.booking_id as string,
          {
            providerBookingId: '',
            newStart: args.new_start_time as string,
            newEnd: args.new_end_time as string,
            reason: args.reason as string | undefined,
          }
        );

        return JSON.stringify({
          success: true,
          booking_id: rescheduled.id,
          new_start: rescheduled.start,
          new_end: rescheduled.end,
          meeting_url: rescheduled.meetingUrl || null,
        });
      }

      default:
        return JSON.stringify({ error: `Unknown calendar tool: ${toolName}` });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    console.error(`[Calendar:Tool] Error in ${toolName}:`, error);
    return JSON.stringify({
      error: true,
      message: `I'm having trouble with that request: ${message}. Please try again.`,
    });
  }
}

/**
 * Check if a tool name is a calendar tool
 */
export function isCalendarTool(toolName: string): boolean {
  return ['check_availability', 'create_booking', 'cancel_booking', 'reschedule_booking'].includes(toolName);
}
