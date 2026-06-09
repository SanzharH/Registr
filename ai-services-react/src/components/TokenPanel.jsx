import { useState } from "react";

export default function TokenPanel({ token, setToken, apiBase, setApiBase }) {
  const [isOpen, setIsOpen] = useState(!token);

  return (
    <section className="settings-strip">
      <button className="settings-toggle" type="button" onClick={() => setIsOpen((value) => !value)}>
        {token ? "Токен подключен" : "Введите API-токен"}
      </button>
      {isOpen && (
        <div className="settings-grid">
          <label>
            API base URL
            <input value={apiBase} onChange={(event) => setApiBase(event.target.value)} />
          </label>
          <label>
            API token
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="X-API-TOKEN"
              type="password"
            />
          </label>
          <button type="button" onClick={() => setToken("")}>
            Сбросить
          </button>
        </div>
      )}
    </section>
  );
}
