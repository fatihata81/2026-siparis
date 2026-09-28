import { useMemo, useState } from "react";

export const useOrderFilters = (orders) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const provinces = useMemo(() => [...new Set(orders.map((order) => order.province))].filter(Boolean).sort(), [orders]);
  const paymentTypes = useMemo(() => [...new Set(orders.map((order) => order.payment_type))].filter(Boolean).sort(), [orders]);
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const fullName = `${order.first_name || ""} ${order.last_name || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      (order.phone || "").includes(searchTerm) || String(order.order_no || "").includes(searchTerm);
    const matchesProvince = filterProvince === "all" || order.province === filterProvince;
    const matchesPayment = filterPayment === "all" || order.payment_type === filterPayment;
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesProvince && matchesPayment && matchesStatus;
  }), [orders, searchTerm, filterProvince, filterPayment, filterStatus]);
  return { searchTerm, setSearchTerm, filterProvince, setFilterProvince, filterPayment, setFilterPayment, filterStatus, setFilterStatus, provinces, paymentTypes, filteredOrders };
};