import { Package } from "lucide-react";
import { BASE_SELECTIONS, COLORS, PRODUCT_TYPES } from "./orderFormModel";
import { FormSelectField, FormTextField, SectionHeading } from "./FormFields";

export const ProductSection = ({ form, second = false }) => {
  const prefix = second ? "second_" : "";
  const type = form.formData[`${prefix}product_type`];
  const isLed = type === "LED Lamba";
  const sectionClass = second ? "space-y-2 p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-300" : "space-y-2";
  return (
    <div className={sectionClass}>
      <SectionHeading icon={Package} testId={second ? "second-product-section-title" : "product-section-title"}
        className={`flex items-center gap-2 ${second ? "text-red-600" : "text-orange-600"} font-semibold`}>
        {second ? "2. Ürün Bilgileri" : "Ürün Bilgileri"}
      </SectionHeading>
      <FormSelectField name={`${prefix}product_type`} label="Ürün Türü *" form={form} options={PRODUCT_TYPES} placeholder="Ürün türü seçin" />
      {isLed && <>
        <FormSelectField name={`${prefix}base_selection`} label="Altlık Seçimi" form={form} options={BASE_SELECTIONS} placeholder="Altlık seçin" />
        <FormSelectField name={`${prefix}color`} label="Renk *" form={form} options={COLORS} placeholder="Renk seçin" />
      </>}
      {(!second || type) && <FormTextField name={`${prefix}customization`} label="Kişiselleştirme" form={form} multiline rows={3} placeholder="Müşterinin istediği yazı veya not" />}
      {isLed && <FormTextField name={`${prefix}base_text`} label="Altlık Yazısı" form={form} placeholder="İsteğe bağlı" className="border-orange-200 focus:border-orange-400 h-9" />}
    </div>
  );
};