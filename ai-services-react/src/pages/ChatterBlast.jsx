import { useEffect, useRef, useState } from "react";
import ServicePanel from "../components/ServicePanel.jsx";
import TypewriterText from "../components/TypewriterText.jsx";

export default function ChatterBlast({ client, token }) {
  const [prompt, setPrompt] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [response, setResponse] = useState("");
  const [isFinal, setIsFinal] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const pollingRef = useRef(null);

  useEffect(() => () => clearInterval(pollingRef.current), []);

  const pollResponse = (id) => {
    clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const data = await client.get(`/api/chat/conversation/${encodeURIComponent(id)}`);
        setResponse(data.response || "");
        setIsFinal(Boolean(data.is_final));
        if (data.is_final) {
          clearInterval(pollingRef.current);
          setIsSending(false);
        }
      } catch (requestError) {
        clearInterval(pollingRef.current);
        setIsSending(false);
        setError(requestError.message);
      }
    }, 1000);
  };

  const sendMessage = async () => {
    if (!prompt.trim()) {
      setError("Введите сообщение для чат-бота.");
      return;
    }

    setError("");
    setIsSending(true);

    try {
      const path = conversationId
        ? `/api/chat/conversation/${encodeURIComponent(conversationId)}`
        : "/api/chat/conversation";
      const method = conversationId ? "put" : "post";
      const data = await client[method](path, { prompt: prompt.trim() });

      setConversationId(data.conversation_id || conversationId);
      setResponse(data.response || "");
      setIsFinal(Boolean(data.is_final));
      setPrompt("");

      if (data.is_final) {
        setIsSending(false);
      } else {
        pollResponse(data.conversation_id || conversationId);
      }
    } catch (requestError) {
      setIsSending(false);
      setError(requestError.message);
    }
  };

  const startNewConversation = () => {
    clearInterval(pollingRef.current);
    setConversationId("");
    setResponse("");
    setPrompt("");
    setIsFinal(true);
    setIsSending(false);
    setError("");
  };

  return (
    <ServicePanel
      title="ChatterBlast"
      subtitle="Отправляйте сообщения и получайте ответ по мере готовности."
      token={token}
      error={error}
    >
      <div className="chat-layout">
        <label>
          Сообщение
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            disabled={isSending && !isFinal}
            placeholder="Напишите сообщение"
          />
        </label>
        <div className="button-row">
          <button type="button" onClick={() => setPrompt("")} disabled={isSending}>
            Очистить
          </button>
          <button className="primary" type="button" onClick={sendMessage} disabled={!token || isSending}>
            {isSending ? "Ожидание..." : "Отправить"}
          </button>
          <button type="button" onClick={startNewConversation}>
            Новый разговор
          </button>
        </div>
        <div className="output-box">
          <TypewriterText text={response} isFinal={isFinal} />
        </div>
      </div>
    </ServicePanel>
  );
}
