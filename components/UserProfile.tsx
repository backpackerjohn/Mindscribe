
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon, LogoutIcon } from './icons';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-accent transition-colors"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <UserCircleIcon className="h-6 w-6 text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-brand-surface rounded-md shadow-lg ring-1 ring-brand-primary ring-opacity-50 focus:outline-none animate-fade-in"
             style={{ animationDuration: '150ms' }}
             role="menu"
             aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            <div className="px-4 py-2 border-b border-brand-primary">
                <p className="text-sm text-brand-text-secondary" role="none">
                    Signed in as
                </p>
                <p className="text-sm font-medium text-brand-text-primary truncate" role="none">
                    {user.email}
                </p>
            </div>
            <button
              onClick={logout}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-brand-text-secondary hover:bg-brand-primary hover:text-white transition-colors"
              role="menuitem"
            >
              <LogoutIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
