# AI Services React SPA

React client for the AI Services REST API.

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5174`.

The app uses `https://testuser1-task1-3847.infra.wsk17.dev` as the default API base URL. You can override it with:

```bash
VITE_API_BASE=https://your-server.example
```

Enter an API token generated in the admin panel. The token is stored only in the current browser local storage and is sent as `X-API-TOKEN`.
