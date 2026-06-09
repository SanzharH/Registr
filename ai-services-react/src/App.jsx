import { useMemo } from "react";
import { createApiClient } from "./api/client.js";
import Header from "./components/Header.jsx";
import TokenPanel from "./components/TokenPanel.jsx";
import { DEFAULT_API_BASE, routes } from "./config.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useRouter } from "./hooks/useRouter.js";
import ChatterBlast from "./pages/ChatterBlast.jsx";
import DreamWeaver from "./pages/DreamWeaver.jsx";
import Home from "./pages/Home.jsx";
import MindReader from "./pages/MindReader.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const { activePath, navigate } = useRouter();
  const [token, setToken] = useLocalStorage("ai-services-token", "");
  const [apiBase, setApiBase] = useLocalStorage("ai-services-api-base", DEFAULT_API_BASE);
  const client = useMemo(() => createApiClient(apiBase, token), [apiBase, token]);

  return (
    <div className="app-shell">
      <Header activePath={activePath} navigate={navigate} />
      <TokenPanel token={token} setToken={setToken} apiBase={apiBase} setApiBase={setApiBase} />
      <main>
        {activePath === routes.home && <Home navigate={navigate} />}
        {activePath === routes.chat && <ChatterBlast client={client} token={token} />}
        {activePath === routes.imageGeneration && <DreamWeaver client={client} token={token} />}
        {activePath === routes.imageRecognition && <MindReader client={client} token={token} />}
        {!Object.values(routes).includes(activePath) && <NotFound navigate={navigate} />}
      </main>
    </div>
  );
}
