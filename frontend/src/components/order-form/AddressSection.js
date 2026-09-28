import { MapPin } from "lucide-react";
import { CARGO_COMPANIES } from "./orderFormModel";
import { FormSelectField, FormTextField, SectionHeading } from "./FormFields";

export const AddressSection = ({ form, provinces }) => (
  <div className="space-y-2">
    <SectionHeading icon={MapPin} testId="address-section-title">Kargo ve Adres Bilgileri</SectionHeading>
    <FormSelectField name="province" label="İl *" form={form} options={provinces} placeholder="İl seçin" onChange={form.handleProvinceChange} />
    <FormSelectField name="district" label="İlçe *" form={form} options={form.districts} placeholder="İlçe seçin" disabled={!form.formData.province} />
    <FormTextField name="address" label="Adres *" form={form} multiline rows={3} required />
    <FormSelectField name="cargo_company" label="Kargo Firması *" form={form} options={CARGO_COMPANIES} placeholder="Kargo firması seçin" />
  </div>
);