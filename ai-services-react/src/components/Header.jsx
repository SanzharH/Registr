import { services } from "../config.js";

export default function Header({ activePath, navigate }) {
  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={() => navigate("/")}>
        AI Services
      </button>
      <nav>
        {services.map((service) => (
          <button
            key={service.id}
            className={activePath === service.path ? "active" : ""}
            type="button"
            onClick={() => navigate(service.path)}
          >
            {service.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
