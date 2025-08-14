
import React from 'react';
import { BrainCircuitIcon } from '../../components/icons';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-primary tracking-tight">
            Unified Dashboard
          </h1>
          <p className="text-brand-text-secondary mt-2">
            Your thoughts and tasks, all in one place. (Coming Soon)
          </p>
        </header>

        <div className="text-center text-brand-text-secondary p-8 rounded-lg bg-brand-surface border-2 border-dashed border-brand-primary">
            <BrainCircuitIcon className="h-12 w-12 mx-auto mb-4 text-brand-secondary" />
            <h3 className="text-lg font-semibold text-brand-text-primary">
                Feature Under Construction
            </h3>
            <p className="mt-1">
                This dashboard will provide a unified overview of your thoughts, tasks, and cross-system insights.
            </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
