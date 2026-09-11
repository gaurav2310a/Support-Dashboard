import { ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { StatusSelect } from './TicketRow';
import { formatDate } from '../../utils/format';

export default function TicketCard({ ticket, onOpen }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <button
        type="button"
        onClick={onOpen}
        className="w-full text-left"
        aria-label={`Open ticket: ${ticket.subject}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{ticket.subject}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {ticket.customerName} · {formatDate(ticket.createdAt)}
            </p>
          </div>
          <ChevronRight size={16} className="mt-1 shrink-0 text-ink-muted" aria-hidden="true" />
        </div>
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        <div className="ml-auto">
          <StatusSelect ticket={ticket} />
        </div>
      </div>
    </div>
  );
}
