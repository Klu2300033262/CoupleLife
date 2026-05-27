import React from 'react';

export default function Card({ children, className = '', title, icon: Icon, action }) {
  return (
    <div className={`romantic-card mb-4 ${className}`}>
      {(title || Icon || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-dark font-semibold">
            {Icon && <Icon size={18} className="`text-primary-pink" />}
            {title && <span>{title}</span>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

