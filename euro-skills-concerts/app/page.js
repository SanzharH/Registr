"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageTitle } from "@/components/PageTitle";
import { dateInputValue, formatDate, formatTime } from "@/lib/format";
import { useConcertStore } from "@/store/useConcertStore";

export default function HomePage() {
  const { shows, loadingConcerts, concertError, loadConcerts } = useConcertStore();
  const [filters, setFilters] = useState({ location: "all", artist: "all", date: "" });

  useEffect(() => {
    loadConcerts();
  }, [loadConcerts]);

  const locations = useMemo(() => [...new Set(shows.map((show) => show.location.name))].sort(), [shows]);
  const artists = useMemo(() => [...new Set(shows.map((show) => show.artist))].sort(), [shows]);
  const filteredShows = useMemo(
    () =>
      shows.filter((show) => {
        const locationMatches = filters.location === "all" || show.location.name === filters.location;
        const artistMatches = filters.artist === "all" || show.artist === filters.artist;
        const dateMatches = !filters.date || dateInputValue(show.start) === filters.date;
        return locationMatches && artistMatches && dateMatches;
      }),
    [filters, shows]
  );

  const hasFilter = filters.location !== "all" || filters.artist !== "all" || Boolean(filters.date);

  return (
    <>
      <PageTitle title="Checkout these amazing concerts in Graz." eyebrow="Discover concerts" />

      <section className="filters" aria-label="Concert filters">
        <label>
          Location
          <select value={filters.location} onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}>
            <option value="all">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <label>
          Artist
          <select value={filters.artist} onChange={(event) => setFilters((current) => ({ ...current, artist: event.target.value }))}>
            <option value="all">All Artists</option>
            {artists.map((artist) => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} />
        </label>

        {hasFilter ? (
          <button className="button button-ghost" onClick={() => setFilters({ location: "all", artist: "all", date: "" })}>
            Clear
          </button>
        ) : null}
      </section>

      {loadingConcerts ? <p className="status">Loading concerts...</p> : null}
      {concertError ? <p className="status status-error">{concertError}</p> : null}
      {!loadingConcerts && !concertError && filteredShows.length === 0 ? (
        <p className="status">No shows are matching the current filter criteria.</p>
      ) : null}

      <section className="show-grid" aria-label="Concert shows">
        {filteredShows.map((show) => (
          <Link className="show-card" key={`${show.concertId}-${show.id}`} href={`/booking/${show.concertId}/${show.id}`}>
            <p className="show-date">{formatDate(show.start)}</p>
            <h2>{show.artist}</h2>
            <p>{show.location.name}</p>
            <p className="show-time">
              {formatTime(show.start)} - {formatTime(show.end)}
            </p>
          </Link>
        ))}
      </section>
    </>
  );
}
