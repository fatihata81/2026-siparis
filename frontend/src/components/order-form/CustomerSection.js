import { User } from "lucide-react";
import { FormCheckbox, FormSelectField, FormTextField, SectionHeading } from "./FormFields";

export const CustomerSection = ({ form, countries }) => (
  <div className="space-y-2">
    <SectionHeading icon={User} testId="customer-section-title">Kişisel Bilgiler</SectionHeading>
    <div className="grid grid-cols-2 gap-3">
      <FormTextField name="first_name" label="Ad *" form={form} required />
      <FormTextField name="last_name" label="Soyad *" form={form} required />
    </div>
    <FormTextField name="phone" label="Telefon Numarası *" form={form} onChange={form.handlePhoneChange} required />
    <div className="flex gap-4">
      <FormCheckbox name="show_tc" label="TC No" form={form} labelClassName="cursor-pointer text-sm" />
      <FormCheckbox name="show_email" label="E-posta" form={form} labelClassName="cursor-pointer text-sm" />
    </div>
    {form.formData.show_tc && <FormTextField name="tc_no" label="TC No" form={form} />}
    {form.formData.show_email && <FormTextField name="email" label="E-posta" form={form} type="email" />}
    <FormCheckbox name="is_international" label="Yurtdışı mı?" form={form} testId="checkbox-international" />
    {form.formData.is_international && <FormSelectField name="country" label="Ülke *" form={form} options={countries} placeholder="Ülke seçin" />}
  </div>
);