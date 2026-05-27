import React from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CoupleKeyCard = ({ coupleKey }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupleKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="`bg-primary-pink/5 border `border-primary-pink/20 rounded-xl p-6 text-center my-6"
    >
      <p className="text-sm text-gray-light mb-2">Your Unique Couple Key</p>
      <div className="flex items-center justify-center space-x-3 mb-2">
        <span className="text-2xl font-bold tracking-widest `text-primary-pink">{coupleKey}</span>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:`text-primary-pink transition-colors"
        >
          {copied ? <CheckCircle2 size={24} className="text-green-500" /> : <Copy size={24} />}
        </button>
      </div>
      <p className="text-xs text-gray-500">Share this key with your partner to link accounts.</p>
    </motion.div>
  );
};

export default CoupleKeyCard;

