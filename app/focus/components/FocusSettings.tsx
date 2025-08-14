
import React, { useState, useRef, useEffect } from 'react';
import { Cog6ToothIcon } from '../../../components/icons';

interface FocusSettingsProps {
    focusDuration: number;
    setFocusDuration: (duration: number) => void;
    breakDuration: number;
    setBreakDuration: (duration: number) => void;
    isDisabled: boolean;
}

const FocusSettings: React.FC<FocusSettingsProps> = ({
    focusDuration,
    setFocusDuration,
    breakDuration,
    setBreakDuration,
    isDisabled
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const focusOptions = [15, 25, 45, 60];
    const breakOptions = [5, 10, 15];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isDisabled}
                className="flex items-center gap-2 text-brand-text-secondary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Focus Settings"
            >
                <Cog6ToothIcon className="w-8 h-8" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-brand-surface rounded-md shadow-lg ring-1 ring-brand-primary p-4 animate-fade-in" style={{ animationDuration: '150ms' }}>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-brand-text-secondary mb-1'>Focus Length</label>
                            <select
                                value={focusDuration / 60}
                                onChange={(e) => setFocusDuration(Number(e.target.value) * 60)}
                                className='w-full bg-brand-primary border border-brand-secondary rounded-md p-2 text-white'
                            >
                                {focusOptions.map(min => <option key={min} value={min}>{min} minutes</option>)}
                            </select>
                        </div>
                         <div>
                            <label className='block text-sm font-medium text-brand-text-secondary mb-1'>Break Length</label>
                            <select
                                value={breakDuration / 60}
                                onChange={(e) => setBreakDuration(Number(e.target.value) * 60)}
                                className='w-full bg-brand-primary border border-brand-secondary rounded-md p-2 text-white'
                            >
                                 {breakOptions.map(min => <option key={min} value={min}>{min} minutes</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FocusSettings;
