import { Package, Plus, Settings, LogOut } from "lucide-react";

export const OrderHeader = ({ user, showForm, onToggleForm, onSettings, onLogout }) => (
  <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg">
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Package className="w-8 h-8" /></div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" data-testid="page-title">Sipariş Yönetim Sistemi</h1>
            <p className="text-orange-100 text-xs md:text-sm break-all" data-testid="welcome-user">Hoş geldiniz, {user?.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <button onClick={onToggleForm} className="bg-white text-orange-600 px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2" data-testid="new-order-button">
            {showForm ? <Package className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? "Listeye Dön" : "Yeni Sipariş"}
          </button>
          {user?.role === "admin" && <button onClick={onSettings} className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-white/30 transition-all" data-testid="settings-button" title="Ayarlar" aria-label="Ayarlar"><Settings className="w-5 h-5" /></button>}
          <button onClick={onLogout} className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-white/30 transition-all" data-testid="logout-button" title="Çıkış" aria-label="Çıkış"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  </header>
);