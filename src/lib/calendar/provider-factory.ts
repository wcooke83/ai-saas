/**
 * Calendar Provider Factory
 * Instantiates the Easy!Appointments adapter.
 */

import type {
  CalendarProvider,
  CalendarProviderAdapter,
  EasyAppointmentsConfig,
} from './types';
import { EasyAppointmentsAdapter } from './providers/easy-appointments';

export function createCalendarProvider(
  provider: CalendarProvider,
  config: Record<string, unknown>
): CalendarProviderAdapter {
  switch (provider) {
    case 'easy_appointments':
      return new EasyAppointmentsAdapter(config as unknown as EasyAppointmentsConfig);
    default:
      throw new Error(`Unknown calendar provider: ${provider}`);
  }
}
