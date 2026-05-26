import React from 'react';
import { Camera } from 'lucide-react';

export default function Avatar({ src, initials, size = 'md', className = '', showCamera = false, onClick }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
    xl: 'w-32 h-32 text-5xl',
  };

  return (
    <div className={`relative inline-block ${className}`} onClick={onClick}>
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#c026d3] to-[#f43f5e] flex items-center justify-center font-bold text-white shadow-lg overflow-hidden`}
      >
        {src ? (
          <img src={src} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {showCamera && (
        <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 cursor-pointer">
          <Camera size={14} className="text-primary" />
        </div>
      )}
    </div>
  );
}
