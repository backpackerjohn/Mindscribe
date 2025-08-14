import React, { useState, useEffect } from 'react';
import { generateSubtasks } from '../../../lib/ai/task-management/subtask-generator';
import { generateClarifyingQuestions, refineSubtasks } from '../../../lib/ai/task-management/task-refiner';
import { SparklesIcon, PlusIcon } from '../../../components/icons';
import type { ClarifyingQuestion, SubTask, Category } from '../../../types';

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (title: string, subtasks: Pick<SubTask, 'content'>[], categoryId?: string) => Promise<void>;
  categories: Category[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAddTask, categories }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [step, setStep] = useState(1); // 1: title, 2: review, 3: clarify
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<ClarifyingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasRefined, setHasRefined] = useState(false);

  // New state for slide-based questions and "Other" option
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [otherValues, setOtherValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleGenerateBreakdown = async () => {
    if (!title.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const generated = await generateSubtasks(title);
      setSubtasks(generated.map(s => s.content));
      setHasRefined(false);
      setStep(2);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartRefinement = async () => {
    setIsGenerating(true);
    setError(null);
    try {
        const questions = await generateClarifyingQuestions(title);
        if (questions.length === 0) {
            setError("The AI couldn't generate any clarifying questions. Try rephrasing the title or proceed with the current plan.");
            setIsGenerating(false);
            return;
        }
        setClarifyingQuestions(questions.map(q => ({...q, id: crypto.randomUUID()})));
        setAnswers({});
        setOtherValues({});
        setCurrentQuestionIndex(0);
        setStep(3);
    } catch (err) {
        setError("Sorry, the AI couldn't generate clarifying questions right now. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  }

  const handleRefineSubtasks = async () => {
    setIsGenerating(true);
    setError(null);
    try {
        const answersWithQuestions = clarifyingQuestions.reduce((acc, q) => {
            const answer = answers[q.id];
            if (answer === '__OTHER__') {
                acc[q.question] = otherValues[q.id] || "User did not specify.";
            } else if (answer) {
                acc[q.question] = answer;
            }
            return acc;
        }, {} as Record<string, string>);

        const refined = await refineSubtasks(title, answersWithQuestions);
        setSubtasks(refined.map(s => s.content));
        setHasRefined(true);
        setStep(2);
        setCurrentQuestionIndex(0); // Reset for next time
    } catch (err) {
        setError("Sorry, the AI couldn't refine the task right now. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  }
  
  const handleCreateTask = async () => {
    setError(null);
    await onAddTask(title, subtasks.map(s => ({ content: s })), categoryId || undefined);
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({...prev, [questionId]: answer}));
  }

  const handleOtherValueChange = (questionId: string, value: string) => {
    setOtherValues(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < clarifyingQuestions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => i - 1);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 id="add-task-title" className="text-2xl font-bold text-brand-text-primary">Create a New Task</h2>
            {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-md text-sm">{error}</div>}
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-brand-text-secondary mb-1">Task Title</label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Plan weekend trip"
                className="w-full bg-brand-background border border-brand-primary rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && !isGenerating && title.trim() && handleGenerateBreakdown()}
              />
            </div>
             <div>
                <label htmlFor="task-category" className="block text-sm font-medium text-brand-text-secondary mb-1">Category (Optional)</label>
                <select id="task-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-brand-background border border-brand-primary rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent">
                    <option value="">No Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
            <button
              onClick={handleGenerateBreakdown}
              disabled={!title.trim() || isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-md font-semibold disabled:opacity-50 hover:bg-red-500 transition-colors"
            >
              {isGenerating ? 'Breaking it down...' : 'Break Down with AI'}
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 id="add-task-title" className="text-xl font-bold text-brand-text-primary">{hasRefined ? "Refined Plan" : "Suggested Plan"} for "{title}"</h2>
            <p className="text-sm text-brand-text-secondary">Here's the plan. You can create the task now, or {hasRefined ? "go back" : "ask the AI to refine it"} further.</p>
            {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-md text-sm">{error}</div>}
            <ul className="space-y-2 bg-brand-background p-3 rounded-md border border-brand-primary max-h-60 overflow-y-auto">
                {subtasks.map((st, index) => (
                    <li key={index} className="text-brand-text-primary list-disc list-inside">{st}</li>
                ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-2">
                 {!hasRefined && (
                    <button
                        onClick={handleStartRefinement}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-secondary text-white rounded-md font-semibold disabled:opacity-50 hover:bg-blue-500 transition-colors"
                    >
                         {isGenerating ? 'Thinking...' : 'Refine with AI'}
                    </button>
                 )}
                <button
                    onClick={handleCreateTask}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md font-semibold disabled:opacity-50 hover:bg-green-500 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Create Task</span>
                </button>
            </div>
          </div>
        );
        case 3:
            const isLastQuestion = currentQuestionIndex === clarifyingQuestions.length - 1;
            const currentQuestion = clarifyingQuestions[currentQuestionIndex];
            const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
            const isOtherSelected = currentAnswer === '__OTHER__';
            const otherText = currentQuestion ? otherValues[currentQuestion.id] || '' : '';
            const isNextDisabled = !currentAnswer || (isOtherSelected && !otherText.trim());

            return (
                <div className="flex flex-col h-full">
                    <h2 id="add-task-title" className="text-xl font-bold text-brand-text-primary mb-1">Just a few questions...</h2>
                    <p className="text-sm text-brand-text-secondary">To give you a better plan, please answer the following:</p>

                    <div className="flex-grow relative overflow-hidden my-4">
                        {clarifyingQuestions.map((q, index) => (
                            <div
                                key={q.id}
                                className="absolute inset-0 transition-transform duration-300 ease-in-out px-1"
                                style={{ transform: `translateX(${(index - currentQuestionIndex) * 100}%)` }}
                                aria-hidden={index !== currentQuestionIndex}
                            >
                               <fieldset>
                                    <legend className="text-md font-semibold text-brand-text-primary mb-2">{q.question}</legend>
                                    <div className="space-y-2">
                                        {q.options.map(option => (
                                            <label key={option} className="flex items-center gap-2 p-2 rounded-md hover:bg-brand-primary/50 border border-transparent has-[:checked]:border-brand-accent has-[:checked]:bg-brand-primary/30 transition-colors">
                                                <input type="radio" name={q.id} value={option} checked={answers[q.id] === option} onChange={() => handleAnswerChange(q.id, option)} className="w-4 h-4 accent-brand-accent focus:ring-brand-accent"/>
                                                <span className="text-brand-text-primary">{option}</span>
                                            </label>
                                        ))}
                                        <label className="flex items-center gap-2 p-2 rounded-md hover:bg-brand-primary/50 border border-transparent has-[:checked]:border-brand-accent has-[:checked]:bg-brand-primary/30 transition-colors">
                                            <input type="radio" name={q.id} value="__OTHER__" checked={isOtherSelected} onChange={() => handleAnswerChange(q.id, '__OTHER__')} className="w-4 h-4 accent-brand-accent focus:ring-brand-accent"/>
                                            <span className="text-brand-text-primary">Other</span>
                                        </label>
                                        {answers[q.id] === '__OTHER__' && (
                                            <div className="pl-4">
                                                <input
                                                    type="text"
                                                    value={otherValues[q.id] || ''}
                                                    onChange={(e) => handleOtherValueChange(q.id, e.target.value)}
                                                    placeholder="Please specify"
                                                    className="w-full mt-1 bg-brand-background border border-brand-primary rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent"
                                                    autoFocus
                                                />
                                            </div>
                                        )}
                                    </div>
                                </fieldset>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <button 
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0 || isGenerating}
                            className="px-4 py-2 bg-brand-primary text-white rounded-md font-semibold disabled:opacity-50 hover:bg-brand-secondary transition-colors"
                        >
                            Back
                        </button>
                        {isLastQuestion ? (
                            <button
                                onClick={handleRefineSubtasks}
                                disabled={isNextDisabled || isGenerating}
                                className="w-full max-w-[220px] flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-md font-semibold disabled:opacity-50 hover:bg-red-500 transition-colors"
                            >
                                {isGenerating ? 'Generating...' : 'Generate Refined Plan'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNextQuestion}
                                disabled={isNextDisabled || isGenerating}
                                className="px-4 py-2 bg-brand-accent text-white rounded-md font-semibold disabled:opacity-50 hover:bg-red-500 transition-colors"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            )
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-brand-background/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-title"
    >
      <div className="bg-brand-surface border border-brand-primary rounded-lg shadow-2xl w-full max-w-lg relative transition-all duration-300">
        <button onClick={onClose} className="absolute top-3 right-3 text-brand-text-secondary hover:text-white text-2xl leading-none z-10" aria-label="Close modal">&times;</button>
        
        <div className="p-6 min-h-[420px]">
            {isGenerating && step !== 3 && <div className="absolute inset-0 bg-brand-surface/50 flex items-center justify-center z-20"><div className="w-8 h-8 border-4 border-t-transparent border-brand-accent rounded-full animate-spin"></div></div>}
            {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;