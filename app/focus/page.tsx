
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTasks } from '../../hooks/useTasks';
import FocusTimer from './components/FocusTimer';
import FocusCompleteModal from './components/FocusCompleteModal';
import FocusSettings from './components/FocusSettings';
import { XCircleIcon, CheckCircleIcon, ForwardIcon } from '../../components/icons';

interface FocusPageProps {
  taskId: string;
  onEndFocus: () => void;
}

type SessionStatus = 'idle' | 'running' | 'paused' | 'finished';
export type SessionType = 'focus' | 'break';

const FocusPage: React.FC<FocusPageProps> = ({ taskId, onEndFocus }) => {
  const { tasks, toggleSubtask } = useTasks();
  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId]);

  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(0);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [sessionType, setSessionType] = useState<SessionType>('focus');
  
  const [focusDuration, setFocusDuration] = useState(25 * 60); // 25 minutes
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 5 minutes
  const [timerKey, setTimerKey] = useState(0);

  const activeDuration = sessionType === 'focus' ? focusDuration : breakDuration;

  // Find first uncompleted subtask on load
  useEffect(() => {
    const firstUncompletedIndex = task?.subtasks.findIndex(st => !st.completed) ?? -1;
    setCurrentSubtaskIndex(firstUncompletedIndex >= 0 ? firstUncompletedIndex : 0);
  }, [taskId, task?.subtasks]);

  // Interruption protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (sessionStatus === 'running') {
        e.preventDefault();
        e.returnValue = 'You have an active focus session. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionStatus]);

  const handleExit = () => {
    if (sessionStatus === 'running') {
      if (window.confirm('Are you sure you want to exit the focus session? Your progress is saved.')) {
        onEndFocus();
      }
    } else {
      onEndFocus();
    }
  };

  const advanceToNextSubtask = useCallback(() => {
    if (!task) return;
    const nextIndex = task.subtasks.findIndex((st, index) => index > currentSubtaskIndex && !st.completed);
    if (nextIndex !== -1) {
      setCurrentSubtaskIndex(nextIndex);
    } else {
      // All subsequent tasks are complete, find first incomplete from start
      const firstIncomplete = task.subtasks.findIndex(st => !st.completed);
      setCurrentSubtaskIndex(firstIncomplete); // -1 if all are done
    }
  }, [task, currentSubtaskIndex]);

  const handleMarkComplete = () => {
    if (!task) return;
    const currentSubtask = task.subtasks[currentSubtaskIndex];
    if (currentSubtask && !currentSubtask.completed) {
      toggleSubtask(task.id, currentSubtask.id);
    }
    advanceToNextSubtask();
  };

  const handleSkip = () => {
    advanceToNextSubtask();
  };

  const handleSessionComplete = () => {
    setSessionStatus('finished');
  };

  const startNewSession = (type: SessionType) => {
    setSessionType(type);
    setSessionStatus('running');
    setTimerKey(prev => prev + 1);
  };
  
  if (!task) {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold">Task not found.</h2>
        <button onClick={onEndFocus} className="mt-4 px-4 py-2 bg-brand-accent rounded-md">Return to Tasks</button>
      </div>
    );
  }

  const completedCount = task.subtasks.filter(st => st.completed).length;
  const totalCount = task.subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const currentSubtask = task.subtasks[currentSubtaskIndex];
  const areAllTasksDone = currentSubtaskIndex === -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background to-brand-primary flex flex-col items-center justify-center text-white p-4 font-sans relative transition-colors duration-500">
        
        <div className="absolute top-4 right-4 flex items-center gap-4">
            <FocusSettings
                focusDuration={focusDuration}
                setFocusDuration={setFocusDuration}
                breakDuration={breakDuration}
                setBreakDuration={setBreakDuration}
                isDisabled={sessionStatus === 'running'}
            />
            <button onClick={handleExit} className="flex items-center gap-2 text-brand-text-secondary hover:text-white transition-colors" title="Exit Focus Mode">
                <XCircleIcon className="w-8 h-8"/>
            </button>
        </div>

      <div className="w-full max-w-2xl text-center">
        <header className="mb-8 animate-fade-in">
          <p className="text-brand-text-secondary text-lg">{sessionType === 'focus' ? "Focusing on Task" : "On a Break"}</p>
          <h1 className="text-3xl md:text-4xl font-bold">{task.title}</h1>
        </header>

        <main className="mb-8">
            <FocusTimer
                key={timerKey}
                durationInSeconds={activeDuration}
                isPaused={sessionStatus !== 'running'}
                onComplete={handleSessionComplete}
                sessionType={sessionType}
            />

             <div className="mt-6 flex items-center justify-center gap-4">
                {sessionStatus !== 'running' ? (
                    <button onClick={() => setSessionStatus('running')} className="px-8 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform text-xl">
                        {sessionStatus === 'paused' ? 'Resume' : 'Start'}
                    </button>
                ) : (
                    <button onClick={() => setSessionStatus('paused')} className="px-8 py-3 bg-yellow-500 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform text-xl">
                        Pause
                    </button>
                )}
             </div>
        </main>

        <footer className="w-full animate-fade-in" style={{animationDelay: '200ms'}}>
            <div className="bg-black/20 p-6 rounded-lg shadow-xl">
                {areAllTasksDone ? (
                     <div className="text-center">
                        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4"/>
                        <h3 className="text-2xl font-bold">All done! Great work!</h3>
                        <p className="text-brand-text-secondary">You've completed all sub-tasks for this goal.</p>
                    </div>
                ) : (
                    <>
                    <h2 className="text-lg font-semibold text-brand-text-secondary mb-2">Current Sub-task:</h2>
                    <p className="text-2xl font-medium min-h-[64px] flex items-center justify-center">{currentSubtask.content}</p>
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button onClick={handleMarkComplete} className="flex items-center gap-2 px-4 py-2 bg-brand-accent/80 hover:bg-brand-accent rounded-md transition-colors font-semibold">
                            <CheckCircleIcon className="w-6 h-6"/>
                            <span>Done & Next</span>
                        </button>
                         <button onClick={handleSkip} className="flex items-center gap-2 px-4 py-2 bg-brand-primary/80 hover:bg-brand-primary rounded-md transition-colors font-semibold">
                            <ForwardIcon className="w-6 h-6"/>
                            <span>Skip</span>
                        </button>
                    </div>
                    </>
                )}
            </div>

            <div className="mt-6">
                <p className="text-sm text-brand-text-secondary mb-1">Overall Progress ({completedCount}/{totalCount})</p>
                <div className="w-full bg-black/20 rounded-full h-4">
                    <div 
                        className="bg-green-500 h-4 rounded-full transition-all duration-500"
                        style={{width: `${progress}%`}}>
                    </div>
                </div>
            </div>
        </footer>
      </div>
      
      {sessionStatus === 'finished' && (
        <FocusCompleteModal 
            sessionType={sessionType}
            onStartBreak={() => startNewSession('break')}
            onStartNewSession={() => startNewSession('focus')}
            onEndFocus={onEndFocus}
        />
      )}
    </div>
  );
};

export default FocusPage;