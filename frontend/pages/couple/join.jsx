import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Heart, KeyRound, Mail, Lock } from 'lucide-react';
import { linkPartner } from '../../services/coupleService';
import LinkSuccessModal from '../../components/couple/LinkSuccessModal';
import { auth } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function JoinPartner() {
  const [formData, setFormData] = useState({ inviteCode: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const router = useRouter();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    try {
      // 1. Sign up user
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Link partner using code
      await linkPartner(formData.inviteCode);
      
      setSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Head>
        <title>Join Partner 💕</title>
      </Head>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-romantic p-8 border border-borderPink relative"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
          <Heart size={24} fill="currentColor" />
        </div>

        <h1 className="text-2xl font-bold text-dark mt-6 mb-2 text-center">Join Your Partner</h1>
        <p className="text-gray-light text-center text-sm mb-6">
          Google Sign-In is disabled for secure partner linking. Please use email and password.
        </p>

        {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">{error}</div>}

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 text-primary" size={20} />
            <input 
              type="text" required placeholder="Invite Code (e.g. CL-XXXX-XXXX)" 
              value={formData.inviteCode} onChange={(e) => setFormData({...formData, inviteCode: e.target.value.toUpperCase()})}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none uppercase font-medium tracking-wide"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="email" required placeholder="Email Address" 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" required placeholder="Password" 
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" required placeholder="Confirm Password" 
              value={formData.confirm} onChange={(e) => setFormData({...formData, confirm: e.target.value})}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-light transition-colors mt-2 disabled:opacity-70"
          >
            {loading ? 'Connecting...' : 'Connect Now 💖'}
          </button>
        </form>
      </motion.div>

      <LinkSuccessModal 
        isOpen={successModal} 
        onClose={() => router.push('/couple/linked')} 
      />
    </div>
  );
}
