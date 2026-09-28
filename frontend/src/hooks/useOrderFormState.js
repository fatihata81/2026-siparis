import { useCallback, useEffect, useState } from "react";
import { createOrderFormState, validateOrderForm } from "../components/order-form/orderFormModel";
import { useDistricts } from "./useDistricts";

export const useOrderFormState = ({ editingOrder, onSubmit }) => {
  const [formData, setFormData] = useState(() => createOrderFormState(editingOrder));
  const districts = useDistricts(formData.province);
  useEffect(() => { setFormData(createOrderFormState(editingOrder)); }, [editingOrder]);

  const setField = useCallback((name, value) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
  }, []);
  const handleSelectChange = useCallback((name, value) => {
    // Radix's hidden native select can emit empty initialization events.
    // None of these menus has a clear option; intentional resets are explicit below.
    if (value) setField(name, value);
  }, [setField]);
  const handleProvinceChange = useCallback((value) => {
    if (!value) return;
    setFormData((previous) => previous.province === value ? previous : { ...previous, province: value, district: "" });
  }, []);
  const handleInputChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setField(name, type === "checkbox" ? checked : value);
  }, [setField]);
  const handlePhoneChange = useCallback((event) => {
    const digits = event.target.value.replace(/\D/g, "");
    setField("phone", digits.startsWith("90") ? digits : `90${digits}`);
  }, [setField]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const error = validateOrderForm(formData);
    if (error) { window.alert(error); return; }
    const saved = await onSubmit({ ...formData, amount: parseFloat(formData.amount) });
    // Failed requests keep the user's inputs; successful creates reset the defaults.
    if (saved !== false && !editingOrder) setFormData(createOrderFormState());
  };
  return { formData, districts, setField, handleSelectChange, handleProvinceChange, handleInputChange, handlePhoneChange, handleSubmit };
};