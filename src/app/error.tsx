'use client';

import { useRouter } from 'next/navigation';
import { PageErrorFallback } from '@/components/error-boundary';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleReset = () => {
    router.refresh();
    reset();
  };

  return <PageErrorFallback error={error} reset={handleReset} />;
}
