import { Gift, Package2 } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { STATUS_COLORS, STATUS_OPTIONS } from "../../lib/orderColumns";
import { OrderActions, OrderNoteAction } from "./OrderActions";

const OrderStatus = ({ order, onStatusChange }) => (
  <Select value={order.status} onValueChange={(value) => onStatusChange(order.id, value)}>
    <SelectTrigger className="h-8 text-xs border-0" data-testid={`status-select-${order.order_no}`}>
      <Badge className={`${STATUS_COLORS[order.status]} text-white border-0`}>{order.status}</Badge>
    </SelectTrigger>
    <SelectContent data-testid={`status-options-${order.order_no}`}>
      {STATUS_OPTIONS.map((status, index) => <SelectItem key={status} value={status} data-testid={`status-option-${order.order_no}-${index}`}>{status}</SelectItem>)}
    </SelectContent>
  </Select>
);

const OrderFeatures = ({ order }) => (
  <div className="flex gap-2 justify-center items-center">
    {order.gift_package && <Gift className="w-4 h-4 text-pink-500" title="Hediye Paketi" data-testid={`order-gift-${order.order_no}`} />}
    {order.has_second_product && <Package2 className="w-4 h-4 text-blue-500" title="2. Ürün" data-testid={`order-second-product-${order.order_no}`} />}
  </div>
);

const OrderValue = ({ column, order, actions }) => {
  switch (column.id) {
    case "date": return new Date(order.timestamp).toLocaleDateString("tr-TR", { year: "numeric", month: "2-digit", day: "2-digit" });
    case "name": return `${order.first_name} ${order.last_name}`;
    case "amount": return `${order.amount} ₺`;
    case "status": return <OrderStatus order={order} onStatusChange={actions.onStatusChange} />;
    case "features": return <OrderFeatures order={order} />;
    case "order_note": return <OrderNoteAction order={order} onPrintNote={actions.onPrintNote} />;
    case "actions": return <OrderActions order={order} {...actions} />;
    default: return order[column.id];
  }
};

export const OrderRow = ({ order, columns, ...actions }) => (
  <TableRow className="hover:bg-orange-50/50 transition-colors" data-testid={`order-row-${order.order_no}`}>
    {columns.map((column) => (
      <TableCell key={column.id} data-label={column.label} data-testid={`order-${column.testKey}-${order.order_no}`} className={column.className}>
        <OrderValue column={column} order={order} actions={actions} />
      </TableCell>
    ))}
  </TableRow>
);