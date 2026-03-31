import type { Metadata } from 'next';
import SDKDocsClient from './sdk-client';

export const metadata: Metadata = {
  title: 'Developer API & SDK | VocUI',
  description: 'Embed VocUI chatbots, use the REST API, set up webhooks, and integrate the Agent Console.',
};

export default function SDKPage() {
  return <SDKDocsClient />;
}
