
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { SparklesIcon } from '../icons';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <SparklesIcon className="h-10 w-10 text-brand-accent"/>
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-text-primary tracking-tight">
              MindScribe
            </h1>
          </div>
          <p className="text-brand-text-secondary mt-2">
            Welcome! Log in or sign up to continue.
          </p>
        </header>
        
        <div className="w-full max-w-md bg-brand-surface p-8 rounded-lg shadow-2xl border border-brand-primary">
            <h2 className="text-2xl font-bold text-center text-brand-text-primary mb-6">
                {isLoginView ? 'Log In' : 'Create Account'}
            </h2>
            {isLoginView ? <LoginForm /> : <SignupForm />}
            
            <div className="mt-6 text-center">
                <button 
                    onClick={() => setIsLoginView(!isLoginView)}
                    className="text-sm text-brand-secondary hover:text-brand-accent transition-colors"
                >
                    {isLoginView ? 'Need an account? Sign up' : 'Already have an account? Log in'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default AuthPage;
