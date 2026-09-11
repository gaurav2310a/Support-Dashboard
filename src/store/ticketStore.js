import { create } from 'zustand';
import * as ticketApi from '../services/ticketApi';

const STATUSES = ['Open', 'In Progress', 'Resolved'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export const useTicketStore = create((set, get) => ({
  // ---- state ----
  tickets: [], // lean homepage list (id, name, subject, priority, status, createdAt)
  loading: false, // homepage list loading
  error: null, // homepage list load error
  actionError: null, // action-time error (status update / reply failure)
  sendingReply: false, // true while a reply is being persisted to the API
  selectedTicketId: null, // id of the open detail overlay
  selectedTicket: null, // full record (description, conversation, contact) or null
  selectedLoading: false, // true while fetching a ticket's full details
  selectedError: null, // detail-overlay fetch error
  searchQuery: '',
  statusFilter: 'All',
  priorityFilter: 'All',

  // ---- actions ----
  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const tickets = await ticketApi.getTickets();
      // Guard against a malformed response so we never render a crash.
      if (!Array.isArray(tickets)) {
        throw new Error('Unexpected response from the tickets API.');
      }
      set({ tickets, loading: false });
    } catch (err) {
      console.error('fetchTickets failed:', err);
      set({ error: err.message || 'Failed to load tickets', loading: false });
    }
  },

  // Fetch the full record for the detail overlay. Kept separate so Retry works.
  fetchTicketDetails: async (ticketId) => {
    set({ selectedLoading: true, selectedError: null });
    try {
      const ticket = await ticketApi.getTicketById(ticketId);
      set({ selectedTicket: ticket, selectedLoading: false });
    } catch (err) {
      console.error('fetchTicketDetails failed:', err);
      set({
        selectedError: err.message || 'Failed to load ticket details.',
        selectedLoading: false,
      });
    }
  },

  // Open the overlay: remember the id, then lazily load the full details.
  selectTicket: (id) => {
    set({ selectedTicketId: id, selectedTicket: null, selectedError: null });
    get().fetchTicketDetails(id);
  },

  closeTicket: () =>
    set({ selectedTicketId: null, selectedTicket: null, selectedError: null }),

  updateTicketStatus: async (ticketId, status) => {
    // Validate before touching the API or local state.
    if (!STATUSES.includes(status)) {
      set({ actionError: `"${status}" is not a valid status.` });
      return;
    }

    set({ actionError: null });
    try {
      await ticketApi.updateTicketStatus(ticketId, status);
      // Keep the lean list AND the full open ticket in sync.
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === ticketId ? { ...t, status } : t
        ),
        selectedTicket:
          state.selectedTicket?.id === ticketId
            ? { ...state.selectedTicket, status }
            : state.selectedTicket,
      }));
    } catch (err) {
      // API failure: do NOT update local state; surface a visible error.
      set({ actionError: err.message || 'Failed to update status. Please try again.' });
    }
  },

  // Append a support agent reply to a ticket's conversation. Updates local
  // state immediately (real-time UI) and then persists to the mock API.
  addConversationMessage: async (ticketId, body) => {
    const text = body.trim();
    if (!text || get().sendingReply) return;

    const message = {
      sender: 'agent',
      author: 'Support Agent',
      body: text,
      timestamp: new Date().toISOString(),
    };
    const conversation = [
      ...(get().selectedTicket?.id === ticketId
        ? get().selectedTicket.conversation
        : []),
      message,
    ];

    // Real-time local update on the full open ticket.
    set((state) => ({
      sendingReply: true,
      selectedTicket:
        state.selectedTicket?.id === ticketId
          ? { ...state.selectedTicket, conversation }
          : state.selectedTicket,
    }));

    try {
      await ticketApi.updateTicket(ticketId, { conversation });
      set({ sendingReply: false });
    } catch (err) {
      set({
        sendingReply: false,
        actionError: err.message || 'Failed to save your reply. Please try again.',
      });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  resetFilters: () =>
    set({ searchQuery: '', statusFilter: 'All', priorityFilter: 'All' }),

  clearError: () => set({ error: null }),
  clearActionError: () => set({ actionError: null }),
}));

// ---- derived selectors (always computed from real state) ----

export const selectFilteredTickets = (state) => {
  const query = state.searchQuery.trim().toLowerCase();
  return state.tickets.filter((ticket) => {
    const matchesStatus =
      state.statusFilter === 'All' || ticket.status === state.statusFilter;
    const matchesPriority =
      state.priorityFilter === 'All' ||
      ticket.priority === state.priorityFilter;
    // Search only hits fields present on the lean homepage records.
    const haystack = [ticket.customerName, ticket.subject]
      .join(' ')
      .toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    return matchesStatus && matchesPriority && matchesSearch;
  });
};

export const selectStats = (state) => ({
  total: state.tickets.length,
  open: state.tickets.filter((t) => t.status === 'Open').length,
  inProgress: state.tickets.filter((t) => t.status === 'In Progress').length,
  resolved: state.tickets.filter((t) => t.status === 'Resolved').length,
});

export const selectHasActiveFilters = (state) =>
  state.searchQuery.trim() !== '' ||
  state.statusFilter !== 'All' ||
  state.priorityFilter !== 'All';

export { STATUSES, PRIORITIES };
