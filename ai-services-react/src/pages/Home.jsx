import { services } from "../config.js";

export default function Home({ navigate }) {
  return (
    <section className="home-view">
      <div className="section-title">
        <h1>Доступные AI-сервисы</h1>
      </div>
      <div className="service-list">
        {services.map((service) => (
          <button className="service-row" type="button" key={service.id} onClick={() => navigate(service.path)}>
            <span>
              <strong>{service.name}</strong>
              <small>{service.description}</small>
            </span>
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
    </section>
  );
}
