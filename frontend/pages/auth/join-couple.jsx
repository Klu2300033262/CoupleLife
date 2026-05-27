import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import LoadingButton from '../../components/auth/LoadingButton';
import { useAuth } from '../../context/AuthContext';
import { linkPartner } from '../../services/authService';

export default function JoinCouple() {
  const router = useRouter();
  const { signup, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({ coupleKey: '', name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validatePassword = (pass) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (!validatePassword(formData.password)) {
      return setError('Please meet all password requirements');
    }

    setLoading(true);
    try {
      // 1. Sign up the user via Firebase
      const userCred = await signup(formData.email, formData.password, formData.name);
      const token = await userCred.user.getIdToken();
      
      // 2. Link with partner using couple key
      await linkPartner(token, formData.coupleKey);
      
      // 3. Refresh user state to fetch the partner data
      await refreshUser();
      
      // Removed setTimeout, immediately push and wait
      await router.push('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Joining failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Join Your Partner 💕" subtitle="Enter the couple key to link your accounts">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
      
      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Couple Key</label>
          <input 
            type="text" name="coupleKey" required value={formData.coupleKey} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-pink-light uppercase font-bold tracking-widest text-center"
            placeholder="CL-XXXX-XXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-1">Full Name</label>
          <input 
            type="text" name="name" required value={formData.name} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-pink-light"
            placeholder="Jane Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Email</label>
          <input 
            type="email" name="email" required value={formData.email} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-pink-light"
            placeholder="jane@example.com"
          />
        </div>

        <PasswordInput 
          label="Password" value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          showValidation={true}
        />
        
        <PasswordInput 
          label="Confirm Password" value={formData.confirmPassword} 
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
        />

        <LoadingButton type="submit" isLoading={loading}>
          Join Partner
        </LoadingButton>
      </form>

      <div className="mt-6 p-4 bg-primary-pink/5 rounded-lg border border-primary-pink/10">
        <p className="text-xs text-gray-500 text-center">
          <span className="font-semibold text-primary-pink">Security Note:</span> Google Sign-In is disabled for partner linking. Please use email/password signup to verify direct account ownership.
        </p>
      </div>

      <p className="text-center mt-6 text-sm text-gray-500">
        Back to{' '}
        <button onClick={() => router.push('/')} className="text-primary-pink font-semibold hover:underline">Home</button>
      </p>
    </AuthCard>
  );
}
