export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      {/* Header skeleton */}
      <div className="h-16 border-b border-border" />

      {/* Hero skeleton */}
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-4 w-20 bg-muted rounded animate-pulse mx-auto" />
        <div className="h-10 w-96 bg-muted rounded animate-pulse mx-auto" />
        <div className="h-5 w-[480px] max-w-full bg-muted rounded animate-pulse mx-auto" />
      </div>

      {/* Billing toggle skeleton */}
      <div className="container mx-auto px-4 pb-8 flex items-center justify-center gap-4">
        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        <div className="h-11 w-16 bg-muted rounded-full animate-pulse" />
        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Trust bar skeleton */}
      <div className="container mx-auto px-4 pb-12 flex flex-wrap items-center justify-center gap-6">
        <div className="h-4 w-36 bg-muted rounded animate-pulse" />
        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
        <div className="h-4 w-44 bg-muted rounded animate-pulse" />
      </div>

      {/* Pricing cards skeleton */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border p-6 flex flex-col gap-4 bg-white dark:bg-secondary-800"
            >
              {/* Icon + plan name */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
                <div className="h-5 w-20 bg-muted rounded animate-pulse" />
              </div>
              {/* Price */}
              <div className="h-9 w-28 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              {/* CTA button */}
              <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
              {/* Feature lines */}
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
