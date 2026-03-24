/**
 * Calendar Provider Factory
 * Instantiates the correct adapter based on provider type and config.
 */

import type {
  CalendarProvider,
  CalendarProviderAdapter,
  HostedCalcomConfig,
  CustomerCalcomConfig,
  CalendlyConfig,
} from './types';
import { HostedCalcomAdapter } from './providers/hosted-calcom';
import { CustomerCalcomAdapter } from './providers/customer-calcom';
import { CalendlyAdapter } from './providers/calendly';

export function createCalendarProvider(
  provider: CalendarProvider,
  config: Record<string, unknown>
): CalendarProviderAdapter {
  switch (provider) {
    case 'hosted_calcom':
      return new HostedCalcomAdapter(config as unknown as HostedCalcomConfig);
    case 'customer_calcom':
      return new CustomerCalcomAdapter(config as unknown as CustomerCalcomConfig);
    case 'calendly':
      return new CalendlyAdapter(config as unknown as CalendlyConfig);
    default:
      throw new Error(`Unknown calendar provider: ${provider}`);
  }
}
