const API_BASE_URL = "http://apic.polytech.edu.kz/api/v1";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.fields = data?.fields || {};
    throw error;
  }

  return data;
}

export const api = {
  getConcerts: () => request("/concerts"),
  getSeating: (concertId, showId) => request(`/concerts/${concertId}/shows/${showId}/seating`),
  reserveSeats: (concertId, showId, body) =>
    request(`/concerts/${concertId}/shows/${showId}/reservation`, {
      method: "POST",
      body: JSON.stringify(body)
    }),
  bookTickets: (concertId, showId, body) =>
    request(`/concerts/${concertId}/shows/${showId}/booking`, {
      method: "POST",
      body: JSON.stringify(body)
    }),
  retrieveTickets: (body) =>
    request("/tickets", {
      method: "POST",
      body: JSON.stringify(body)
    }),
  cancelTicket: (ticketId, body) =>
    request(`/tickets/${ticketId}/cancel`, {
      method: "POST",
      body: JSON.stringify(body)
    })
};
