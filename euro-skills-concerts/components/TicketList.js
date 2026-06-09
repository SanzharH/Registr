"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import { useConcertStore } from "@/store/useConcertStore";

export function TicketList({ tickets }) {
  const router = useRouter();
  const lookup = useConcertStore((state) => state.ticketLookup);
  const removeTicket = useConcertStore((state) => state.removeTicket);

  if (!tickets.length) {
    return null;
  }

  const first = tickets[0];

  async function cancelTicket(ticket) {
    const confirmed = window.confirm("Do you really want to cancel this ticket?");
    if (!confirmed) {
      return;
    }

    const payload = {
      code: lookup?.code || ticket.code,
      name: lookup?.name || ticket.name
    };

    await api.cancelTicket(ticket.id, payload);
    removeTicket(ticket.id);

    if (tickets.length === 1) {
      router.push("/");
    }
  }

  return (
    <section className="tickets-layout">
      <div className="booking-summary">
        <h2>Booking Details</h2>
        <dl>
          <div>
            <dt>Name</dt>
            <dd>{first.name}</dd>
          </div>
          <div>
            <dt>Booked On</dt>
            <dd>{formatDate(first.created_at)}</dd>
          </div>
        </dl>
      </div>

      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <article className="ticket-card" key={ticket.id}>
            <div>
              <p className="ticket-code">{ticket.code}</p>
              <h2>{ticket.show.concert.artist}</h2>
              <p>{ticket.show.concert.location.name}</p>
            </div>
            <dl className="ticket-facts">
              <div>
                <dt>Row</dt>
                <dd>{ticket.row.name}</dd>
              </div>
              <div>
                <dt>Seat</dt>
                <dd>{ticket.seat}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>
                  {formatTime(ticket.show.start)} - {formatTime(ticket.show.end)}
                </dd>
              </div>
            </dl>
            <button className="button button-danger" onClick={() => cancelTicket(ticket)}>
              Cancel ticket
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
