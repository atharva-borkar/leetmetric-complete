import React, { useState } from 'react';
import { authApi } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toast } from 'react-hot-toast';
import { Lock, Mail, User } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.signUp(email, password);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sign Up</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Create an account to save your favorites and sync your LeetMetric data.
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
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
