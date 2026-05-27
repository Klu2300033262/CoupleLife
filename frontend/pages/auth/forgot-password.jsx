import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../../components/auth/AuthCard';
import LoadingButton from '../../components/auth/LoadingButton';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Reset Password" subtitle="We'll send you a link to reset it">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">{success}</div>}
      
      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Email</label>
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-pink-light"
            placeholder="john@example.com"
          />
        </div>

        <LoadingButton type="submit" isLoading={loading}>
          Send Reset Link
        </LoadingButton>
      </form>

      <p className="text-center mt-6 text-sm text-gray-500">
        Remembered your password?{' '}
        <button onClick={() => router.push('/auth/login')} className="text-primary-pink font-semibold hover:underline">Log In</button>
      </p>

      <p className="text-center mt-4 text-sm text-gray-400">
        Return to{' '}
        <button onClick={() => router.push('/')} className="text-primary-pink font-semibold hover:underline">Home</button>
      </p>
    </AuthCard>
  );
}
