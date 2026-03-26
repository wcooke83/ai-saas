import { describe, it, expect } from 'vitest';
import { evaluateGate, GateConfig, GateRequest } from './maintenance-gate';

const OFF: GateConfig = { maintenanceMode: false, comingSoon: false, bypassIps: '' };
const MAINTENANCE: GateConfig = { maintenanceMode: true, comingSoon: false, bypassIps: '' };
const COMING_SOON: GateConfig = { maintenanceMode: false, comingSoon: true, bypassIps: '' };
const BOTH: GateConfig = { maintenanceMode: true, comingSoon: true, bypassIps: '' };

function req(pathname: string, forwardedFor: string | null = null): GateRequest {
  return { pathname, forwardedFor };
}

describe('evaluateGate', () => {
  describe('when both modes are off', () => {
    it('passes all requests through', () => {
      expect(evaluateGate(OFF, req('/'))).toEqual({ action: 'pass' });
      expect(evaluateGate(OFF, req('/dashboard'))).toEqual({ action: 'pass' });
      expect(evaluateGate(OFF, req('/api/test'))).toEqual({ action: 'pass' });
    });
  });

  describe('MAINTENANCE_MODE=true', () => {
    it('redirects normal routes to /maintenance', () => {
      expect(evaluateGate(MAINTENANCE, req('/'))).toEqual({
        action: 'redirect',
        target: '/maintenance',
      });
    });

    it('redirects /dashboard', () => {
      expect(evaluateGate(MAINTENANCE, req('/dashboard'))).toEqual({
        action: 'redirect',
        target: '/maintenance',
      });
    });

    it('redirects /api routes', () => {
      expect(evaluateGate(MAINTENANCE, req('/api/test'))).toEqual({
        action: 'redirect',
        target: '/maintenance',
      });
    });

    it('does NOT redirect /maintenance (no loop)', () => {
      expect(evaluateGate(MAINTENANCE, req('/maintenance'))).toEqual({ action: 'pass' });
    });

    it('does NOT redirect /coming-soon', () => {
      expect(evaluateGate(MAINTENANCE, req('/coming-soon'))).toEqual({ action: 'pass' });
    });
  });

  describe('COMING_SOON=true', () => {
    it('redirects normal routes to /coming-soon', () => {
      expect(evaluateGate(COMING_SOON, req('/'))).toEqual({
        action: 'redirect',
        target: '/coming-soon',
      });
    });

    it('does NOT redirect /coming-soon (no loop)', () => {
      expect(evaluateGate(COMING_SOON, req('/coming-soon'))).toEqual({ action: 'pass' });
    });

    it('does NOT redirect /maintenance', () => {
      expect(evaluateGate(COMING_SOON, req('/maintenance'))).toEqual({ action: 'pass' });
    });
  });

  describe('both modes enabled — maintenance takes priority', () => {
    it('redirects to /maintenance, not /coming-soon', () => {
      expect(evaluateGate(BOTH, req('/'))).toEqual({
        action: 'redirect',
        target: '/maintenance',
      });
    });

    it('redirects deep paths to /maintenance', () => {
      expect(evaluateGate(BOTH, req('/dashboard/settings'))).toEqual({
        action: 'redirect',
        target: '/maintenance',
      });
    });
  });

  describe('static asset bypass', () => {
    const assets = [
      '/_next/static/chunk.js',
      '/_next/image/photo.jpg',
      '/favicon.ico',
      '/logo.svg',
      '/image.png',
      '/photo.jpg',
      '/pic.jpeg',
      '/anim.gif',
      '/hero.webp',
      '/style.css',
      '/script.js',
      '/font.woff2',
      '/font.woff',
    ];

    for (const path of assets) {
      it(`passes ${path}`, () => {
        expect(evaluateGate(MAINTENANCE, req(path))).toEqual({ action: 'pass' });
      });
    }
  });

  describe('IP bypass', () => {
    const withBypass = (ips: string): GateConfig => ({
      maintenanceMode: true,
      comingSoon: false,
      bypassIps: ips,
    });

    it('allows a matching IP through', () => {
      expect(evaluateGate(withBypass('10.0.0.1'), req('/', '10.0.0.1'))).toEqual({
        action: 'pass',
      });
    });

    it('blocks a non-matching IP', () => {
      expect(evaluateGate(withBypass('10.0.0.1'), req('/', '10.0.0.2'))).toEqual({
        action: 'redirect',
        target: '/maintenance',
      });
    });

    it('handles multiple IPs in the bypass list', () => {
      const config = withBypass('10.0.0.1, 192.168.1.100, 172.16.0.5');
      expect(evaluateGate(config, req('/', '192.168.1.100'))).toEqual({ action: 'pass' });
      expect(evaluateGate(config, req('/', '172.16.0.5'))).toEqual({ action: 'pass' });
      expect(evaluateGate(config, req('/', '8.8.8.8'))).toEqual({
        action: 'redirect',
        target: '/maintenance',
      });
    });

    it('uses first IP from x-forwarded-for chain', () => {
      expect(
        evaluateGate(withBypass('10.0.0.1'), req('/', '10.0.0.1, 192.168.1.1, 127.0.0.1'))
      ).toEqual({ action: 'pass' });
    });

    it('redirects when no x-forwarded-for header is present', () => {
      expect(evaluateGate(withBypass('10.0.0.1'), req('/', null))).toEqual({
        action: 'redirect',
        target: '/maintenance',
      });
    });

    it('handles whitespace in bypass IPs', () => {
      expect(evaluateGate(withBypass('  10.0.0.1 , 10.0.0.2  '), req('/', '10.0.0.2'))).toEqual({
        action: 'pass',
      });
    });

    it('handles empty BYPASS_IPS', () => {
      expect(evaluateGate(withBypass(''), req('/', '10.0.0.1'))).toEqual({
        action: 'redirect',
        target: '/maintenance',
      });
    });
  });
});
