import { Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { USER_COLUMNS } from "../../lib/orderColumns";

const UserRow = ({ user, onEdit, onDelete }) => (
  <tr className="border-b border-gray-100 hover:bg-orange-50/30" data-testid={`user-row-${user.username}`}>
    <td className="py-3 px-2 sm:px-4 break-words" data-testid={`user-name-${user.username}`}>{user.username}</td>
    <td className="py-3 px-2 sm:px-4" data-testid={`user-role-${user.username}`}>
      <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === "admin" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>{user.role === "admin" ? "Admin" : "Kullanıcı"}</span>
    </td>
    <td className="py-3 px-2 sm:px-4" data-testid={`user-columns-${user.username}`}><span className="text-sm text-gray-600">{user.visible_columns?.length || 0} / {USER_COLUMNS.length}</span></td>
    <td className="py-3 px-2 sm:px-4">
      <div className="flex justify-end gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => onEdit(user)} className="hover:bg-orange-50" data-testid={`edit-user-${user.username}`} title="Kullanıcıyı düzenle" aria-label="Kullanıcıyı düzenle"><Edit2 className="w-3 h-3" /></Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(user.id)} className="hover:bg-red-50 text-red-600" disabled={user.username === "admin"} data-testid={`delete-user-${user.username}`} title="Kullanıcıyı sil" aria-label="Kullanıcıyı sil"><Trash2 className="w-3 h-3" /></Button>
      </div>
    </td>
  </tr>
);

export const UserList = ({ users, onEdit, onDelete }) => (
  <Card><CardContent className="p-6">
    <div className="overflow-x-auto">
      <table className="w-full table-fixed sm:table-auto" data-testid="user-list">
        <thead><tr className="border-b border-gray-200">
          {["Kullanıcı Adı", "Rol", "Görünür Kolonlar", "İşlemler"].map((label, index) => <th key={label} className={`py-3 px-2 sm:px-4 font-semibold text-gray-700 ${index === 3 ? "text-right" : "text-left"}`} data-testid={`user-column-${index}`}>{label}</th>)}
        </tr></thead>
        <tbody>{users.map((user) => <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />)}</tbody>
      </table>
      {users.length === 0 && <div className="text-center py-12 text-gray-500" data-testid="users-empty-state">Henüz kullanıcı bulunmuyor</div>}
    </div>
  </CardContent></Card>
);