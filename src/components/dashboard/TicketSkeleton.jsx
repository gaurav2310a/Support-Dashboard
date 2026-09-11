function SkeletonRow() {
  return (
    <tr className="border-b border-line last:border-0">
      <td className="px-4 py-3.5">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-3.5"><div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" /></td>
      <td className="px-4 py-3.5"><div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" /></td>
      <td className="px-4 py-3.5"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
      <td className="px-4 py-3.5"><div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200" /></td>
    </tr>
  );
}

export default function TicketSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden overflow-hidden rounded-xl border border-line bg-white md:block" aria-hidden="true">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile skeleton */}
      <div className="flex flex-col gap-3 md:hidden" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-line bg-white p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 flex gap-2">
              <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only" role="status">Loading tickets…</span>
    </>
  );
}
