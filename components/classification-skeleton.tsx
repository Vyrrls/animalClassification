"use client";

export function ClassificationSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="h-7 w-48 rounded-md bg-muted" />
            <div className="h-4 w-36 rounded-md bg-muted" />
            <div className="h-3 w-24 rounded-md bg-muted" />
          </div>
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="h-4 w-full rounded-md bg-muted" />
          <div className="h-4 w-3/4 rounded-md bg-muted" />
        </div>
        <div className="mt-4">
          <div className="h-3 w-32 rounded-md bg-muted mb-2" />
          <div className="h-2.5 w-full rounded-full bg-muted" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <div className="h-8 w-8 rounded-md bg-muted" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-16 rounded-md bg-muted" />
              <div className="h-4 w-32 rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="h-4 w-24 rounded-md bg-muted mb-3" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-3 w-16 rounded-md bg-muted" />
              <div className="h-3 w-32 rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="h-4 w-28 rounded-md bg-muted mb-3" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-muted" />
              <div className="h-4 w-full rounded-md bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
