import { MessageCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/format';

export default function Conversation({ messages }) {
  return (
    <section aria-label="Conversation">
      <h3 className="text-sm font-semibold text-ink">Conversation</h3>
      {messages.length === 0 && (
        <div className="mt-3 rounded-xl border border-dashed border-line bg-surface/40 px-4 py-8 text-center">
          <MessageCircle
            size={22}
            className="mx-auto text-ink-muted"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-medium text-ink">No messages yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Use the reply box below to send the first message to this customer.
          </p>
        </div>
      )}
      <ol className="mt-3 flex flex-col gap-4">
        {messages.map((message, index) => {
          const isAgent = message.sender === 'agent';
          return (
            <li
              key={`${message.timestamp}-${index}`}
              className={`rounded-xl border border-line p-4 ${
                isAgent ? 'bg-primary-light/40' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-ink">
                  {isAgent ? 'Support Agent' : message.author}
                </p>
                <time className="text-xs text-ink-muted" dateTime={message.timestamp}>
                  {formatDateTime(message.timestamp)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink">{message.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
