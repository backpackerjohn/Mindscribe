
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signup(email, password);
    } catch (err) {
      setError((err as Error).message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-md text-sm">{error}</div>}
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-brand-background border border-brand-primary rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-brand-text-secondary mb-1">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-brand-background border border-brand-primary rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent"
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-brand-text-secondary mb-1">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full bg-brand-background border border-brand-primary rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-red-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent focus:ring-offset-brand-surface"
      >
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;
