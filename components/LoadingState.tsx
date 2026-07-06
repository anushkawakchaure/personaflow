import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse-soft rounded-md bg-surface-raised", className)} />;
}

/** Skeleton placeholder for the session list while sessions are "loading". */
export function SessionListLoadingState() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-surface p-3.5">
          <div className="flex items-center justify-between">
            <Bone className="h-3.5 w-28" />
            <Bone className="h-5 w-16 rounded-full" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton placeholder for the detail panel while a session's data is "loading". */
export function DetailPanelLoadingState() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Bone className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Bone className="h-4 w-40" />
          <Bone className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-5/6" />
        <Bone className="h-3 w-2/3" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
