import { Inbox } from 'lucide-react';
import { useTicketStore, selectHasActiveFilters } from '../../store/ticketStore';

export default function EmptyState() {
  const hasSearchOrFilter = useTicketStore(selectHasActiveFilters);
  const resetFilters = useTicketStore((s) => s.resetFilters);

  return (
    <div className="rounded-xl border border-line bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Inbox size={24} className="text-ink-muted" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink">No tickets found</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">
        {hasSearchOrFilter
          ? 'No tickets match your current search or filters. Try adjusting or clearing them.'
          : 'There are no tickets yet. New customer tickets will appear here.'}
      </p>
      {hasSearchOrFilter && (
        <button
          type="button"
          onClick={resetFilters}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
