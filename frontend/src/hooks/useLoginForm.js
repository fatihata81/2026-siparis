import { useState } from "react";
import { createElement } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { notifySuccess } from "../lib/notifications";

export const useLoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await login(username, password);
    if (result.success) notifySuccess("Giriş başarılı!");
    else toast.error(createElement("span", { "data-testid": "login-error" }, result.error), { id: "login-error" });
    setLoading(false);
  };
  return { username, setUsername, password, setPassword, loading, handleSubmit };
};