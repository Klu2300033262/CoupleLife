import React from 'react';
import { motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="romantic-card w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2">{title}</h1>
          {subtitle && <p className="text-gray-light">{subtitle}</p>}
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthCard;
