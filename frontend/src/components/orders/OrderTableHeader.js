import { TableHead, TableHeader, TableRow } from "../ui/table";

export const OrderTableHeader = ({ columns }) => (
  <TableHeader>
    <TableRow className="bg-orange-50">
      {columns.map((column) => <TableHead key={column.id} className={`font-semibold ${column.centered ? "text-center" : ""}`} data-testid={`order-column-${column.id.replaceAll("_", "-")}`}>{column.label}</TableHead>)}
    </TableRow>
  </TableHeader>
);