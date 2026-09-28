import { UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { useUserManagement } from "../hooks/useUserManagement";
import { UserForm } from "./users/UserForm";
import { UserList } from "./users/UserList";

export default function UserManagement() {
  const manager = useUserManagement();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800" data-testid="user-management-title">Kullanıcı Yönetimi</h2>
          <p className="text-sm text-gray-600">Sistemdeki kullanıcıları yönetin</p>
        </div>
        {!manager.showForm && <Button onClick={manager.addUser} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" data-testid="add-user-button"><UserPlus className="w-4 h-4 mr-2" />Yeni Kullanıcı</Button>}
      </div>
      {manager.showForm ? <UserForm manager={manager} /> : <UserList users={manager.users} onEdit={manager.editUser} onDelete={manager.deleteUser} />}
    </div>
  );
}