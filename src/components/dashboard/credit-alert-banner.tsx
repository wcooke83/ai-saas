'use client';

import { useState, useEffect } from 'react';
import { CreditWarningBanner } from '@/components/ui/credit-warning-banner';
import { CreditDepletionModal } from '@/components/billing/credit-depletion-modal';

interface CreditStatus {
  alertLevel: '75' | '90' | '100' | null;
  available: number;
  isUnlimited: boolean;
}

interface CreditPack {
  id: string;
  name: string;
  credit_amount: number;
  price_cents: number;
  sort_order: number;
}

function buildDismissKey(alertLevel: '75' | '90' | '100'): string {
  // Session-scoped key (sessionStorage) so it clears on browser close
  return `credit-alert-dismissed-${alertLevel}`;
}

export function CreditAlertBanner() {
  const [status, setStatus] = useState<CreditStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [packs, setPacks] = useState<CreditPack[]>([]);

  useEffect(() => {
    async function checkCredits() {
      try {
        const res = await fetch('/api/credit-alerts/check');
        if (!res.ok) return;
        const result = await res.json();
        const data: CreditStatus = result?.data ?? result;
        setStatus(data);

        if (data.alertLevel) {
          const key = buildDismissKey(data.alertLevel);
          if (sessionStorage.getItem(key) === 'true') {
            setDismissed(true);
          }
        }
      } catch {
        // non-critical
      }
    }

    async function loadPacks() {
      try {
        const res = await fetch('/api/credit-packages');
        if (!res.ok) return;
        const result = await res.json();
        const data: CreditPack[] = result?.data?.packages ?? [];
        setPacks(data.slice(0, 3));
      } catch {
        // non-critical
      }
    }

    checkCredits();
    loadPacks();
  }, []);

  if (!status || status.isUnlimited || !status.alertLevel || dismissed) return null;

  function handleDismiss() {
    if (status?.alertLevel) {
      sessionStorage.setItem(buildDismissKey(status.alertLevel), 'true');
    }
    setDismissed(true);
  }

  function handleBuyCredits() {
    setShowModal(true);
  }

  const mappedPacks = packs.map((p) => ({
    id: p.id,
    slug: p.id,
    name: p.name,
    credits: p.credit_amount,
    bonusCredits: 0,
    priceCents: p.price_cents,
  }));

  return (
    <>
      <CreditWarningBanner
        alertLevel={status.alertLevel}
        available={status.available}
        onDismiss={handleDismiss}
        onBuyCredits={handleBuyCredits}
      />
      <CreditDepletionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        needed={0}
        available={status.available}
        packs={mappedPacks}
      />
    </>
  );
}
