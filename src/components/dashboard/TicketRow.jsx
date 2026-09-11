import { useTicketStore, STATUSES } from '../../store/ticketStore';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate } from '../../utils/format';

export function StatusSelect({ ticket }) {
  const updateTicketStatus = useTicketStore((s) => s.updateTicketStatus);
  return (
    <select
      value={ticket.status}
      onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
      onClick={(e) => e.stopPropagation()}
      aria-label={`Change status for ticket: ${ticket.subject}`}
      className="h-8 rounded-lg border border-line bg-white px-2 text-xs text-ink"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

export default function TicketRow({ ticket, onOpen }) {
  return (
    <tr className="cursor-pointer border-b border-line last:border-0 hover:bg-surface/70">
      <td onClick={onOpen} className="px-4 py-3.5 text-left text-sm font-medium text-ink hover:text-primary">
          {ticket.subject}
        <p className="mt-0.5 text-xs text-ink-muted">{ticket.customerName}</p>
      </td>
      <td className="px-4 py-3.5"><PriorityBadge priority={ticket.priority} /></td>
      <td className="px-4 py-3.5"><StatusBadge status={ticket.status} /></td>
      <td className="px-4 py-3.5 text-sm text-ink-muted">{formatDate(ticket.createdAt)}</td>
      <td className="px-4 py-3.5">
        <StatusSelect ticket={ticket} />
      </td>
    </tr>
  );
}
