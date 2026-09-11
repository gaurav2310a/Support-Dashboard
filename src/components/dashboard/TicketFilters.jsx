import { Search, X } from 'lucide-react';
import { STATUSES, PRIORITIES, useTicketStore } from '../../store/ticketStore';

const selectClasses =
  'h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink focus-visible:ring-2 focus-visible:ring-primary';

export default function TicketFilters() {
  const searchQuery = useTicketStore((s) => s.searchQuery);
  const statusFilter = useTicketStore((s) => s.statusFilter);
  const priorityFilter = useTicketStore((s) => s.priorityFilter);
  const setSearchQuery = useTicketStore((s) => s.setSearchQuery);
  const setStatusFilter = useTicketStore((s) => s.setStatusFilter);
  const setPriorityFilter = useTicketStore((s) => s.setPriorityFilter);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search name, email, subject…"
          aria-label="Search tickets"
          className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-8 text-sm placeholder:text-ink-muted"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-muted hover:text-ink"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <label className="sr-only" htmlFor="status-filter">Filter by status</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${selectClasses} flex-1 sm:flex-none`}
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label className="sr-only" htmlFor="priority-filter">Filter by priority</label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className={`${selectClasses} flex-1 sm:flex-none`}
        >
          <option value="All">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
