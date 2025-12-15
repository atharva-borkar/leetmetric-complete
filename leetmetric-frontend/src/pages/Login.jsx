import React, { useState } from "react";
import { authApi } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { toast } from "react-hot-toast";
import { Lock, Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.signIn(email, password);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (state.currentUser) {
    // already logged in
    navigate("/");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Login
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Log in to save favorites and personalize your LeetMetric experience.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={Mail}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={Lock}
            required
          />
          <Button type="submit" className="w-full" loading={loading}>
            Log In
          </Button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 dark:text-indigo-400 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
