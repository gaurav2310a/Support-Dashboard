import { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  User,
  Send,
  LoaderCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import StatusBadge from '../dashboard/StatusBadge';
import PriorityBadge from '../dashboard/PriorityBadge';
import Conversation from './Conversation';
import { STATUSES, useTicketStore } from '../../store/ticketStore';
import { formatDateTime } from '../../utils/format';

export default function TicketDetails() {
  const ticketId = useTicketStore((s) => s.selectedTicketId);
  const ticket = useTicketStore((s) => s.selectedTicket);
  const selectedLoading = useTicketStore((s) => s.selectedLoading);
  const selectedError = useTicketStore((s) => s.selectedError);
  const closeTicket = useTicketStore((s) => s.closeTicket);
  const fetchTicketDetails = useTicketStore((s) => s.fetchTicketDetails);
  const updateTicketStatus = useTicketStore((s) => s.updateTicketStatus);
  const addConversationMessage = useTicketStore((s) => s.addConversationMessage);
  const sendingReply = useTicketStore((s) => s.sendingReply);
  const actionError = useTicketStore((s) => s.actionError);
  const clearActionError = useTicketStore((s) => s.clearActionError);
  const [draft, setDraft] = useState('');

  // Overlay is only open when a ticket id is selected.
  if (!ticketId) return null;

  const canSend = draft.trim().length > 0 && !sendingReply;

  const handleReply = () => {
    if (!canSend) return;
    addConversationMessage(ticket.id, draft);
    setDraft('');
  };

  const handleReplyKeyDown = (e) => {
    // Enter sends the reply; Shift+Enter inserts a newline.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 overflow-y-auto bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-details-title"
    >
      {/* Full-screen overlay header */}
      <header className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-white p-4 sm:p-5">
        <div className="min-w-0">
          <h2 id="ticket-details-title" className="text-base font-semibold text-ink">
            {ticket?.subject || 'Loading ticket…'}
          </h2>
          <p className="mt-1 text-xs text-ink-muted">Ticket #{ticketId}</p>
        </div>
        <button
          type="button"
          onClick={closeTicket}
          aria-label="Close ticket details"
          className="rounded-lg p-2 text-ink-muted hover:bg-surface hover:text-ink"
        >
          <X size={20} />
        </button>
      </header>

      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        {selectedLoading ? (
          <DetailsSkeleton />
        ) : selectedError || !ticket ? (
          <DetailsError
            message={selectedError}
            onRetry={() => fetchTicketDetails(ticketId)}
          />
        ) : (
          <TicketContent
            ticket={ticket}
            actionError={actionError}
            clearActionError={clearActionError}
            updateTicketStatus={updateTicketStatus}
            draft={draft}
            setDraft={setDraft}
            canSend={canSend}
            sendingReply={sendingReply}
            handleReply={handleReply}
            handleReplyKeyDown={handleReplyKeyDown}
          />
        )}
      </div>
    </div>
  );
}
/* Renders the loaded ticket detail body. */
function TicketContent({
  ticket,
  actionError,
  clearActionError,
  updateTicketStatus,
  draft,
  setDraft,
  canSend,
  sendingReply,
  handleReply,
  handleReplyKeyDown,
}) {
  return (
    <>
      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
      </div>

      {/* Inline action error (status update or reply send failure) */}
      {actionError && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertTriangle size={16} className="mt-1 shrink-0" aria-hidden="true" />
          <p className="flex-1">{actionError}</p>
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

      <label htmlFor="drawer-status" className="mt-4 block w-full text-xs font-medium text-ink-muted">
        Change status
      </label>
      <select
        id="drawer-status"
        value={ticket.status}
        onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="mt-1.5 h-10 w-auto rounded-lg border border-line bg-white px-3 text-sm text-ink"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Customer info */}
      <section className="mt-6" aria-label="Customer information">
        <h3 className="text-sm font-semibold text-ink">Customer</h3>
        <dl className="mt-3 rounded-xl border border-line bg-surface/60 p-4 text-sm">
          <div className="flex items-center gap-2.5">
            <User size={15} className="text-ink-muted" aria-hidden="true" />
            <dt className="sr-only">Name</dt>
            <dd className="font-medium text-ink">{ticket.customerName}</dd>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <Mail size={15} className="text-ink-muted" aria-hidden="true" />
            <dt className="sr-only">Email</dt>
            <dd>
              <a href={`mailto:${ticket.customerEmail}`} className="text-primary hover:underline">
                {ticket.customerEmail}
              </a>
            </dd>
          </div>
          {ticket.customerPhone && (
            <div className="mt-2.5 flex items-center gap-2.5">
              <Phone size={15} className="text-ink-muted" aria-hidden="true" />
              <dt className="sr-only">Phone</dt>
              <dd className="text-ink">{ticket.customerPhone}</dd>
            </div>
          )}
          <div className="mt-2.5 flex items-center gap-2.5">
            <Calendar size={15} className="text-ink-muted" aria-hidden="true" />
            <dt className="sr-only">Created</dt>
            <dd className="text-ink-muted">{formatDateTime(ticket.createdAt)}</dd>
          </div>
        </dl>
      </section>

      {/* Description */}
      <section className="mt-6" aria-label="Issue description">
        <h3 className="text-sm font-semibold text-ink">Description</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">
          {ticket.description}
        </p>
      </section>

      <div className="mt-6">
        <Conversation messages={ticket.conversation} />
      </div>

      {/* Continue conversation — reply form, updates in real time */}
      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleReply();
        }}
      >
        <label htmlFor="conversation-reply" className="block text-xs font-medium text-ink-muted">
          Reply to customer
        </label>
        <textarea
          id="conversation-reply"
          rows="3"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleReplyKeyDown}
          disabled={sendingReply}
          placeholder="Type a message…"
          className="mt-1.5 w-full resize-y rounded-lg border border-line bg-white p-3 text-sm text-ink placeholder:text-ink-muted disabled:bg-surface"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:bg-primary/40 disabled:text-white"
          >
            {sendingReply ? (
              <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
            ) : (
              <Send size={15} aria-hidden="true" />
            )}
            {sendingReply ? 'Sending…' : 'Send reply'}
          </button>
        </div>
      </form>
    </>
  );
}
/* Pulsing skeleton shown while full details load. */
function DetailsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-4 h-10 animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-6 h-4 w-24 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-20 animate-pulse rounded-xl bg-slate-200" />
      <div className="mt-6 h-4 w-24 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-16 animate-pulse rounded bg-slate-200" />
    </div>
  );
}

/* Error state for a failed detail fetch, with Retry. */
function DetailsError({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-line bg-white px-6 py-16 text-center" role="alert">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={24} className="text-red-600" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink">Couldn't load this ticket</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">
        {message || 'Unable to load the ticket details. Please try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
      >
        <RotateCcw size={14} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}
