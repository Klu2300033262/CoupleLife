import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoadingButton from '../components/auth/LoadingButton';

export default function Welcome() {
  const router = useRouter();
  const { currentUser, backendUser } = useAuth();

  useEffect(() => {
    if (currentUser && backendUser) {
      if (backendUser.couple_id) {
        router.push('/dashboard');
      }
    }
  }, [currentUser, backendUser, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="text-center mb-12"
      >
        <div className="w-24 h-24 bg-gradient-to-tr from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-romantic">
          <span className="text-4xl text-white">💖</span>
        </div>
        <h1 className="text-4xl font-bold text-dark mb-2">CoupleLife OS</h1>
        <p className="text-gray-light text-lg">Your romantic space, together.</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm space-y-4"
      >
        <LoadingButton onClick={() => router.push('/auth/signup')}>
          Create New Couple
        </LoadingButton>
        <button 
          onClick={() => router.push('/auth/join-couple')}
          className="w-full py-3.5 text-primary font-medium border-2 border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
        >
          Join Your Partner 💕
        </button>
        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <button onClick={() => router.push('/auth/login')} className="text-primary font-semibold hover:underline">
            Log In
          </button>
        </p>
      </motion.div>
    </div>
  );
}
