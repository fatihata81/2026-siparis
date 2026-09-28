import { useCallback, useState } from "react";
import { toast } from "sonner";
import OrderForm from "../components/OrderForm";
import OrdersTable from "../components/OrdersTable";
import Settings from "../components/Settings";
import { PrintJob } from "../components/PrintJob";
import { OrderHeader } from "../components/orders/OrderHeader";
import { useAuth } from "../contexts/AuthContext";
import { useOrderData } from "../hooks/useOrderData";
import { notifySuccess } from "../lib/notifications";

export default function OrderManagement() {
  const { user, logout } = useAuth();
  const data = useOrderData();
  const [editingOrder, setEditingOrder] = useState(null);
  const [printJob, setPrintJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // React state setters are stable; no ref or extra dependency is needed.
  const completePrint = useCallback(() => setPrintJob(null), []);
  const closeForm = () => { setEditingOrder(null); setShowForm(false); };
  const toggleForm = () => { setEditingOrder(null); setShowForm((previous) => !previous); };
  const editOrder = (order) => { setEditingOrder(order); setShowForm(true); };
  const submitOrder = async (values) => {
    const saved = editingOrder ? await data.updateOrder(editingOrder.id, values) : await data.createOrder(values);
    if (saved) closeForm();
    return saved;
  };
  const printLabel = async (order) => {
    if (order.status !== "Üretime Verildi") await data.changeStatus(order.id, "Üretime Verildi");
    setPrintJob({ type: "label", order });
  };
  const printNote = (order) => {
    if (!order.order_note?.trim()) {
      toast.error(<span data-testid="print-empty-note-error">Bu siparişte not bulunmuyor</span>);
      return;
    }
    setPrintJob({ type: "note", order });
  };
  const handleLogout = () => {
    if (window.confirm("Çıkış yapmak istediğinizden emin misiniz?")) {
      logout();
      notifySuccess("Çıkış yapıldı");
    }
  };

  if (showSettings) return <Settings onClose={() => setShowSettings(false)} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <OrderHeader user={user} showForm={showForm} onToggleForm={toggleForm} onSettings={() => setShowSettings(true)} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          <div className="max-w-3xl mx-auto">
            <OrderForm key={editingOrder?.id || "new"} onSubmit={submitOrder} provinces={data.provinces} countries={data.countries}
              loading={data.loading} editingOrder={editingOrder} onCancelEdit={closeForm} />
          </div>
        ) : (
          <OrdersTable orders={data.orders} onEdit={editOrder} onDelete={data.deleteOrder} onStatusChange={data.changeStatus} onPrint={printLabel} onPrintNote={printNote} />
        )}
      </main>
      {printJob && <PrintJob job={printJob} onComplete={completePrint} />}
    </div>
  );
}