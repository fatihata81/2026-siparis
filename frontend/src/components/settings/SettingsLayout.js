import { ArrowLeft, Settings, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const SettingsHeader = ({ onClose }) => (
  <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg">
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8" />
          <div><h1 className="text-2xl md:text-3xl font-bold" data-testid="settings-title">Ayarlar</h1><p className="text-orange-100 text-xs md:text-sm">Sistem ayarlarını yönetin</p></div>
        </div>
        <Button onClick={onClose} className="bg-white text-orange-600 hover:bg-orange-50" data-testid="back-button"><ArrowLeft className="w-4 h-4 mr-2" />Geri Dön</Button>
      </div>
    </div>
  </header>
);

export const SettingsMenu = ({ activeTab, onSelect }) => (
  <Card>
    <CardHeader><CardTitle>Menü</CardTitle></CardHeader>
    <CardContent className="p-0">
      <button onClick={() => onSelect("users")} className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-center gap-2 ${activeTab === "users" ? "bg-orange-100 text-orange-600 font-semibold" : ""}`} data-testid="menu-users"><Users className="w-4 h-4" />Kullanıcı Yönetimi</button>
    </CardContent>
  </Card>
);