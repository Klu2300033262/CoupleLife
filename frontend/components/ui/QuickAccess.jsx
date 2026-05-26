import React from 'react';
import { BookHeart, MessageCircle, Target, Wallet, Plane } from 'lucide-react';
import { useRouter } from 'next/router';

export default function QuickAccess() {
  const router = useRouter();

  const accessItems = [
    {
      name: 'Diary',
      description: 'Shared memories',
      icon: BookHeart,
      path: '/diary',
      bgClass: 'bg-pink-50',
      iconBgClass: 'bg-pink-500',
    },
    {
      name: 'Chat',
      description: 'Private messages',
      icon: MessageCircle,
      path: '/chat',
      bgClass: 'bg-blue-50',
      iconBgClass: 'bg-blue-500',
    },
    {
      name: 'Bucket List',
      description: 'Dreams & goals',
      icon: Target,
      path: '/bucket-list',
      bgClass: 'bg-purple-50',
      iconBgClass: 'bg-purple-500',
    },
    {
      name: 'Expenses',
      description: 'Split bills',
      icon: Wallet,
      path: '/expenses',
      bgClass: 'bg-green-50',
      iconBgClass: 'bg-[#10b981]',
    },
    {
      name: 'Trips',
      description: 'Adventures',
      icon: Plane,
      path: '/trips',
      bgClass: 'bg-orange-50',
      iconBgClass: 'bg-orange-500',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-dark mb-4 px-2">Quick Access</h2>
      <div className="grid grid-cols-2 gap-4">
        {accessItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`${item.bgClass} rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between min-h-[100px]`}
            >
              <div className={`${item.iconBgClass} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-sm`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-dark text-sm">{item.name}</h3>
                <p className="text-xs text-gray-500 font-medium">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
