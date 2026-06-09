"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

function flattenShows(concerts) {
  return concerts.flatMap((concert) =>
    concert.shows.map((show) => ({
      ...show,
      concertId: concert.id,
      artist: concert.artist,
      location: concert.location
    }))
  );
}

export const useConcertStore = create((set, get) => ({
  concerts: [],
  shows: [],
  hasLoadedConcerts: false,
  loadingConcerts: false,
  concertError: "",
  tickets: [],
  ticketLookup: null,
  async loadConcerts() {
    if (get().hasLoadedConcerts || get().loadingConcerts) {
      return;
    }

    set({ loadingConcerts: true, concertError: "" });

    try {
      const data = await api.getConcerts();
      const concerts = data.concerts || [];
      set({
        concerts,
        shows: flattenShows(concerts),
        hasLoadedConcerts: true,
        loadingConcerts: false
      });
    } catch (error) {
      set({
        concertError: error.message || "Could not load concerts.",
        loadingConcerts: false
      });
    }
  },
  findShow(concertId, showId) {
    return get().shows.find((show) => String(show.concertId) === String(concertId) && String(show.id) === String(showId));
  },
  setTickets(tickets, lookup = null) {
    set({ tickets, ticketLookup: lookup });
  },
  removeTicket(ticketId) {
    set((state) => ({ tickets: state.tickets.filter((ticket) => ticket.id !== ticketId) }));
  },
  clearTickets() {
    set({ tickets: [], ticketLookup: null });
  }
}));
