import { useTicketStore, selectFilteredTickets } from '../../store/ticketStore';
import TicketRow from './TicketRow';
import TicketCard from './TicketCard';
import TicketSkeleton from './TicketSkeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

function useOpenTicket() {
  const selectTicket = useTicketStore((s) => s.selectTicket);
  return (ticket) => selectTicket(ticket.id);
}

export default function TicketTable() {
  // Subscribe to stable primitive slices, then derive the filtered list
  // inline. Passing selectFilteredTickets to useStore directly would return a
  // fresh array each call and cause an infinite re-render loop in React.
  const allTickets = useTicketStore((s) => s.tickets);
  const searchQuery = useTicketStore((s) => s.searchQuery);
  const statusFilter = useTicketStore((s) => s.statusFilter);
  const priorityFilter = useTicketStore((s) => s.priorityFilter);
  const loading = useTicketStore((s) => s.loading);
  const error = useTicketStore((s) => s.error);
  const openTicket = useOpenTicket();

  const tickets = selectFilteredTickets({
    tickets: allTickets,
    searchQuery,
    statusFilter,
    priorityFilter,
  });

  if (error && tickets.length === 0) return <ErrorState />;
  if (loading) return <TicketSkeleton />;
  if (tickets.length === 0) return <EmptyState />;

  return (
    <>
      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-xl border border-line bg-white md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line bg-surface/60 text-xs font-medium uppercase tracking-wide text-ink-muted">
              <th scope="col" className="px-4 py-3">Ticket</th>
              <th scope="col" className="px-4 py-3">Priority</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Created At</th>
              <th scope="col" className="px-4 py-3">Change status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onOpen={() => openTicket(ticket)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet: cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} onOpen={() => openTicket(ticket)} />
        ))}
      </div>
    </>
  );
}
