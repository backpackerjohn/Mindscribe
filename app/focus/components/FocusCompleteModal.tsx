
import React from 'react';
import { SessionType } from '../page';
import { SparklesIcon } from '../../../components/icons';

interface FocusCompleteModalProps {
    sessionType: SessionType;
    onStartBreak: () => void;
    onStartNewSession: () => void;
    onEndFocus: () => void;
}

const FocusCompleteModal: React.FC<FocusCompleteModalProps> = ({ sessionType, onStartBreak, onStartNewSession, onEndFocus }) => {
    
    const title = sessionType === 'focus' ? "Focus Session Complete!" : "Break's Over!";
    const message = sessionType === 'focus' 
        ? "Great work! Time for a well-deserved break."
        : "Hope you're refreshed! Ready for another round?";

    return (
        <div className="fixed inset-0 bg-brand-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-brand-surface border border-brand-primary rounded-lg shadow-2xl w-full max-w-sm text-center p-8">
                <SparklesIcon className="w-16 h-16 text-brand-accent mx-auto mb-4"/>
                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                <p className="text-brand-text-secondary mb-6">{message}</p>

                <div className="space-y-3">
                    {sessionType === 'focus' ? (
                        <button onClick={onStartBreak} className="w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors">
                            Start 5-min Break
                        </button>
                    ) : (
                         <button onClick={onStartNewSession} className="w-full px-4 py-3 bg-brand-accent text-white font-semibold rounded-md hover:bg-red-500 transition-colors">
                            Start New Focus Session
                        </button>
                    )}
                    <button onClick={onEndFocus} className="w-full px-4 py-2 bg-brand-primary text-brand-text-secondary font-semibold rounded-md hover:bg-brand-secondary transition-colors">
                        End Focus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FocusCompleteModal;
