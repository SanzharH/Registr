export default function ProgressBar({ value }) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="progress" aria-label={`Прогресс ${safeValue}%`}>
      <span style={{ width: `${safeValue}%` }} />
      <strong>{Math.round(safeValue)}%</strong>
    </div>
  );
}
