import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeSwitcher({ currentTheme, onChange }) {
  const options = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="flex bg-gray-100 p-1 rounded-xl">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = currentTheme === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-dark'
            }`}
          >
            <Icon size={16} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
