export default function NotFound({ navigate }) {
  return (
    <section className="service-view">
      <div className="section-title">
        <h1>Страница не найдена</h1>
      </div>
      <button className="primary" type="button" onClick={() => navigate("/")}>
        На главную
      </button>
    </section>
  );
}
