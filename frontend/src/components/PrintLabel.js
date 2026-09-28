const DetailRow = ({ label, value, testId }) => (
  <div className="label-row" data-testid={testId}>
    <span className="label-key">{label}</span>
    <span className="label-value">{value}</span>
  </div>
);

const ProductDetails = ({ order, second = false, numbered = false }) => {
  const prefix = second ? "second_" : "";
  const number = second ? 2 : 1;
  const fields = [
    ["product_type", "Ürün:"],
    ["base_selection", "Altlık:"],
    ["color", "Renk:"],
    ["customization", "Yazı:"],
    ["base_text", "Altlık Yzs:"],
  ];

  return (
    <section className="label-section label-product" data-testid={`print-product-${number}`}>
      {numbered && <div className="label-product-title" data-testid={`print-product-${number}-title`}>Ürün {number}</div>}
      {fields.map(([key, label]) => order[`${prefix}${key}`] ? (
        <DetailRow key={key} label={label} value={order[`${prefix}${key}`]}
          testId={`print-product-${number}-${key.replaceAll("_", "-")}`} />
      ) : null)}
    </section>
  );
};

export default function PrintLabel({ order }) {
  if (!order) return null;
  const location = [order.is_international && order.country, order.province, order.district].filter(Boolean).join("/");

  return (
    <div className="print-label" data-testid="print-label">
      <div className="label-frame" data-print-fit data-min-font="8" data-max-font={order.has_second_product ? "11" : "12"}>
        <div className="label-details">
          <div className="label-heading" data-testid="print-order-number">SİPARİŞ #{order.order_no}</div>
          {order.has_second_product && <div className="label-product-count" data-testid="print-product-count">BU SİPARİŞTE 2 ÜRÜN VAR</div>}
          <DetailRow label="Müşteri:" value={`${order.first_name} ${order.last_name}`} testId="print-customer" />
          <DetailRow label="Telefon:" value={order.phone} testId="print-phone" />
          <ProductDetails order={order} numbered={order.has_second_product} />
          {order.has_second_product && <ProductDetails order={order} second numbered />}
          <section className="label-section" data-testid="print-shipping">
            <DetailRow label="Kargo:" value={order.cargo_company} testId="print-cargo-company" />
            <DetailRow label="Adres:" value={`${location} - ${order.address || ""}`} testId="print-address" />
          </section>
        </div>
        <footer className="label-footer" data-testid="print-payment-section">
          <div className="label-payment">
            <div data-testid="print-payment-type"><strong>Ödeme:</strong> {order.payment_type}</div>
            <strong className="label-amount" data-testid="print-amount">{order.amount} ₺</strong>
          </div>
          {order.gift_package && <div className="label-gift" data-testid="print-gift-package">HEDİYE PAKETİ</div>}
        </footer>
      </div>
    </div>
  );
}