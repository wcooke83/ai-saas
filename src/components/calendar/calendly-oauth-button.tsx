'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface CalendlyOAuthButtonProps {
  chatbotId: string;
}

export function CalendlyOAuthButton({ chatbotId }: CalendlyOAuthButtonProps) {
  function handleConnect() {
    // The state parameter carries the chatbotId through the OAuth flow
    const clientId = process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      // Fallback: redirect to API endpoint that will build the URL server-side
      window.location.href = `/api/calendar/connect/calendly?chatbotId=${chatbotId}`;
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      state: chatbotId,
    });

    window.location.href = `https://auth.calendly.com/oauth/authorize?${params.toString()}`;
  }

  return (
    <Button onClick={handleConnect} variant="outline" className="gap-2">
      <ExternalLink className="w-4 h-4" />
      Connect Calendly Account
    </Button>
  );
}
