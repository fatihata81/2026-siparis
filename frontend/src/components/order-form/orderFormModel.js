export const CARGO_COMPANIES = ["DHL", "Yurtiçi", "Aras", "Sürat", "PTT"];
export const PRODUCT_TYPES = ["LED Lamba", "Kupa Bardak", "Sihirli Kupa", "Anahtarlık"];
export const BASE_SELECTIONS = ["Dikdörtgen", "Kalp"];
export const COLORS = ["Günışığı", "Kırmızı", "Yeşil", "Pembe", "Mavi", "RGB"];
export const PAYMENT_TYPES = ["Kapıda Ödeme", "Havale", "Web", "Web Kapıda Ödeme"];

export const createOrderFormState = (order) => {
  const defaults = {
    first_name: "", last_name: "", phone: "", show_tc: false, tc_no: "",
    show_email: false, email: "", is_international: false, country: "",
    province: "İstanbul", district: "", address: "", cargo_company: "DHL",
    product_type: "LED Lamba", base_selection: "", color: "Günışığı",
    customization: "", base_text: "", has_second_product: false,
    second_product_type: "", second_base_selection: "", second_color: "",
    second_customization: "", second_base_text: "", payment_type: "",
    amount: "", gift_package: false, order_note: "",
  };
  if (!order) return defaults;
  const values = Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, order[key] || fallback]));
  return { ...values, show_tc: !!order.tc_no, show_email: !!order.email,
    payment_type: order.payment_type ?? "", amount: order.amount?.toString() || "" };
};

export const validateOrderForm = (data) => {
  const required = ["first_name", "last_name", "phone", "province", "district", "address", "cargo_company", "product_type", "payment_type", "amount"];
  if (required.some((field) => !data[field])) return "Lütfen zorunlu alanları doldurun";
  if (data.product_type === "LED Lamba" && !data.color) return "LED Lamba için renk seçimi zorunludur";
  if (!data.has_second_product) return null;
  if (!data.second_product_type) return "2. ürün türü seçilmelidir";
  if (data.second_product_type === "LED Lamba" && !data.second_color) return "2. ürün LED Lamba için renk seçimi zorunludur";
  return null;
};

export const orderSubmitLabel = (loading, editing) => {
  if (loading) return "İşleniyor...";
  if (editing) return "Güncelle";
  return "Sipariş Oluştur";
};