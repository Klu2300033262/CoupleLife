import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import LoadingButton from '../../components/auth/LoadingButton';
import GoogleButton from '../../components/auth/GoogleButton';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Log in to your romantic space">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Email</label>
          <input 
            type="email" name="email" required value={formData.email} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-pink-light"
            placeholder="john@example.com"
          />
        </div>

        <PasswordInput 
          label="Password" value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        
        <div className="flex justify-end mt-1 mb-4">
          <button 
            type="button" 
            onClick={() => router.push('/auth/forgot-password')} 
            className="text-sm font-medium text-primary-pink hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        
        <LoadingButton type="submit" isLoading={loading}>
          Log In
        </LoadingButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
      </div>

      <GoogleButton onClick={handleGoogle} disabled={loading} />

      <p className="text-center mt-6 text-sm text-gray-500">
        Don't have an account?{' '}
        <button onClick={() => router.push('/auth/signup')} className="text-primary-pink font-semibold hover:underline">Sign Up</button>
      </p>

      <p className="text-center mt-4 text-sm text-gray-400">
        Return to{' '}
        <button onClick={() => router.push('/')} className="text-primary-pink font-semibold hover:underline">Home</button>
      </p>
    </AuthCard>
  );
}
