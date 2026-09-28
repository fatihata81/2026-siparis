import { CreditCard } from "lucide-react";
import { PAYMENT_TYPES } from "./orderFormModel";
import { FormCheckbox, FormSelectField, FormTextField, SectionHeading } from "./FormFields";

export const PaymentSection = ({ form }) => (
  <div className="space-y-2">
    <SectionHeading icon={CreditCard} testId="payment-section-title">Ödeme Bilgileri</SectionHeading>
    <FormSelectField name="payment_type" label="Ödeme Tipi *" form={form} options={PAYMENT_TYPES} placeholder="Ödeme tipi seçin" />
    <FormTextField name="amount" label="Tutar *" form={form} type="number" step="0.01" required />
    <FormCheckbox name="gift_package" label="Hediye Paketi İstiyor mu?" form={form} />
    <FormTextField name="order_note" label="Sipariş Notu" form={form} multiline rows={3} />
  </div>
);