# Kinotower site

Nuxt frontend for the Kinotower REST API.

## Run

```bash
npm install
npm run dev -- --port 3001
```

Open `http://127.0.0.1:3001`.

During local development Vite proxies `/api/v1` to `http://kt.polytech.edu.kz`.
For deployment without a proxy, set:

```bash
VITE_API_BASE=http://kt.polytech.edu.kz/api/v1
```

## Features

- film catalog with pagination, genre/country filters and sorting
- film details with reviews, rating and review submission
- signup, signin and signout
- profile view, edit and delete
- user reviews and ratings tabs with delete actions

## Structure

- `pages/` - Nuxt routes: catalog, auth, film details and profile pages
- `components/` - reusable UI blocks such as header, film cards, filters and review list
- `composables/` - shared API and session logic
- `utils/` - small formatting helpers
- `src/style.css` - global styles
