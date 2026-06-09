"use client";

import { useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { TicketList } from "@/components/TicketList";
import { api } from "@/lib/api";
import { useConcertStore } from "@/store/useConcertStore";

export default function TicketsPage() {
  const tickets = useConcertStore((state) => state.tickets);
  const setTickets = useConcertStore((state) => state.setTickets);
  const [form, setForm] = useState({ name: "", code: "" });
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setTouched(true);

    if (!form.name.trim() || !form.code.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api.retrieveTickets(form);
      setTickets(data.tickets || [], form);
    } catch {
      setError("Could not find tickets with these details.");
      setTickets([], null);
    } finally {
      setLoading(false);
    }
  }

  if (tickets.length) {
    return (
      <>
        <PageTitle title="Your Tickets are ready!" />
        <TicketList tickets={tickets} />
      </>
    );
  }

  return (
    <>
      <PageTitle title="Retrieve your tickets." />
      <form className="retrieve-form" onSubmit={submit} noValidate>
        <label>
          Name
          <input
            value={form.name}
            className={touched && !form.name.trim() ? "invalid" : ""}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          {touched && !form.name.trim() ? <span className="field-error">The name field is required.</span> : null}
        </label>
        <label>
          Ticket code
          <input
            value={form.code}
            className={touched && !form.code.trim() ? "invalid" : ""}
            onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
          />
          {touched && !form.code.trim() ? <span className="field-error">The ticket code field is required.</span> : null}
        </label>
        {error ? <p className="status status-error">{error}</p> : null}
        <button className="button button-primary" disabled={loading} type="submit">
          Get Tickets
        </button>
      </form>
    </>
  );
}
