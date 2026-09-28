import { useAuth } from "../contexts/AuthContext";
import { useOrderFilters } from "../hooks/useOrderFilters";
import { ORDER_COLUMNS } from "../lib/orderColumns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { FilterControls } from "./orders/FilterControls";
import { OrderRow } from "./orders/OrderRow";
import { OrderTableHeader } from "./orders/OrderTableHeader";
import "./orders-table.css";

export default function OrdersTable({ orders, ...actions }) {
  const { canViewColumn } = useAuth();
  const filters = useOrderFilters(orders);
  const columns = ORDER_COLUMNS.filter((column) => column.alwaysVisible || canViewColumn(column.id));
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg"><CardTitle className="text-xl" data-testid="orders-title">Siparişler</CardTitle></CardHeader>
      <CardContent className="p-6">
        <FilterControls filters={filters} />
        <div className="overflow-x-auto rounded-lg border border-orange-100">
          <Table className="orders-table" data-testid="orders-table">
            <OrderTableHeader columns={columns} />
            <TableBody>
              {filters.filteredOrders.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length} className="text-center py-8 text-gray-500" data-testid="orders-empty-state">Sipariş bulunamadı</TableCell></TableRow>
              ) : filters.filteredOrders.map((order) => <OrderRow key={order.id} order={order} columns={columns} {...actions} />)}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-gray-600" data-testid="orders-count">Toplam {filters.filteredOrders.length} sipariş gösteriliyor</div>
      </CardContent>
    </Card>
  );
}