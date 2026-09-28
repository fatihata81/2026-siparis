import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ColumnPermissions } from "./ColumnPermissions";

const submitLabel = (loading, editingUser) => {
  if (loading) return "Kaydediliyor...";
  if (editingUser) return "Güncelle";
  return "Oluştur";
};

// The existing editor is inline, not a modal; preserve its layout and focus flow.
export const UserForm = ({ manager }) => {
  const { formData, editingUser, setField } = manager;
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardTitle className="flex items-center justify-between">
          <span data-testid="user-form-title">{editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}</span>
          <Button onClick={manager.resetForm} variant="ghost" className="text-white hover:bg-white/20" size="sm" data-testid="cancel-button" title="İptal" aria-label="İptal"><X className="w-4 h-4" /></Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={manager.handleSubmit} className="space-y-4" data-testid="user-form">
          <div>
            <Label htmlFor="username">Kullanıcı Adı *</Label>
            <Input id="username" value={formData.username} onChange={(event) => setField("username", event.target.value)} required data-testid="input-username" className="border-orange-200 focus:border-orange-400" />
          </div>
          <div>
            <Label htmlFor="password">{editingUser ? "Yeni Şifre (boş bırakılırsa değişmez)" : "Şifre *"}</Label>
            <Input id="password" type="password" value={formData.password} onChange={(event) => setField("password", event.target.value)} required={!editingUser} data-testid="input-password" className="border-orange-200 focus:border-orange-400" />
          </div>
          <div>
            <Label htmlFor="role">Rol *</Label>
            <Select value={formData.role} onValueChange={(value) => { if (value) setField("role", value); }}>
              <SelectTrigger id="role" data-testid="select-role"><SelectValue placeholder="Rol seçin" /></SelectTrigger>
              <SelectContent data-testid="role-options">
                <SelectItem value="admin" data-testid="role-option-admin">Admin</SelectItem>
                <SelectItem value="user" data-testid="role-option-user">Kullanıcı</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ColumnPermissions manager={manager} />
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={manager.loading} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" data-testid="submit-button">{submitLabel(manager.loading, editingUser)}</Button>
            <Button type="button" variant="outline" onClick={manager.resetForm} className="flex-1" data-testid="cancel-form-button">İptal</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};