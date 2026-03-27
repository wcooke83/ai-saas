import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { checkGate } from './maintenance-gate';

describe('checkGate', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.MAINTENANCE_MODE;
    delete process.env.COMING_SOON_MODE;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns inactive when no env vars set', () => {
    expect(checkGate('/')).toEqual({ active: false });
  });

  it('redirects to /maintenance when MAINTENANCE_MODE=true', () => {
    process.env.MAINTENANCE_MODE = 'true';
    expect(checkGate('/')).toEqual({ active: true, destination: '/maintenance' });
    expect(checkGate('/dashboard')).toEqual({ active: true, destination: '/maintenance' });
  });

  it('redirects to /coming-soon when COMING_SOON_MODE=true', () => {
    process.env.COMING_SOON_MODE = 'true';
    expect(checkGate('/')).toEqual({ active: true, destination: '/coming-soon' });
  });

  it('maintenance takes priority over coming-soon', () => {
    process.env.MAINTENANCE_MODE = 'true';
    process.env.COMING_SOON_MODE = 'true';
    expect(checkGate('/')).toEqual({ active: true, destination: '/maintenance' });
  });

  it('exempts /maintenance and /coming-soon paths', () => {
    process.env.MAINTENANCE_MODE = 'true';
    expect(checkGate('/maintenance')).toEqual({ active: false });
    expect(checkGate('/coming-soon')).toEqual({ active: false });
  });

  it('exempts /api/ paths', () => {
    process.env.MAINTENANCE_MODE = 'true';
    expect(checkGate('/api/chat/123')).toEqual({ active: false });
    expect(checkGate('/api/widget/456/config')).toEqual({ active: false });
  });

  it('exempts /auth/ and /_next/ paths', () => {
    process.env.MAINTENANCE_MODE = 'true';
    expect(checkGate('/auth/callback')).toEqual({ active: false });
    expect(checkGate('/_next/static/chunk.js')).toEqual({ active: false });
  });

  it('exempts /favicon.ico', () => {
    process.env.MAINTENANCE_MODE = 'true';
    expect(checkGate('/favicon.ico')).toEqual({ active: false });
  });

  it('does not redirect when MAINTENANCE_MODE is not "true"', () => {
    process.env.MAINTENANCE_MODE = 'false';
    expect(checkGate('/')).toEqual({ active: false });
  });
});
