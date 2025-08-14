
import React from 'react';

// Placeholder component as per PRP 3
const CategoryFilter: React.FC = () => {
    return (
        <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary animate-fade-in">
            <h4 className="text-lg font-semibold text-brand-text-primary mb-3">Categories</h4>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-text-secondary cursor-pointer hover:text-white">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Work (soon)</span>
                </div>
                <div className="flex items-center gap-2 text-brand-text-secondary cursor-pointer hover:text-white">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Personal (soon)</span>
                </div>
                 <div className="flex items-center gap-2 text-brand-text-secondary cursor-pointer hover:text-white">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Urgent (soon)</span>
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;
