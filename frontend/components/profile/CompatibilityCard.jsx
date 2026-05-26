import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getCompatibility } from '../../services/profileService';
import { auth } from '../../services/firebase';

export default function CompatibilityCard() {
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        if (!auth.currentUser) return;
        const token = await auth.currentUser.getIdToken();
        const res = await getCompatibility(token);
        setScore(res.compatibility_score);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScore();
  }, []);

  if (!score) return null;

  return (
    <div className="bg-gradient-to-br from-primary to-primary-light p-6 rounded-2xl shadow-romantic text-white text-center relative overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute -right-4 -top-4 opacity-10"
      >
        <Heart size={120} className="fill-white" />
      </motion.div>

      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-2 opacity-90">Couple Compatibility</h3>
        <div className="text-6xl font-black mb-2">{score}%</div>
        <p className="font-medium text-sm">You both match beautifully 💕</p>
      </div>
    </div>
  );
}
