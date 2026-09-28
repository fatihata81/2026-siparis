import { api } from "../lib/api";
import { useApiResource } from "./useApiResource";
import { useApiAction } from "./useApiAction";

const EMPTY_LIST = [];

export const useOrderData = () => {
  const ordersResource = useApiResource("/orders", "Siparişler yüklenemedi");
  const provincesResource = useApiResource("/provinces", "İller yüklenemedi");
  const countriesResource = useApiResource("/countries", "Ülkeler yüklenemedi");
  const { loading, execute } = useApiAction();

  const mutate = async (operation, success, failure) => {
    const saved = await execute(operation, success, failure);
    if (saved) await ordersResource.refresh();
    return saved;
  };
  const createOrder = (data) => mutate(() => api.post("/orders", data), "Sipariş başarıyla oluşturuldu", "Sipariş oluşturulamadı");
  const updateOrder = (id, data) => mutate(() => api.put(`/orders/${id}`, data), "Sipariş başarıyla güncellendi", "Sipariş güncellenemedi");
  const changeStatus = (id, status) => mutate(() => api.patch(`/orders/${id}/status`, { status }), "Durum güncellendi", "Durum güncellenemedi");
  const deleteOrder = (id) => {
    if (!window.confirm("Bu siparişi silmek istediğinizden emin misiniz?")) return false;
    return mutate(() => api.delete(`/orders/${id}`), "Sipariş silindi", "Sipariş silinemedi");
  };

  return {
    orders: ordersResource.data || EMPTY_LIST,
    provinces: provincesResource.data?.provinces || EMPTY_LIST,
    countries: countriesResource.data?.countries || EMPTY_LIST,
    loading, createOrder, updateOrder, changeStatus, deleteOrder,
  };
};