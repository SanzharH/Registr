export function SelectedSeats({ seats }) {
  return (
    <aside className="selected-panel">
      <h2>Selected Seats</h2>
      {seats.length === 0 ? (
        <p className="muted">No seats selected. Click on a seat to make a reservation.</p>
      ) : (
        <ul>
          {seats.map((seat) => (
            <li key={`${seat.row}-${seat.seat}`}>
              Row: {seat.rowName}, Seat: {seat.seat}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
