import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export function generateMetadata(): Metadata {
  return {
    robots: { index: false, follow: true },
  };
}

export default function ChatbotForAccountantsPage() {
  redirect('/chatbot-for-accountancy-firms');
}
