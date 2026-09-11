import { useEffect } from 'react';
import { Tickets, Inbox, Clock, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useTicketStore, selectStats } from '../store/ticketStore';
import StatCard from '../components/dashboard/StatCard';
import TicketFilters from '../components/dashboard/TicketFilters';
import TicketTable from '../components/dashboard/TicketTable';
import TicketDetails from '../components/tickets/TicketDetails';

export default function Dashboard() {
  const fetchTickets = useTicketStore((s) => s.fetchTickets);
  // Subscribe to the stable tickets array, then derive stats inline.
  // (Passing selectStats directly to useStore would return a new object each
  // call, which triggers an infinite re-render loop in React.)
  const tickets = useTicketStore((s) => s.tickets);
  const stats = selectStats({ tickets });
  const actionError = useTicketStore((s) => s.actionError);
  const clearActionError = useTicketStore((s) => s.clearActionError);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-ink">Overview</h2>
          <p className="text-sm text-ink-muted">
            Monitor and manage customer support tickets.
          </p>
        </div>

        {/* Statistics — derived from ticket state, auto-updates on status change */}
        <section aria-label="Ticket statistics" className="mt-5">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard label="Total Tickets" value={stats.total} Icon={Tickets} color="blue" />
            <StatCard label="Open" value={stats.open} Icon={Inbox} color="blue" />
            <StatCard label="In Progress" value={stats.inProgress} Icon={Clock} color="amber" />
            <StatCard label="Resolved" value={stats.resolved} Icon={CheckCircle2} color="green" />
          </div>
        </section>

        {/* Transient status-update error, dismissed manually */}
        {actionError && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertTriangle size={16} className="mt-1 shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium">Status update failed</p>
              <p className="mt-0.5">{actionError}</p>
            </div>
            <button
              type="button"
              onClick={clearActionError}
              aria-label="Dismiss error"
              className="rounded p-1 text-red-700 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section aria-label="Support tickets" className="mt-6">
          <div className="mb-4">
            <TicketFilters />
          </div>
          <TicketTable />
        </section>
      </div>

      <TicketDetails />
    </main>
  );
}
