import React from 'react';
import { useRouter } from 'next/router';
import { Home, BookHeart, MessageCircle, Target, Wallet, Plane } from 'lucide-react';

export default function BottomNav() {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Diary', icon: BookHeart, path: '/diary' },
    { name: 'Chat', icon: MessageCircle, path: '/chat' },
    { name: 'Bucket List', icon: Target, path: '/bucket-list' },
    { name: 'Expenses', icon: Wallet, path: '/expenses' },
    { name: 'Trips', icon: Plane, path: '/trips' },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-2 py-3 z-50 flex justify-between items-center rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.02)] overflow-x-auto hide-scrollbar">
      {/* Optional: Add custom scrollbar hiding class in CSS for smooth horizontal scroll on small devices */}
      <div className="flex w-full justify-between min-w-max space-x-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center w-16 p-1 rounded-xl transition-all ${
                isActive ? '`text-primary-pink' : 'text-gray-400 hover:`text-primary-pink/70'
              }`}
            >
              <div className={`p-1.5 rounded-full ${isActive ? '`bg-primary-pink/10' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

