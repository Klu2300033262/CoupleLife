import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { generateCoupleKey } from '../../services/coupleService';
import CoupleCodeCard from '../../components/couple/CoupleCodeCard';
import ExpiryTimer from '../../components/couple/ExpiryTimer';

export default function GenerateCode() {
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCode = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await generateCoupleKey();
      setInviteData(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate code.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCode();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 pt-12">
      <Head>
        <title>Invite Your Partner 💕</title>
      </Head>

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-dark mb-2 text-center">Invite Your Partner 💕</h1>
        <p className="text-gray-light text-center mb-8">
          Share this unique code with your partner to link your accounts forever.
        </p>
        {loading ? (
          <div className="text-center text-primary-pink animate-pulse py-10">Generating magic code... ✨</div>
        ) : error ? (
          <div className="text-center text-red-500 mb-4 bg-red-50 p-4 rounded-xl border border-red-200">
            {error}
            <button onClick={fetchCode} className="block w-full mt-4 bg-primary-pink text-white py-2 rounded-lg">
              Try Again
            </button>
          </div>
        ) : inviteData ? (
          <>
            <CoupleCodeCard inviteCode={inviteData.invite_code} />
            <ExpiryTimer expiresAt={inviteData.code_expires_at} onExpired={() => {}} />
            {new Date(inviteData.code_expires_at) < new Date() && (
              <button onClick={fetchCode} className="w-full mt-6 bg-white border border-borderPink text-primary-pink font-medium py-3 rounded-lg hover:bg-pink-50 transition-colors">
                Generate New Code
              </button>
            )}
          </>
        ) : null}
      </motion.div>
    </div>
  );
}
