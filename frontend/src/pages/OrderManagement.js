import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import OrderForm from "../components/OrderForm";
import OrdersTable from "../components/OrdersTable";
import PrintLabel from "../components/PrintLabel";
import PrintNote from "../components/PrintNote";
import Settings from "../components/Settings";
import { useAuth } from "../contexts/AuthContext";
import { Package, Plus, Settings as SettingsIcon, LogOut } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OrderManagement = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);
  const [printNoteOrder, setPrintNoteOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchProvinces();
    fetchCountries();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Siparişler yüklenemedi:", error);
      toast.error("Siparişler yüklenemedi");
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(`${API}/provinces`);
      setProvinces(response.data.provinces);
    } catch (error) {
      console.error("İller yüklenemedi:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API}/countries`);
      setCountries(response.data.countries);
    } catch (error) {
      console.error("Ülkeler yüklenemedi:", error);
    }
  };

  const handleCreateOrder = async (orderData) => {
    setLoading(true);
    try {
      await axios.post(`${API}/orders`, orderData);
      toast.success("Sipariş başarıyla oluşturuldu");
      fetchOrders();
      setShowForm(false); // Form'u kapat
    } catch (error) {
      console.error("Sipariş oluşturulamadı:", error);
      toast.error("Sipariş oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId, orderData) => {
    setLoading(true);
    try {
      await axios.put(`${API}/orders/${orderId}`, orderData);
      toast.success("Sipariş başarıyla güncellendi");
      fetchOrders();
      setEditingOrder(null);
      setShowForm(false); // Form'u kapat
    } catch (error) {
      console.error("Sipariş güncellenemedi:", error);
      toast.error("Sipariş güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bu siparişi silmek istediğinizden emin misiniz?")) {
      return;
    }
    
    try {
      await axios.delete(`${API}/orders/${orderId}`);
      toast.success("Sipariş silindi");
      fetchOrders();
    } catch (error) {
      console.error("Sipariş silinemedi:", error);
      toast.error("Sipariş silinemedi");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API}/orders/${orderId}/status`, { status: newStatus });
      toast.success("Durum güncellendi");
      fetchOrders();
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
      toast.error("Durum güncellenemedi");
    }
  };

  const handlePrint = async (order) => {
    // Update status to "Üretime Verildi" before printing
    if (order.status !== "Üretime Verildi") {
      await handleStatusChange(order.id, "Üretime Verildi");
    }
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
      setPrintOrder(null);
    }, 100);
  };

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      logout();
      toast.success('Çıkış yapıldı');
    }
  };

  // If showing settings, render settings page
  if (showSettings) {
    return <Settings onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" data-testid="page-title">Sipariş Yönetim Sistemi</h1>
                <p className="text-orange-100 text-xs md:text-sm">Hoş geldiniz, {user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                data-testid="new-order-button"
              >
                {showForm ? (
                  <>
                    <Package className="w-5 h-5" />
                    Listeye Dön
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Yeni Sipariş
                  </>
                )}
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-white/30 transition-all"
                  data-testid="settings-button"
                  title="Ayarlar"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-white/30 transition-all"
                data-testid="logout-button"
                title="Çıkış"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          /* Order Form */
          <div className="max-w-3xl mx-auto">
            <OrderForm
              onSubmit={editingOrder ? (data) => handleUpdateOrder(editingOrder.id, data) : handleCreateOrder}
              provinces={provinces}
              countries={countries}
              loading={loading}
              editingOrder={editingOrder}
              onCancelEdit={() => {
                setEditingOrder(null);
                setShowForm(false);
              }}
            />
          </div>
        ) : (
          /* Orders Table */
          <OrdersTable
            orders={orders}
            onEdit={(order) => {
              setEditingOrder(order);
              setShowForm(true);
            }}
            onDelete={handleDeleteOrder}
            onStatusChange={handleStatusChange}
            onPrint={handlePrint}
            onPrintNote={(order) => {
              setPrintNoteOrder(order);
              setTimeout(() => {
                window.print();
                setPrintNoteOrder(null);
              }, 100);
            }}
          />
        )}
      </main>

      {/* Print Label - Hidden */}
      {printOrder && <PrintLabel order={printOrder} />}
      
      {/* Print Note - Hidden */}
      {printNoteOrder && <PrintNote order={printNoteOrder} />}
    </div>
  );
};

export default OrderManagement;