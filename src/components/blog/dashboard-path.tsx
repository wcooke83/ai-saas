export function DashboardPath({ steps, tip }: { steps: string[]; tip?: string }) {
  return (
    <div className="my-6 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 px-5 py-4">
      <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wide mb-2">
        In your VocUI dashboard
      </p>
      <div className="flex items-center flex-wrap gap-1.5">
        {steps.map((step, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded px-2 py-0.5">
              {step}
            </span>
            {i < steps.length - 1 && (
              <span className="text-secondary-400" aria-hidden="true">&rarr;</span>
            )}
          </span>
        ))}
      </div>
      {tip && (
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">{tip}</p>
      )}
    </div>
  );
}
