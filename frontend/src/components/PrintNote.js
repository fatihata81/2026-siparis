const PrintNote = ({ order }) => {
  if (!order || !order.order_note) return null;

  return (
    <div className="print-note hidden print:block">
      <div 
        className="note-card"
        style={{
          backgroundImage: `url('https://customer-assets.emergentagent.com/job_order-manager-82/artifacts/2hhsjpsw_kart.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="note-content">
          <p className="note-text">{order.order_note}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintNote;
