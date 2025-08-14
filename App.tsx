
import React, { useState } from 'react';
import BrainDumpPage from './app/brain-dump/page';
import DashboardPage from './app/dashboard/page';
import TasksPage from './app/tasks/page'; // New Import

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'braindump' | 'dashboard' | 'tasks'>('braindump');

  const navButtonClass = (page: 'braindump' | 'dashboard' | 'tasks') => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${activePage === page ? 'bg-brand-accent text-white' : 'text-brand-text-secondary hover:bg-brand-primary hover:text-white'}`;


  return (
    <div className="min-h-screen text-brand-text-primary font-sans">
      <nav className="bg-brand-surface sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16">
            <div className="flex items-center">
                <div className="flex items-baseline space-x-4">
                <button
                    onClick={() => setActivePage('braindump')}
                    className={navButtonClass('braindump')}
                >
                    Brain Dump
                </button>
                 <button
                    onClick={() => setActivePage('tasks')}
                    className={navButtonClass('tasks')}
                >
                    Tasks
                </button>
                <button
                    onClick={() => setActivePage('dashboard')}
                    className={navButtonClass('dashboard')}
                >
                    Dashboard
                </button>
                </div>
            </div>
            </div>
        </div>
      </nav>
      
      <main>
        {activePage === 'braindump' && <BrainDumpPage />}
        {activePage === 'tasks' && <TasksPage />}
        {activePage === 'dashboard' && <DashboardPage />}
      </main>
      
      <footer className="text-center my-12 text-sm text-brand-text-secondary">
        <p>Built for focus. Powered by AI.</p>
      </footer>
    </div>
  );
};

export default App;
