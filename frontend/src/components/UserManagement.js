import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { UserPlus, Edit2, Trash2, Key, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Available columns for visibility configuration
const ALL_COLUMNS = [
  { id: 'order_no', label: 'Sipariş No' },
  { id: 'date', label: 'Tarih' },
  { id: 'name', label: 'Ad Soyad' },
  { id: 'phone', label: 'Telefon' },
  { id: 'province', label: 'İl' },
  { id: 'payment_type', label: 'Ödeme Tipi' },
  { id: 'amount', label: 'Tutar' },
  { id: 'status', label: 'Durum' },
  { id: 'cargo_company', label: 'Kargo' },
  { id: 'features', label: 'Özellik' },
  { id: 'order_note', label: 'Sipariş Notu' },
  { id: 'actions', label: 'İşlemler' }
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    visible_columns: ALL_COLUMNS.map(col => col.id)
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
      toast.error('Kullanıcılar yüklenemedi');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser) {
        // Update user
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't update password if empty
        }
        await axios.put(`${API}/users/${editingUser.id}`, updateData);
        toast.success('Kullanıcı güncellendi');
      } else {
        // Create new user
        await axios.post(`${API}/users`, formData);
        toast.success('Kullanıcı oluşturuldu');
      }
      
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('İşlem başarısız:', error);
      toast.error(error.response?.data?.detail || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      visible_columns: user.visible_columns || ALL_COLUMNS.map(col => col.id)
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`${API}/users/${userId}`);
      toast.success('Kullanıcı silindi');
      fetchUsers();
    } catch (error) {
      console.error('Kullanıcı silinemedi:', error);
      toast.error('Kullanıcı silinemedi');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'user',
      visible_columns: ALL_COLUMNS.map(col => col.id)
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const toggleColumn = (columnId) => {
    setFormData(prev => ({
      ...prev,
      visible_columns: prev.visible_columns.includes(columnId)
        ? prev.visible_columns.filter(id => id !== columnId)
        : [...prev.visible_columns, columnId]
    }));
  };

  const selectAllColumns = () => {
    setFormData(prev => ({
      ...prev,
      visible_columns: ALL_COLUMNS.map(col => col.id)
    }));
  };

  const deselectAllColumns = () => {
    setFormData(prev => ({
      ...prev,
      visible_columns: []
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kullanıcı Yönetimi</h2>
          <p className="text-sm text-gray-600">Sistemdeki kullanıcıları yönetin</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            data-testid="add-user-button"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Yeni Kullanıcı
          </Button>
        )}
      </div>

      {/* User Form */}
      {showForm && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardTitle className="flex items-center justify-between">
              <span>{editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</span>
              <Button
                onClick={resetForm}
                variant="ghost"
                className="text-white hover:bg-white/20"
                size="sm"
                data-testid="cancel-button"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Kullanıcı Adı *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  data-testid="input-username"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <div>
                <Label htmlFor="password">
                  {editingUser ? 'Yeni Şifre (boş bırakılırsa değişmez)' : 'Şifre *'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  data-testid="input-password"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <div>
                <Label htmlFor="role">Rol *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger data-testid="select-role">
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">Kullanıcı</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Görünür Kolonlar</Label>
                  <div className="space-x-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={selectAllColumns}
                      className="text-xs"
                    >
                      Tümünü Seç
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={deselectAllColumns}
                      className="text-xs"
                    >
                      Tümünü Kaldır
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-orange-200 rounded-lg bg-orange-50/30">
                  {ALL_COLUMNS.map((column) => (
                    <div key={column.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${column.id}`}
                        checked={formData.visible_columns.includes(column.id)}
                        onCheckedChange={() => toggleColumn(column.id)}
                        data-testid={`checkbox-${column.id}`}
                      />
                      <Label
                        htmlFor={`col-${column.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {column.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  data-testid="submit-button"
                >
                  {loading ? 'Kaydediliyor...' : editingUser ? 'Güncelle' : 'Oluştur'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                  data-testid="cancel-form-button"
                >
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      {!showForm && (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Kullanıcı Adı</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rol</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Görünür Kolonlar</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-orange-50/30">
                      <td className="py-3 px-4">{user.username}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {user.visible_columns?.length || 0} / {ALL_COLUMNS.length}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user)}
                            className="hover:bg-orange-50"
                            data-testid={`edit-user-${user.username}`}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(user.id)}
                            className="hover:bg-red-50 text-red-600"
                            disabled={user.username === 'admin'}
                            data-testid={`delete-user-${user.username}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Henüz kullanıcı bulunmuyor
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
