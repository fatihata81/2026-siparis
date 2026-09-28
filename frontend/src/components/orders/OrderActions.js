import { FileText, Pencil, Printer, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export const OrderActions = ({ order, onPrint, onEdit, onDelete }) => (
  <div className="flex gap-2 justify-center">
    <Button size="sm" variant="ghost" onClick={() => onPrint(order)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" data-testid={`print-button-${order.order_no}`} aria-label="Sipariş Etiketini Yazdır" title="Sipariş Etiketini Yazdır"><Printer className="w-4 h-4" /></Button>
    <Button size="sm" variant="ghost" onClick={() => onEdit(order)} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50" data-testid={`edit-button-${order.order_no}`} aria-label="Siparişi Düzenle" title="Siparişi Düzenle"><Pencil className="w-4 h-4" /></Button>
    <Button size="sm" variant="ghost" onClick={() => onDelete(order.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50" data-testid={`delete-button-${order.order_no}`} aria-label="Siparişi Sil" title="Siparişi Sil"><Trash2 className="w-4 h-4" /></Button>
  </div>
);

export const OrderNoteAction = ({ order, onPrintNote }) => (
  <div className="flex justify-center">
    {order.order_note?.trim() && <Button size="sm" variant="ghost" onClick={() => onPrintNote?.(order)} className="text-green-600 hover:text-green-700 hover:bg-green-50" title="Sipariş Notunu Yazdır" aria-label="Sipariş Notunu Yazdır" data-testid={`print-note-button-${order.order_no}`}><FileText className="w-4 h-4" /></Button>}
  </div>
);