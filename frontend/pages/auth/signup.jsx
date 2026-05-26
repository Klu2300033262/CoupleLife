import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import LoadingButton from '../../components/auth/LoadingButton';
import GoogleButton from '../../components/auth/GoogleButton';
import CoupleKeyCard from '../../components/auth/CoupleKeyCard';
import { useAuth } from '../../context/AuthContext';
import { generateCoupleKey } from '../../services/authService';

export default function Signup() {
  const router = useRouter();
  const { signup, loginWithGoogle, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coupleKey, setCoupleKey] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validatePassword = (pass) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass);
  };

  const handleSignup = async (e) => {
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
      const userCred = await signup(formData.email, formData.password, formData.name);
      const token = await userCred.user.getIdToken();
      // Generate Couple Key automatically
      const res = await generateCoupleKey(token);
      setCoupleKey(res.couple_key);
      await refreshUser();
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const userCred = await loginWithGoogle('signup');
      const token = await userCred.user.getIdToken();
      const res = await generateCoupleKey(token);
      setCoupleKey(res.couple_key);
      await refreshUser();
    } catch (err) {
      setError(err.message || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (coupleKey) {
    return (
      <AuthCard title="Account Created! 🎉" subtitle="Share this key to link with your partner.">
        <CoupleKeyCard coupleKey={coupleKey} />
        <LoadingButton onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </LoadingButton>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create Account" subtitle="Start your journey together">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}
      
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Full Name</label>
          <input 
            type="text" name="name" required value={formData.name} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Email</label>
          <input 
            type="email" name="email" required value={formData.email} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
            placeholder="john@example.com"
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
          Sign Up
        </LoadingButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
      </div>

      <GoogleButton onClick={handleGoogle} disabled={loading} />

      <p className="text-center mt-6 text-sm text-gray-500">
        Already have an account?{' '}
        <button onClick={() => router.push('/auth/login')} className="text-primary font-semibold hover:underline">Log In</button>
      </p>

      <p className="text-center mt-4 text-sm text-gray-400">
        Return to{' '}
        <button onClick={() => router.push('/')} className="text-primary font-semibold hover:underline">Home</button>
      </p>
    </AuthCard>
  );
}
