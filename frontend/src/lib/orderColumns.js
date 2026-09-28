export const ORDER_COLUMNS = [
  { id: "order_no", label: "Sipariş No", testKey: "number", className: "font-medium" },
  { id: "date", label: "Tarih", testKey: "date", className: "text-sm" },
  { id: "name", label: "Ad Soyad", testKey: "name" },
  { id: "phone", label: "Telefon", testKey: "phone", className: "text-sm" },
  { id: "province", label: "İl", testKey: "province", className: "text-sm" },
  { id: "product_type", label: "Ürün", testKey: "product", className: "text-sm", alwaysVisible: true },
  { id: "payment_type", label: "Ödeme", userLabel: "Ödeme Tipi", testKey: "payment", className: "text-sm" },
  { id: "amount", label: "Tutar", testKey: "amount", className: "font-semibold text-orange-600" },
  { id: "status", label: "Durum", testKey: "status", className: "order-wide-cell" },
  { id: "cargo_company", label: "Kargo", testKey: "cargo", className: "text-sm" },
  { id: "features", label: "Özellik", testKey: "features", centered: true },
  { id: "order_note", label: "Sipariş Notu", testKey: "note", centered: true },
  { id: "actions", label: "İşlemler", testKey: "actions", className: "order-wide-cell", centered: true },
];

export const USER_COLUMNS = ORDER_COLUMNS.filter((column) => !column.alwaysVisible)
  .map(({ id, label, userLabel }) => ({ id, label: userLabel || label }));

export const STATUS_OPTIONS = ["Yeni Sipariş", "Hazırlanıyor", "Üretime Verildi", "Üretim Bitti", "Eksik Bilgi", "Teslim Edildi"];
export const STATUS_COLORS = {
  "Yeni Sipariş": "bg-blue-500", "Hazırlanıyor": "bg-yellow-500", "Üretime Verildi": "bg-orange-500",
  "Üretim Bitti": "bg-purple-500", "Eksik Bilgi": "bg-red-500", "Teslim Edildi": "bg-green-500",
};