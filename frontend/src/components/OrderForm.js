import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User, MapPin, Package, CreditCard, X } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CARGO_COMPANIES = ["DHL", "Yurtiçi", "Aras", "Sürat", "PTT"];
const PRODUCT_TYPES = ["LED Lamba", "Kupa Bardak", "Sihirli Kupa", "Anahtarlık"];
const BASE_SELECTIONS = ["Dikdörtgen", "Kalp"];
const COLORS = ["Günışığı", "Kırmızı", "Yeşil", "Pembe", "Mavi", "RGB"];
const PAYMENT_TYPES = ["Kapıda Ödeme", "Havale", "Web", "Web Kapıda Ödeme"];

const OrderForm = ({ onSubmit, provinces, countries, loading, editingOrder, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    show_tc: false,
    tc_no: "",
    show_email: false,
    email: "",
    is_international: false,
    country: "",
    province: "İstanbul",
    district: "",
    address: "",
    cargo_company: "DHL",
    product_type: "LED Lamba",
    base_selection: "",
    color: "Günışığı",
    customization: "",
    base_text: "",
    has_second_product: false,
    second_product_type: "",
    second_base_selection: "",
    second_color: "",
    second_customization: "",
    second_base_text: "",
    payment_type: editingOrder?.payment_type ?? "",
    amount: "",
    gift_package: false,
    order_note: ""
  });

  const [districts, setDistricts] = useState([]);

  // Load Istanbul districts on mount since it's the default
  useEffect(() => {
    if (formData.province === "İstanbul" && districts.length === 0) {
      fetchDistricts("İstanbul");
    }
  }, []);

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        first_name: editingOrder.first_name || "",
        last_name: editingOrder.last_name || "",
        phone: editingOrder.phone || "",
        show_tc: !!editingOrder.tc_no,
        tc_no: editingOrder.tc_no || "",
        show_email: !!editingOrder.email,
        email: editingOrder.email || "",
        is_international: editingOrder.is_international || false,
        country: editingOrder.country || "",
        province: editingOrder.province || "İstanbul",
        district: editingOrder.district || "",
        address: editingOrder.address || "",
        cargo_company: editingOrder.cargo_company || "DHL",
        product_type: editingOrder.product_type || "LED Lamba",
        base_selection: editingOrder.base_selection || "",
        color: editingOrder.color || "Günışığı",
        customization: editingOrder.customization || "",
        base_text: editingOrder.base_text || "",
        has_second_product: editingOrder.has_second_product || false,
        second_product_type: editingOrder.second_product_type || "",
        second_base_selection: editingOrder.second_base_selection || "",
        second_color: editingOrder.second_color || "",
        second_customization: editingOrder.second_customization || "",
        second_base_text: editingOrder.second_base_text || "",
        payment_type: editingOrder.payment_type ?? "",
        amount: editingOrder.amount?.toString() || "",
        gift_package: editingOrder.gift_package || false,
        order_note: editingOrder.order_note || ""
      });
      if (editingOrder.province) {
        fetchDistricts(editingOrder.province);
      }
    }
  }, [editingOrder]);

  const fetchDistricts = async (province) => {
    try {
      const response = await axios.get(`${API}/districts/${province}`);
      setDistricts(response.data.districts);
    } catch (error) {
      console.error("İlçeler yüklenemedi:", error);
    }
  };

  const handleProvinceChange = (value) => {
    if (!value) return;
    setFormData((previous) => previous.province === value ? previous : {
      ...previous, province: value, district: ""
    });
    fetchDistricts(value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    // Radix's hidden native select may emit an empty initialization event.
    // These menus have no clear option. Intentional resets happen directly in state.
    if (!value) return;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("90")) {
      value = "90" + value;
    }
    setFormData((previous) => ({ ...previous, phone: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.first_name || !formData.last_name || !formData.phone || !formData.province || !formData.district ||
        !formData.address || !formData.cargo_company || !formData.product_type ||
        !formData.payment_type || !formData.amount) {
      alert("Lütfen zorunlu alanları doldurun");
      return;
    }

    // LED Lamba için renk zorunlu
    if (formData.product_type === "LED Lamba" && !formData.color) {
      alert("LED Lamba için renk seçimi zorunludur");
      return;
    }

    // 2. ürün için validation
    if (formData.has_second_product) {
      if (!formData.second_product_type) {
        alert("2. ürün türü seçilmelidir");
        return;
      }
      if (formData.second_product_type === "LED Lamba" && !formData.second_color) {
        alert("2. ürün LED Lamba için renk seçimi zorunludur");
        return;
      }
    }

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    onSubmit(submitData);
    
    if (!editingOrder) {
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        show_tc: false,
        tc_no: "",
        show_email: false,
        email: "",
        is_international: false,
        country: "",
        province: "İstanbul",
        district: "",
        address: "",
        cargo_company: "DHL",
        product_type: "LED Lamba",
        base_selection: "",
        color: "Günışığı",
        customization: "",
        base_text: "",
        has_second_product: false,
        second_product_type: "",
        second_base_selection: "",
        second_color: "",
        second_customization: "",
        second_base_text: "",
        payment_type: "",
        amount: "",
        gift_package: false,
        order_note: ""
      });
      setDistricts([]);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package className="w-5 h-5" />
          {editingOrder ? "Sipariş Düzenle" : "Yeni Sipariş"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kişisel Bilgiler */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <User className="w-5 h-5" />
              <h3>Kişisel Bilgiler</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first_name">Ad *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  data-testid="input-first-name"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <div>
                <Label htmlFor="last_name">Soyad *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  data-testid="input-last-name"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Telefon Numarası *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                required
                data-testid="input-phone"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            {/* TC ve E-posta Checkbox'ları */}
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show_tc"
                  checked={formData.show_tc}
                  onCheckedChange={(checked) => setFormData({ ...formData, show_tc: checked })}
                  data-testid="checkbox-show-tc"
                />
                <Label htmlFor="show_tc" className="cursor-pointer text-sm">TC No</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show_email"
                  checked={formData.show_email}
                  onCheckedChange={(checked) => setFormData({ ...formData, show_email: checked })}
                  data-testid="checkbox-show-email"
                />
                <Label htmlFor="show_email" className="cursor-pointer text-sm">E-posta</Label>
              </div>
            </div>

            {formData.show_tc && (
              <div>
                <Label htmlFor="tc_no">TC No</Label>
                <Input
                  id="tc_no"
                  name="tc_no"
                  value={formData.tc_no}
                  onChange={handleInputChange}
                  data-testid="input-tc-no"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
            )}

            {formData.show_email && (
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  data-testid="input-email"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_international"
                checked={formData.is_international}
                onCheckedChange={(checked) => setFormData({ ...formData, is_international: checked })}
                data-testid="checkbox-international"
              />
              <Label htmlFor="is_international" className="cursor-pointer">Yurtdışı mı?</Label>
            </div>

            {formData.is_international && (
              <div>
                <Label htmlFor="country">Ülke *</Label>
                <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                  <SelectTrigger data-testid="select-country" className="border-orange-200">
                    <SelectValue placeholder="Ülke seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Kargo ve Adres */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <MapPin className="w-5 h-5" />
              <h3>Kargo ve Adres Bilgileri</h3>
            </div>

            <div>
              <Label htmlFor="province">İl *</Label>
              <Select value={formData.province} onValueChange={handleProvinceChange}>
                <SelectTrigger data-testid="select-province" className="border-orange-200">
                  <SelectValue placeholder="İl seçin" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="district">İlçe *</Label>
              <Select value={formData.district} onValueChange={(value) => handleSelectChange("district", value)} disabled={!formData.province}>
                <SelectTrigger data-testid="select-district" className="border-orange-200">
                  <SelectValue placeholder="İlçe seçin" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Adres *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                data-testid="textarea-address"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            <div>
              <Label htmlFor="cargo_company">Kargo Firması *</Label>
              <Select value={formData.cargo_company} onValueChange={(value) => handleSelectChange("cargo_company", value)}>
                <SelectTrigger data-testid="select-cargo-company" className="border-orange-200">
                  <SelectValue placeholder="Kargo firması seçin" />
                </SelectTrigger>
                <SelectContent>
                  {CARGO_COMPANIES.map((company) => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Ürün Bilgileri */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <Package className="w-5 h-5" />
              <h3>Ürün Bilgileri</h3>
            </div>

            <div>
              <Label htmlFor="product_type">Ürün Türü *</Label>
              <Select value={formData.product_type} onValueChange={(value) => handleSelectChange("product_type", value)}>
                <SelectTrigger data-testid="select-product-type" className="border-orange-200">
                  <SelectValue placeholder="Ürün türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.product_type === "LED Lamba" && (
              <>
                <div>
                  <Label htmlFor="base_selection">Altlık Seçimi</Label>
                  <Select value={formData.base_selection} onValueChange={(value) => handleSelectChange("base_selection", value)}>
                    <SelectTrigger data-testid="select-base-selection" className="border-orange-200">
                      <SelectValue placeholder="Altlık seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {BASE_SELECTIONS.map((base) => (
                        <SelectItem key={base} value={base}>{base}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">Renk *</Label>
                  <Select value={formData.color} onValueChange={(value) => handleSelectChange("color", value)}>
                    <SelectTrigger data-testid="select-color" className="border-orange-200">
                      <SelectValue placeholder="Renk seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="customization">Kişiselleştirme</Label>
                  <Textarea
                    id="customization"
                    name="customization"
                    value={formData.customization}
                    onChange={handleInputChange}
                    placeholder="Müşterinin istediği yazı veya not"
                    rows={3}
                    data-testid="textarea-customization"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div>
                  <Label htmlFor="base_text" className="text-sm">Altlık Yazısı</Label>
                  <Input
                    id="base_text"
                    name="base_text"
                    value={formData.base_text}
                    onChange={handleInputChange}
                    placeholder="İsteğe bağlı"
                    data-testid="input-base-text"
                    className="border-orange-200 focus:border-orange-400 h-9"
                  />
                </div>
              </>
            )}

            {formData.product_type !== "LED Lamba" && (
              <div>
                <Label htmlFor="customization">Kişiselleştirme</Label>
                <Textarea
                  id="customization"
                  name="customization"
                  value={formData.customization}
                  onChange={handleInputChange}
                  placeholder="Müşterinin istediği yazı veya not"
                  rows={3}
                  data-testid="textarea-customization"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
            )}
          </div>

          {/* 2. Sipariş Checkbox */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
              <Checkbox
                id="has_second_product"
                checked={formData.has_second_product}
                onCheckedChange={(checked) => setFormData({ ...formData, has_second_product: checked })}
                data-testid="checkbox-second-product"
              />
              <Label htmlFor="has_second_product" className="cursor-pointer font-semibold text-orange-700">2. Sipariş</Label>
            </div>
          </div>

          {/* 2. Ürün Bilgileri */}
          {formData.has_second_product && (
            <div className="space-y-2 p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-300">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <Package className="w-5 h-5" />
                <h3>2. Ürün Bilgileri</h3>
              </div>

              <div>
                <Label htmlFor="second_product_type">Ürün Türü *</Label>
                <Select value={formData.second_product_type} onValueChange={(value) => handleSelectChange("second_product_type", value)}>
                  <SelectTrigger data-testid="select-second-product-type" className="border-orange-200">
                    <SelectValue placeholder="Ürün türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.second_product_type === "LED Lamba" && (
                <>
                  <div>
                    <Label htmlFor="second_base_selection">Altlık Seçimi</Label>
                    <Select value={formData.second_base_selection} onValueChange={(value) => handleSelectChange("second_base_selection", value)}>
                      <SelectTrigger data-testid="select-second-base-selection" className="border-orange-200">
                        <SelectValue placeholder="Altlık seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {BASE_SELECTIONS.map((base) => (
                          <SelectItem key={base} value={base}>{base}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="second_color">Renk *</Label>
                    <Select value={formData.second_color} onValueChange={(value) => handleSelectChange("second_color", value)}>
                      <SelectTrigger data-testid="select-second-color" className="border-orange-200">
                        <SelectValue placeholder="Renk seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLORS.map((color) => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="second_customization">Kişiselleştirme</Label>
                    <Textarea
                      id="second_customization"
                      name="second_customization"
                      value={formData.second_customization}
                      onChange={handleInputChange}
                      placeholder="Müşterinin istediği yazı veya not"
                      rows={3}
                      data-testid="textarea-second-customization"
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="second_base_text" className="text-sm">Altlık Yazısı</Label>
                    <Input
                      id="second_base_text"
                      name="second_base_text"
                      value={formData.second_base_text}
                      onChange={handleInputChange}
                      placeholder="İsteğe bağlı"
                      data-testid="input-second-base-text"
                      className="border-orange-200 focus:border-orange-400 h-9"
                    />
                  </div>
                </>
              )}

              {formData.second_product_type !== "LED Lamba" && formData.second_product_type && (
                <div>
                  <Label htmlFor="second_customization">Kişiselleştirme</Label>
                  <Textarea
                    id="second_customization"
                    name="second_customization"
                    value={formData.second_customization}
                    onChange={handleInputChange}
                    placeholder="Müşterinin istediği yazı veya not"
                    rows={3}
                    data-testid="textarea-second-customization"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Ödeme Bilgileri */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <CreditCard className="w-5 h-5" />
              <h3>Ödeme Bilgileri</h3>
            </div>

            <div>
              <Label htmlFor="payment_type">Ödeme Tipi *</Label>
              <Select value={formData.payment_type} onValueChange={(value) => handleSelectChange("payment_type", value)}>
                <SelectTrigger id="payment_type" data-testid="select-payment-type" className="border-orange-200">
                  <SelectValue placeholder="Ödeme tipi seçin" />
                </SelectTrigger>
                <SelectContent data-testid="payment-type-options">
                  {PAYMENT_TYPES.map((type, index) => (
                    <SelectItem key={type} value={type} data-testid={`payment-type-option-${index}`}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Tutar *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                required
                data-testid="input-amount"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="gift_package"
                checked={formData.gift_package}
                onCheckedChange={(checked) => setFormData({ ...formData, gift_package: checked })}
                data-testid="checkbox-gift-package"
              />
              <Label htmlFor="gift_package" className="cursor-pointer">Hediye Paketi İstiyor mu?</Label>
            </div>

            <div>
              <Label htmlFor="order_note">Sipariş Notu</Label>
              <Textarea
                id="order_note"
                name="order_note"
                value={formData.order_note}
                onChange={handleInputChange}
                rows={3}
                data-testid="textarea-order-note"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6 text-base transition-transform hover:scale-105"
              data-testid="submit-order-button"
            >
              {loading ? "İşleniyor..." : editingOrder ? "Güncelle" : "Sipariş Oluştur"}
            </Button>
            {editingOrder && (
              <Button
                type="button"
                onClick={onCancelEdit}
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                data-testid="cancel-edit-button"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;