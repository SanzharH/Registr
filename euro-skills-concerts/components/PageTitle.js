export function PageTitle({ title, eyebrow }) {
  return (
    <section className="page-title">
      {eyebrow ? <p>{eyebrow}</p> : null}
      <h1>{title}</h1>
    </section>
  );
}
