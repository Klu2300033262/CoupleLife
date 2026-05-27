import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordInput = ({ value, onChange, label = 'Password', showValidation = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const validations = {
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
    length: value.length >= 8,
  };

  const getStrength = () => {
    const passedCount = Object.values(validations).filter(Boolean).length;
    if (passedCount === 5) return { text: 'Strong', color: 'bg-green-500', w: 'w-full' };
    if (passedCount >= 3) return { text: 'Medium', color: 'bg-yellow-500', w: 'w-2/3' };
    if (passedCount >= 1) return { text: 'Weak', color: 'bg-red-500', w: 'w-1/3' };
    return { text: '', color: 'bg-gray-200', w: 'w-0' };
  };

  const strength = getStrength();

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-dark mb-1">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:`ring-primary-pink-light transition-colors"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3.5 text-gray-400 hover:`text-primary-pink transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {showValidation && value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className={`h-full ${strength.color} ${strength.w} transition-all duration-300`} />
            </div>
            
            <div className="space-y-1 text-xs">
              <ValidationItem isValid={validations.length} text="Minimum 8 characters" />
              <ValidationItem isValid={validations.uppercase} text="Uppercase letter" />
              <ValidationItem isValid={validations.lowercase} text="Lowercase letter" />
              <ValidationItem isValid={validations.number} text="Number" />
              <ValidationItem isValid={validations.special} text="Special character" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ValidationItem = ({ isValid, text }) => (
  <div className={`flex items-center space-x-2 transition-colors ${isValid ? 'text-green-500' : 'text-gray-light'}`}>
    <span className="font-bold">{isValid ? 'âœ“' : 'âœ—'}</span>
    <span>{text}</span>
  </div>
);

export default PasswordInput;

