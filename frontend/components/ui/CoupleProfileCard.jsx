import React from 'react';
import { Edit2, Heart } from 'lucide-react';
import { useRouter } from 'next/router';
import Avatar from './Avatar';

export default function CoupleProfileCard({ user, partner }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-romantic p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 `bg-primary-pink/5 rounded-bl-full -z-10"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 `text-primary-pink font-bold text-sm">
          <Heart size={16} className="`fill-primary-pink" />
          <span>Couple Profile</span>
        </div>
        <button 
          onClick={() => router.push('/edit-profile')} 
          className="text-gray-400 hover:`text-primary-pink transition-colors"
        >
          <Edit2 size={16} />
        </button>
      </div>

      <div className="flex justify-center items-center">
        {/* User Avatar */}
        <div className="flex flex-col items-center">
          <Avatar src={user?.avatar} initials={user?.name?.charAt(0)?.toUpperCase()} size="lg" className="mb-3" />
          <h3 className="font-bold text-dark">{user?.name}</h3>
          <div className="flex items-center text-[#10b981] text-xs font-medium mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] mr-1.5"></div>
            Online
          </div>
        </div>

        {/* Link Heart */}
        <div className="flex flex-col items-center px-6">
          <div className="`text-primary-pink mt-2">
            <Heart size={20} className="`fill-primary-pink" />
          </div>
          <span className="text-[10px] text-gray-400 font-medium mt-1">Linked</span>
        </div>

        {/* Partner Avatar */}
        {partner ? (
          <div className="flex flex-col items-center">
            <Avatar src={partner.avatar} initials={partner.name?.charAt(0)?.toUpperCase()} size="lg" className="mb-3" />
            <h3 className="font-bold text-dark">{partner.name}</h3>
            {partner.online_status ? (
              <div className="flex items-center text-[#10b981] text-xs font-medium mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] mr-1.5"></div>
                Online
              </div>
            ) : (
              <div className="flex items-center text-gray-400 text-xs font-medium mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></div>
                Offline
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 mb-3">
              <span className="text-gray-400 text-sm font-medium">No Partner</span>
            </div>
            <h3 className="font-bold text-gray-400">Waiting...</h3>
          </div>
        )}
      </div>
    </div>
  );
}

