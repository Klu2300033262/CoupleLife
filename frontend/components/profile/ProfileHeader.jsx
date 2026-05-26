import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

export default function ProfileHeader({ title, backTo = '/profile' }) {
  const router = useRouter();
  
  return (
    <div className="flex items-center space-x-4 mb-6">
      <button 
        onClick={() => router.push(backTo)}
        className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} />
      </button>
      <h1 className="text-xl font-bold text-dark">{title}</h1>
    </div>
  );
}
