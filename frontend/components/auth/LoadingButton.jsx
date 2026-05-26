import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingButton = ({ children, isLoading, onClick, type = 'button', disabled = false, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`primary-button flex items-center justify-center space-x-2 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading && <Loader2 className="animate-spin" size={20} />}
      <span>{children}</span>
    </motion.button>
  );
};

export default LoadingButton;
