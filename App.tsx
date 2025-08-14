
import React, { useState } from 'react';
import BrainDumpPage from './app/brain-dump/page';
import DashboardPage from './app/dashboard/page';
import TasksPage from './app/tasks/page';
import FocusPage from './app/focus/page';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import UserProfile from './components/UserProfile';

type Page = 'braindump' | 'dashboard' | 'tasks' | 'focus';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);

  const handleStartFocus = (taskId: string) => {
    setFocusTaskId(taskId);
    setActivePage('focus');
  };

  const handleEndFocus = () => {
    setFocusTaskId(null);
    setActivePage('tasks');
  };

  const navButtonClass = (page: Page) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${activePage === page ? 'bg-brand-accent text-white' : 'text-brand-text-secondary hover:bg-brand-primary hover:text-white'}`;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="w-12 h-12 border-4 border-t-transparent border-brand-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }
  
  if (activePage === 'focus' && focusTaskId) {
    return <FocusPage taskId={focusTaskId} onEndFocus={handleEndFocus} />;
  }

  return (
    <div className="min-h-screen text-brand-text-primary font-sans">
      <nav className="bg-brand-surface sticky top-0 z-20 border-b border-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                  <span className="font-bold text-lg text-white">MindScribe</span>
              </div>
              <div className="flex items-center">
                  <div className="hidden md:flex items-baseline space-x-4">
                     <button onClick={() => setActivePage('dashboard')} className={navButtonClass('dashboard')}>
                        Dashboard
                    </button>
                    <button onClick={() => setActivePage('braindump')} className={navButtonClass('braindump')}>
                        Brain Dump
                    </button>
                    <button onClick={() => setActivePage('tasks')} className={navButtonClass('tasks')}>
                        Tasks
                    </button>
                  </div>
              </div>
              <div className="flex items-center">
                  <UserProfile />
              </div>
            </div>
             <div className="md:hidden flex items-center justify-center space-x-4 pb-3">
                <button onClick={() => setActivePage('dashboard')} className={navButtonClass('dashboard')}>
                    Dashboard
                </button>
                <button onClick={() => setActivePage('braindump')} className={navButtonClass('braindump')}>
                    Brain Dump
                </button>
                <button onClick={() => setActivePage('tasks')} className={navButtonClass('tasks')}>
                    Tasks
                </button>
             </div>
        </div>
      </nav>
      
      <main>
        {activePage === 'braindump' && <BrainDumpPage />}
        {activePage === 'tasks' && <TasksPage onStartFocus={handleStartFocus} />}
        {activePage === 'dashboard' && <DashboardPage onStartFocus={handleStartFocus} />}
      </main>
      
      <footer className="text-center my-12 text-sm text-brand-text-secondary">
        <p>Built for focus. Powered by AI.</p>
      </footer>
    </div>
  );
};

export default App;