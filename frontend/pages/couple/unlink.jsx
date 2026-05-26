import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { unlinkPartner } from '../../services/coupleService';

export default function UnlinkPartner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUnlink = async () => {
    if (!confirm('Are you absolutely sure you want to unlink? This action cannot be easily undone.')) {
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await unlinkPartner();
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to unlink partner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Head>
        <title>Unlink Partner</title>
      </Head>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-red-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
        
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>

        <h1 className="text-2xl font-bold text-dark text-center mb-4">Unlink Partner?</h1>
        <p className="text-gray-light text-center mb-6">
          Unlinking will remove shared relationship access. You will no longer be able to see each other's memories, 
          chat history, and anniversary details. Personal data is preserved.
        </p>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center mb-6">{error}</div>}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleUnlink}
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Unlinking...' : 'Yes, Unlink Partner'}
          </button>
          
          <button
            onClick={() => router.back()}
            disabled={loading}
            className="w-full bg-gray-100 text-dark py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
