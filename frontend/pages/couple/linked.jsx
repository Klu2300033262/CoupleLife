import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import AnniversaryForm from '../../components/couple/AnniversaryForm';

export default function LinkedSetup() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/dashboard/couple');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Head>
        <title>Relationship Details 💕</title>
      </Head>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Our Story 💕</h1>
          <p className="text-gray-light">
            Set up your anniversary to start tracking how long you've been together!
          </p>
        </div>

        <AnniversaryForm onComplete={handleComplete} />
        
        <button 
          onClick={handleComplete}
          className="w-full mt-4 text-gray-500 font-medium hover:text-dark transition-colors"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
