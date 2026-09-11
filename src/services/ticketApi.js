const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Fields the dashboard (homepage) list actually renders. Heavy fields
// (description, conversation, contact) are fetched on demand via getTicketById.
const LEAN_FIELDS = ['id', 'customerName', 'subject', 'priority', 'status', 'createdAt'];

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export function getTickets() {
  // Homepage slice. JSON Server always returns the full record, so we project
  // down to only the fields the list UI renders; heavy detail (description,
  // conversation, contact) stays out of the homepage payload.
  return request('/tickets').then((tickets) =>
    tickets.map((ticket) => {
      const lean = {};
      LEAN_FIELDS.forEach((field) => {
        lean[field] = ticket[field];
      });
      return lean;
    })
  );
}

export function getTicketById(id) {
  // Full record with description + conversation for the detail overlay.
  return request(`/tickets/${id}`);
}

export function updateTicket(id, data) {
  return request(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function updateTicketStatus(id, status) {
  return updateTicket(id, { status });
}
