export default function PrintNote({ order }) {
  if (!order?.order_note?.trim()) return null;

  return (
    <div className="print-note" data-testid="print-note">
      <div className="note-card" data-testid="print-note-card">
        <img className="note-artwork" src="/assets/gift-note-card.png" alt="" aria-hidden="true" data-testid="print-note-artwork" />
        <div className="note-content" data-print-fit data-min-font="9" data-max-font="18">
          <p className="note-text" data-testid="print-note-text">{order.order_note}</p>
        </div>
      </div>
    </div>
  );
}