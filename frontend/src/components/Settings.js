import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Settings as SettingsIcon, Users, ArrowLeft } from 'lucide-react';
import UserManagement from './UserManagement';

const Settings = ({ onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <p className="text-red-600">Bu sayfaya erişim yetkiniz yok.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-8 h-8" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Ayarlar</h1>
                <p className="text-orange-100 text-xs md:text-sm">Sistem ayarlarını yönetin</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              className="bg-white text-orange-600 hover:bg-orange-50"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Menü</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-center gap-2 ${
                    activeTab === 'users' ? 'bg-orange-100 text-orange-600 font-semibold' : ''
                  }`}
                  data-testid="menu-users"
                >
                  <Users className="w-4 h-4" />
                  Kullanıcı Yönetimi
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'users' && <UserManagement />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;