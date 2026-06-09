"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/PageTitle";
import { SelectedSeats } from "@/components/SelectedSeats";
import { api } from "@/lib/api";
import { countries } from "@/lib/countries";
import { formatCountdown, formatDate, formatTime } from "@/lib/format";
import { useConcertStore } from "@/store/useConcertStore";

const emptyForm = {
  name: "",
  address: "",
  city: "",
  zip: "",
  country: ""
};

export default function BookingPage({ params }) {
  const { concertId, showId } = use(params);
  const router = useRouter();
  const { loadConcerts, findShow, setTickets } = useConcertStore();
  const show = useConcertStore((state) => state.findShow(concertId, showId));
  const [rows, setRows] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservationToken, setReservationToken] = useState("");
  const [reservedUntil, setReservedUntil] = useState(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [step, setStep] = useState("seats");
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConcerts();
  }, [loadConcerts]);

  useEffect(() => {
    async function loadSeating() {
      try {
        const data = await api.getSeating(concertId, showId);
        setRows(data.rows || []);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadSeating();
  }, [concertId, showId]);

  useEffect(() => {
    if (!reservedUntil) {
      return;
    }

    const interval = window.setInterval(() => {
      const nextRemaining = new Date(reservedUntil).getTime() - Date.now();
      setRemainingMs(nextRemaining);
      if (nextRemaining <= 0) {
        window.clearInterval(interval);
        window.alert("Your seat reservation expired. The reservation has been cancelled.");
        setSelectedSeats([]);
        setReservationToken("");
        setReservedUntil(null);
        setStep("seats");
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [reservedUntil]);

  const selectedMap = useMemo(() => new Set(selectedSeats.map((seat) => `${seat.row}-${seat.seat}`)), [selectedSeats]);
  const missingFields = Object.entries(form).filter(([, value]) => !value.trim()).map(([key]) => key);

  async function updateReservation(nextSeats) {
    setError("");
    setLoading(true);

    try {
      const data = await api.reserveSeats(concertId, showId, {
        reservation_token: reservationToken || undefined,
        reservations: nextSeats.map((seat) => ({ row: seat.row, seat: seat.seat })),
        duration: 300
      });
      setSelectedSeats(nextSeats);
      setReservationToken(data.reservation_token || reservationToken);
      setReservedUntil(nextSeats.length ? data.reserved_until : null);
      setRemainingMs(nextSeats.length ? new Date(data.reserved_until).getTime() - Date.now() : 0);
    } catch (requestError) {
      setError(requestError.fields?.reservations || requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleSeat(row, seat) {
    const key = `${row.id}-${seat}`;
    const nextSeats = selectedMap.has(key)
      ? selectedSeats.filter((selected) => `${selected.row}-${selected.seat}` !== key)
      : [...selectedSeats, { row: row.id, rowName: row.name, seat }];
    updateReservation(nextSeats);
  }

  async function submitBooking(event) {
    event.preventDefault();
    setTouched({ name: true, address: true, city: true, zip: true, country: true });

    if (missingFields.length) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api.bookTickets(concertId, showId, {
        reservation_token: reservationToken,
        ...form
      });
      const tickets = data.tickets || [];
      setTickets(tickets, tickets[0] ? { name: tickets[0].name, code: tickets[0].code } : null);
      router.push("/tickets");
    } catch (requestError) {
      setError(Object.values(requestError.fields || {})[0] || requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageTitle title={show ? `Book ${show.artist}` : "Book seats"} eyebrow={show ? `${formatDate(show.start)} · ${formatTime(show.start)} - ${formatTime(show.end)} · ${show.location.name}` : ""} />

      {error ? <p className="status status-error">{error}</p> : null}

      <section className="booking-layout">
        <div className="seating-area">
          <div className="stage">Stage</div>
          <div className="seat-legend">
            <span><i className="seat available" /> Available</span>
            <span><i className="seat selected" /> Selected</span>
            <span><i className="seat unavailable" /> Unavailable</span>
          </div>
          {reservedUntil ? <p className="timer">Reservation expires in {formatCountdown(remainingMs)}</p> : null}

          <div className="rows">
            {rows.map((row) => (
              <div className="seat-row" key={row.id}>
                <span className="row-name">{row.name}</span>
                <div className="seat-line">
                  {Array.from({ length: row.seats.total }, (_, index) => index + 1).map((seat) => {
                    const unavailable = row.seats.unavailable.includes(seat);
                    const selected = selectedMap.has(`${row.id}-${seat}`);
                    return (
                      <button
                        className={`seat ${unavailable ? "unavailable" : ""} ${selected ? "selected" : ""}`}
                        disabled={unavailable || loading}
                        key={seat}
                        onClick={() => toggleSeat(row, seat)}
                        title={`${row.name}, seat ${seat}`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="side-stack">
          <SelectedSeats seats={selectedSeats} />
          {step === "seats" ? (
            <button className="button button-primary" disabled={!selectedSeats.length || loading} onClick={() => setStep("form")}>
              Confirm seats
            </button>
          ) : (
            <form className="booking-form" onSubmit={submitBooking} noValidate>
              {Object.keys(emptyForm).map((field) => (
                <label key={field}>
                  {field === "zip" ? "Zip code" : field[0].toUpperCase() + field.slice(1)}
                  {field === "country" ? (
                    <select
                      value={form.country}
                      className={touched.country && !form.country ? "invalid" : ""}
                      onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))}
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form[field]}
                      className={touched[field] && !form[field].trim() ? "invalid" : ""}
                      onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                    />
                  )}
                </label>
              ))}
              <button className="button button-primary" disabled={loading} type="submit">
                Book
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
