import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function LinkSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
        >
          {/* Floating Hearts Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 100, x: Math.random() * 200 - 100, opacity: 0 }}
                animate={{ y: -200, opacity: [0, 1, 0] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                className="absolute bottom-0 left-1/2 `text-primary-pink"
              >
                <Heart fill="currentColor" size={24} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 `bg-primary-pink/10 rounded-full flex items-center justify-center mx-auto mb-6 `text-primary-pink"
          >
            <Heart size={40} fill="currentColor" className="animate-pulse" />
          </motion.div>

          <h2 className="text-2xl font-bold text-dark mb-2">Connected Forever ðŸ’–</h2>
          <p className="text-gray-light mb-8">
            You and your partner are now linked successfully. Your shared dashboard is ready!
          </p>

          <button
            onClick={onClose}
            className="w-full `bg-primary-pink text-white py-3 rounded-lg font-medium hover:`bg-primary-pink-light transition-colors relative z-10"
          >
            Continue
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

