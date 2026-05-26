import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function ExpiryTimer({ expiresAt, onExpired }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt) - new Date();
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        if (onExpired) onExpired();
        return;
      }
      
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  return (
    <div className={`flex items-center justify-center gap-2 text-sm mt-4 font-medium ${isExpired ? 'text-red-500' : 'text-gray-light'}`}>
      <Clock size={16} />
      <span>{isExpired ? 'This invite code has expired 💔' : `Expires in: ${timeLeft}`}</span>
    </div>
  );
}
