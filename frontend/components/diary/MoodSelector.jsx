import React from 'react';
import { motion } from 'framer-motion';

const moods = [
  { id: 'Happy', emoji: '😊' },
  { id: 'Romantic', emoji: '💕' },
  { id: 'Sad', emoji: '😢' },
  { id: 'Angry', emoji: '😡' },
  { id: 'Excited', emoji: '🤩' },
  { id: 'Missing you', emoji: '🥺' },
  { id: 'Grateful', emoji: '🙏' },
];

export default function MoodSelector({ selected, onSelect }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-text mb-2">How are you feeling?</label>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {moods.map((mood) => {
          const isSelected = selected === mood.id;
          return (
            <motion.button
              key={mood.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect(isSelected ? 'None' : mood.id)}
              className={`snap-center shrink-0 flex flex-col items-center justify-center p-3 w-20 h-20 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-primary-pink text-white shadow-lg scale-105' : 'bg-white border border-border-pink text-dark-text hover:bg-soft-pink/10'}`}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className={`text-[10px] font-medium leading-tight text-center ${isSelected ? 'text-white' : 'text-gray-text'}`}>{mood.id}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
