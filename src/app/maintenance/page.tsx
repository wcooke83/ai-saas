import { Wrench, Settings, HardDrive, ShieldCheck } from 'lucide-react';
import { PageBackground } from '@/components/ui/page-background';

export const metadata = {
  title: 'Maintenance | VocUI',
  description: 'VocUI is currently undergoing maintenance. We will be back soon.',
};

export default function MaintenancePage() {
  return (
    <PageBackground>
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="flex items-center gap-3 mb-6">
          <Wrench className="lucide h-8 w-8 text-primary-500" />
          <Settings className="lucide h-8 w-8 text-primary-400" />
          <HardDrive className="lucide h-8 w-8 text-primary-500" />
          <ShieldCheck className="lucide h-8 w-8 text-primary-400" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-[rgb(var(--text-heading))] mb-4">
          We&apos;ll be back soon
        </h1>

        <p className="text-lg text-[rgb(var(--text-primary))] max-w-md mb-6">
          VocUI is currently undergoing scheduled maintenance to improve your experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2 text-[rgb(var(--text-primary))]">
            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            Systems upgrading
          </div>
          <div className="flex items-center gap-2 text-[rgb(var(--text-primary))]">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Data is safe
          </div>
        </div>

        <p className="text-sm text-[rgb(var(--text-primary))] opacity-70">
          Thank you for your patience
        </p>
      </main>
    </PageBackground>
  );
}
