import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function CompletionProgress({ percentage }) {
  const router = useRouter();
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center space-x-6 bg-white p-5 rounded-2xl shadow-sm border border-pink-50">
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: 0.2, type: 'spring' }}
            cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={circumference}
            className="text-primary"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-lg font-bold text-dark">{percentage}%</span>
      </div>
      <div>
        <h3 className="font-bold text-dark mb-1">Profile Completion</h3>
        <p className="text-xs text-gray-500 mb-3">Complete your profile to unlock more features!</p>
        <button 
          onClick={() => router.push('/profile/edit')}
          className="text-xs font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
        >
          Complete Now
        </button>
      </div>
    </div>
  );
}
