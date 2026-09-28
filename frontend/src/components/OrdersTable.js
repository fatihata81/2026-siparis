import { useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Printer, Pencil, Trash2, Search, Filter, Gift, Package2, FileText } from "lucide-react";
import { Badge } from "./ui/badge";
import "./orders-table.css";

const STATUS_OPTIONS = [
  "Yeni Sipariş",
  "Hazırlanıyor",
  "Üretime Verildi",
  "Üretim Bitti",
  "Eksik Bilgi",
  "Teslim Edildi"
];

const STATUS_COLORS = {
  "Yeni Sipariş": "bg-blue-500",
  "Hazırlanıyor": "bg-yellow-500",
  "Üretime Verildi": "bg-orange-500",
  "Üretim Bitti": "bg-purple-500",
  "Eksik Bilgi": "bg-red-500",
  "Teslim Edildi": "bg-green-500"
};

const OrdersTable = ({ orders, onEdit, onDelete, onStatusChange, onPrint, onPrintNote }) => {
  const { user, canViewColumn } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const provinces = useMemo(() => {
    const uniqueProvinces = [...new Set(orders.map(order => order.province))];
    return uniqueProvinces.sort();
  }, [orders]);

  const paymentTypes = useMemo(() => {
    const uniquePayments = [...new Set(orders.map(order => order.payment_type))];
    return uniquePayments.sort();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const fullName = `${order.first_name || ''} ${order.last_name || ''}`.toLowerCase();
      const matchesSearch = 
        fullName.includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        (order.order_no && order.order_no.toString().includes(searchTerm));
      
      const matchesProvince = filterProvince === "all" || order.province === filterProvince;
      const matchesPayment = filterPayment === "all" || order.payment_type === filterPayment;
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;

      return matchesSearch && matchesProvince && matchesPayment && matchesStatus;
    });
  }, [orders, searchTerm, filterProvince, filterPayment, filterStatus]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    });
  };

  const handlePrintNote = (order) => {
    if (!order.order_note?.trim()) {
      alert("Bu siparişte not bulunmuyor");
      return;
    }
    if (onPrintNote) {
      onPrintNote(order);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="text-xl">Siparişler</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Ad, telefon veya sipariş no ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-400"
              data-testid="search-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-gray-600">İl Filtrele</Label>
              <Select value={filterProvince} onValueChange={setFilterProvince}>
                <SelectTrigger className="border-orange-200" data-testid="filter-province">
                  <SelectValue placeholder="Tüm İller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm İller</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-600">Ödeme Filtrele</Label>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger className="border-orange-200" data-testid="filter-payment">
                  <SelectValue placeholder="Tüm Ödemeler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Ödemeler</SelectItem>
                  {paymentTypes.map((payment) => (
                    <SelectItem key={payment} value={payment}>{payment}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-600">Durum Filtrele</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="border-orange-200" data-testid="filter-status">
                  <SelectValue placeholder="Tüm Durumlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-orange-100">
          <Table className="orders-table" data-testid="orders-table">
            <TableHeader>
              <TableRow className="bg-orange-50">
                {canViewColumn('order_no') && <TableHead className="font-semibold">Sipariş No</TableHead>}
                {canViewColumn('date') && <TableHead className="font-semibold">Tarih</TableHead>}
                {canViewColumn('name') && <TableHead className="font-semibold">Ad Soyad</TableHead>}
                {canViewColumn('phone') && <TableHead className="font-semibold">Telefon</TableHead>}
                {canViewColumn('province') && <TableHead className="font-semibold">İl</TableHead>}
                <TableHead className="font-semibold">Ürün</TableHead>
                {canViewColumn('payment_type') && <TableHead className="font-semibold">Ödeme</TableHead>}
                {canViewColumn('amount') && <TableHead className="font-semibold">Tutar</TableHead>}
                {canViewColumn('status') && <TableHead className="font-semibold">Durum</TableHead>}
                {canViewColumn('cargo_company') && <TableHead className="font-semibold">Kargo</TableHead>}
                {canViewColumn('features') && <TableHead className="font-semibold text-center">Özellik</TableHead>}
                {canViewColumn('order_note') && <TableHead className="font-semibold text-center">Sipariş Notu</TableHead>}
                {canViewColumn('actions') && <TableHead className="font-semibold text-center">İşlemler</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8 text-gray-500" data-testid="orders-empty-state">
                    Sipariş bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-orange-50/50 transition-colors" data-testid={`order-row-${order.order_no}`}>
                    {canViewColumn('order_no') && <TableCell data-label="Sipariş No" data-testid={`order-number-${order.order_no}`} className="font-medium">{order.order_no}</TableCell>}
                    {canViewColumn('date') && <TableCell data-label="Tarih" data-testid={`order-date-${order.order_no}`} className="text-sm">{formatDate(order.timestamp)}</TableCell>}
                    {canViewColumn('name') && <TableCell data-label="Ad Soyad" data-testid={`order-name-${order.order_no}`}>{order.first_name} {order.last_name}</TableCell>}
                    {canViewColumn('phone') && <TableCell data-label="Telefon" data-testid={`order-phone-${order.order_no}`} className="text-sm">{order.phone}</TableCell>}
                    {canViewColumn('province') && <TableCell data-label="İl" data-testid={`order-province-${order.order_no}`} className="text-sm">{order.province}</TableCell>}
                    <TableCell data-label="Ürün" data-testid={`order-product-${order.order_no}`} className="text-sm">{order.product_type}</TableCell>
                    {canViewColumn('payment_type') && <TableCell data-label="Ödeme" data-testid={`order-payment-${order.order_no}`} className="text-sm">{order.payment_type}</TableCell>}
                    {canViewColumn('amount') && <TableCell data-label="Tutar" data-testid={`order-amount-${order.order_no}`} className="font-semibold text-orange-600">{order.amount} ₺</TableCell>}
                    {canViewColumn('status') && (
                      <TableCell data-label="Durum" className="order-wide-cell" data-testid={`order-status-${order.order_no}`}>
                        <Select value={order.status} onValueChange={(value) => onStatusChange(order.id, value)}>
                          <SelectTrigger className="h-8 text-xs border-0" data-testid={`status-select-${order.order_no}`}>
                            <Badge className={`${STATUS_COLORS[order.status]} text-white border-0`}>
                              {order.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    )}
                    {canViewColumn('cargo_company') && <TableCell data-label="Kargo" data-testid={`order-cargo-${order.order_no}`} className="text-sm">{order.cargo_company}</TableCell>}
                    {canViewColumn('features') && (
                      <TableCell data-label="Özellik" data-testid={`order-features-${order.order_no}`}>
                        <div className="flex gap-2 justify-center items-center">
                          {order.gift_package && (
                            <Gift className="w-4 h-4 text-pink-500" title="Hediye Paketi" data-testid={`order-gift-${order.order_no}`} />
                          )}
                          {order.has_second_product && (
                            <Package2 className="w-4 h-4 text-blue-500" title="2. Ürün" data-testid={`order-second-product-${order.order_no}`} />
                          )}
                        </div>
                      </TableCell>
                    )}
                    {canViewColumn('order_note') && (
                      <TableCell data-label="Sipariş Notu" data-testid={`order-note-${order.order_no}`}>
                        <div className="flex justify-center">
                          {order.order_note?.trim() && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePrintNote(order)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Sipariş Notunu Yazdır"
                              aria-label="Sipariş Notunu Yazdır"
                              data-testid={`print-note-button-${order.order_no}`}
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {canViewColumn('actions') && (
                      <TableCell data-label="İşlemler" className="order-wide-cell" data-testid={`order-actions-${order.order_no}`}>
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onPrint(order)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            data-testid={`print-button-${order.order_no}`}
                            aria-label="Sipariş Etiketini Yazdır"
                            title="Sipariş Etiketini Yazdır"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit(order)}
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            data-testid={`edit-button-${order.order_no}`}
                            aria-label="Siparişi Düzenle"
                            title="Siparişi Düzenle"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(order.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            data-testid={`delete-button-${order.order_no}`}
                            aria-label="Siparişi Sil"
                            title="Siparişi Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-gray-600" data-testid="orders-count">
          Toplam {filteredOrders.length} sipariş gösteriliyor
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;