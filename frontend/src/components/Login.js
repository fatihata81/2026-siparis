import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LoginForm } from "./auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2" data-testid="login-title"><Lock className="w-6 h-6" />Sipariş Yönetim Sistemi</CardTitle>
        </CardHeader>
        <CardContent className="p-8"><LoginForm /></CardContent>
      </Card>
    </div>
  );
}