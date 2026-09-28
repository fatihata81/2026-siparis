import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { USER_COLUMNS } from "../../lib/orderColumns";

export const ColumnPermissions = ({ manager }) => (
  <div>
    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
      <Label>Görünür Kolonlar</Label>
      <div className="space-x-2">
        <Button type="button" size="sm" variant="outline" onClick={manager.selectAllColumns} className="text-xs" data-testid="select-all-columns">Tümünü Seç</Button>
        <Button type="button" size="sm" variant="outline" onClick={manager.deselectAllColumns} className="text-xs" data-testid="deselect-all-columns">Tümünü Kaldır</Button>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-orange-200 rounded-lg bg-orange-50/30">
      {USER_COLUMNS.map((column) => (
        <div key={column.id} className="flex items-center space-x-2 min-w-0">
          <Checkbox id={`col-${column.id}`} checked={manager.formData.visible_columns.includes(column.id)} onCheckedChange={() => manager.toggleColumn(column.id)} data-testid={`checkbox-${column.id}`} />
          <Label htmlFor={`col-${column.id}`} className="text-sm cursor-pointer">{column.label}</Label>
        </div>
      ))}
    </div>
  </div>
);