import { Package, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useOrderFormState } from "../hooks/useOrderFormState";
import { CustomerSection } from "./order-form/CustomerSection";
import { AddressSection } from "./order-form/AddressSection";
import { ProductSection } from "./order-form/ProductSection";
import { PaymentSection } from "./order-form/PaymentSection";
import { FormCheckbox } from "./order-form/FormFields";
import { orderSubmitLabel } from "./order-form/orderFormModel";

export default function OrderForm({ onSubmit, provinces, countries, loading, editingOrder, onCancelEdit }) {
  const form = useOrderFormState({ editingOrder, onSubmit });
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl" data-testid="order-form-title">
          <Package className="w-5 h-5" />{editingOrder ? "Sipariş Düzenle" : "Yeni Sipariş"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit} className="space-y-4" data-testid="order-form">
          <CustomerSection form={form} countries={countries} />
          <AddressSection form={form} provinces={provinces} />
          <ProductSection form={form} />
          <div className="space-y-2">
            <FormCheckbox name="has_second_product" label="2. Sipariş" form={form} testId="checkbox-second-product"
              className="flex items-center space-x-2 p-4 bg-orange-50 rounded-lg border-2 border-orange-200"
              labelClassName="cursor-pointer font-semibold text-orange-700" />
          </div>
          {form.formData.has_second_product && <ProductSection form={form} second />}
          <PaymentSection form={form} />
          <div className="flex gap-3">
            <Button type="submit" disabled={loading} data-testid="submit-order-button"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6 text-base transition-transform hover:scale-105">
              {orderSubmitLabel(loading, !!editingOrder)}
            </Button>
            {editingOrder && <Button type="button" onClick={onCancelEdit} variant="outline" className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
              data-testid="cancel-edit-button" aria-label="Düzenlemeyi iptal et" title="Düzenlemeyi iptal et"><X className="w-4 h-4" /></Button>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}