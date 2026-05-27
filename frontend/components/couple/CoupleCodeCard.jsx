import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2 } from 'lucide-react';

export default function CoupleCodeCard({ inviteCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CoupleLife OS Invite',
          text: `Join me on CoupleLife OS! Use my couple code: ${inviteCode}`,
          url: window.location.origin + '/couple/join',
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-romantic p-6 border border-borderPink text-center"
    >
      <h3 className="text-gray-light text-sm mb-2 font-medium">Your Unique Couple Code</h3>
      
      <div className="flex items-center justify-center gap-3 bg-background rounded-lg p-4 mb-4 border border-borderPink">
        <span className="text-2xl font-bold tracking-widest text-dark">{inviteCode}</span>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-2 `bg-primary-pink text-white py-3 rounded-lg font-medium hover:`bg-primary-pink-light transition-colors"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied! ðŸ’–' : 'Copy Code'}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center bg-gray-100 text-dark p-3 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Share2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}

