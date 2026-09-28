import { useState } from "react";
import { api } from "../lib/api";
import { USER_COLUMNS } from "../lib/orderColumns";
import { useApiResource } from "./useApiResource";
import { useApiAction } from "./useApiAction";

const EMPTY_USERS = [];
const createUserForm = () => ({ username: "", password: "", role: "user", visible_columns: USER_COLUMNS.map((column) => column.id) });

export const useUserManagement = () => {
  const { data, refresh } = useApiResource("/users", "Kullanıcılar yüklenemedi");
  const { loading, execute } = useApiAction();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(createUserForm);
  const resetForm = () => { setFormData(createUserForm()); setEditingUser(null); setShowForm(false); };
  const addUser = () => { resetForm(); setShowForm(true); };
  const editUser = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, password: "", role: user.role, visible_columns: user.visible_columns || createUserForm().visible_columns });
    setShowForm(true);
  };
  const setField = (name, value) => setFormData((previous) => ({ ...previous, [name]: value }));
  const toggleColumn = (columnId) => setFormData((previous) => ({
    ...previous,
    visible_columns: previous.visible_columns.includes(columnId) ? previous.visible_columns.filter((id) => id !== columnId) : [...previous.visible_columns, columnId],
  }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...formData };
    if (editingUser && !payload.password) delete payload.password;
    const operation = () => editingUser ? api.put(`/users/${editingUser.id}`, payload) : api.post("/users", payload);
    const saved = await execute(operation, editingUser ? "Kullanıcı güncellendi" : "Kullanıcı oluşturuldu", "İşlem başarısız", true);
    if (saved) { await refresh(); resetForm(); }
  };
  const deleteUser = async (id) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;
    const deleted = await execute(() => api.delete(`/users/${id}`), "Kullanıcı silindi", "Kullanıcı silinemedi");
    if (deleted) await refresh();
  };
  const selectAllColumns = () => setField("visible_columns", USER_COLUMNS.map((column) => column.id));
  const deselectAllColumns = () => setField("visible_columns", []);
  return { users: data || EMPTY_USERS, loading, showForm, editingUser, formData, addUser, editUser, deleteUser, resetForm, setField, toggleColumn, selectAllColumns, deselectAllColumns, handleSubmit };
};