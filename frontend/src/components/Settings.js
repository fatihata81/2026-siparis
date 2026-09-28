import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent } from "./ui/card";
import { SettingsHeader, SettingsMenu } from "./settings/SettingsLayout";
import UserManagement from "./UserManagement";

export default function Settings({ onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  if (user?.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center"><Card><CardContent className="p-8"><p className="text-red-600" data-testid="settings-access-denied">Bu sayfaya erişim yetkiniz yok.</p></CardContent></Card></div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <SettingsHeader onClose={onClose} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1"><SettingsMenu activeTab={activeTab} onSelect={setActiveTab} /></div>
          <div className="lg:col-span-3 min-w-0">{activeTab === "users" && <UserManagement />}</div>
        </div>
      </main>
    </div>
  );
}