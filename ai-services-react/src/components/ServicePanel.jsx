export default function ServicePanel({ title, subtitle, token, error, children }) {
  return (
    <section className="service-view">
      <div className="section-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {!token && <div className="alert warning">Введите API-токен, чтобы включить запросы к сервису.</div>}
      {error && <div className="alert error">{error}</div>}
      {children}
    </section>
  );
}
