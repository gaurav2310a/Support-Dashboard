import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';

export default function ErrorState() {
  const error = useTicketStore((s) => s.error);
  const fetchTickets = useTicketStore((s) => s.fetchTickets);

  return (
    <div className="rounded-xl border border-line bg-white px-6 py-16 text-center" role="alert">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={24} className="text-red-600" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink">Something went wrong</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">
        {error || 'Unable to load tickets. Please check your connection.'}
      </p>
      <button
        type="button"
        onClick={fetchTickets}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
      >
        <RotateCcw size={14} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}
