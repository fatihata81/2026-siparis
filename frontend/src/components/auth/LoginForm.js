import { Lock, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useLoginForm } from "../../hooks/useLoginForm";

export const LoginForm = () => {
  const form = useLoginForm();
  return (
    <form onSubmit={form.handleSubmit} className="space-y-4" data-testid="login-form">
      <div>
        <Label htmlFor="username">Kullanıcı Adı</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input id="username" type="text" value={form.username} onChange={(event) => form.setUsername(event.target.value)} placeholder="Kullanıcı adınızı girin" className="pl-10" required data-testid="input-username" />
        </div>
      </div>
      <div>
        <Label htmlFor="password">Şifre</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input id="password" type="password" value={form.password} onChange={(event) => form.setPassword(event.target.value)} placeholder="Şifrenizi girin" className="pl-10" required data-testid="input-password" />
        </div>
      </div>
      <Button type="submit" disabled={form.loading} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6" data-testid="login-button">
        {form.loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
      <p className="text-xs text-center text-gray-500 mt-4" data-testid="default-login-hint">İlk giriş: admin / admin</p>
    </form>
  );
};