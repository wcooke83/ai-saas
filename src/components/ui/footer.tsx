'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { VocUILogo } from '@/components/ui/vocui-logo';
import { getFooterGradientEnabledFromCookie } from '@/lib/ui-settings-cookies';

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Industries', href: '/industries' },
    { label: 'Pricing', href: '/pricing' },
  ],
  resources: [
    { label: 'Documentation', href: '/wiki' },
    { label: 'SDK', href: '/sdk' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Blog', href: '/blog' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Security', href: '/security' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  {
    label: 'Twitter',
    href: 'https://x.com/Voc_UI',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/vocui',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/vocui',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [useGradient, setUseGradient] = useState(false);

  // Check the data attribute for gradient state
  const checkGradientState = useCallback(() => {
    const attr = document.documentElement.getAttribute('data-footer-gradient-enabled');
    if (attr !== null) {
      setUseGradient(attr === 'true');
    } else {
      // Fall back to cookie if no attribute set
      setUseGradient(getFooterGradientEnabledFromCookie());
    }
  }, []);

  useEffect(() => {
    // Initial load
    checkGradientState();

    // Watch for attribute changes using MutationObserver
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-footer-gradient-enabled') {
          checkGradientState();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-footer-gradient-enabled'],
    });

    return () => observer.disconnect();
  }, [checkGradientState]);

  return (
    <footer
      style={{
        background: useGradient
          ? 'linear-gradient(to bottom, rgb(var(--footer-gradient-from)), rgb(var(--footer-gradient-to)))'
          : 'rgb(var(--footer-bg))',
        borderTop: '1px solid rgb(var(--footer-border))',
      }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
          {/* Brand section */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md w-fit"
            >
              <VocUILogo />
              <span className="font-bold text-xl text-secondary-900 dark:text-secondary-100">
                VocUI
              </span>
              <span className="text-xs font-normal text-secondary-500 dark:text-secondary-400 ml-1.5">Voice User Interface</span>
            </Link>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4 max-w-xs">
              AI chatbots that learn from your content and work where your customers are.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
              Support
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8"
          style={{ borderTop: '1px solid rgb(var(--footer-border))' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              &copy; {currentYear} VocUI. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-sm text-secondary-400 dark:text-secondary-500">
              <Link
                href="/sitemap.xml"
                className="hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
              >
                Sitemap
              </Link>
              <span aria-hidden="true">&middot;</span>
              <Link
                href="/status"
                className="hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                aria-label="VocUI system status and uptime"
              >
                Status
              </Link>
              <span aria-hidden="true">&middot;</span>
              <span>Turn your content into conversations.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
