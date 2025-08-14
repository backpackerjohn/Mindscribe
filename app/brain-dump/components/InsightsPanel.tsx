
import React from 'react';
import type { AIInsight } from '../../../types';
import { BrainCircuitIcon } from '../../../components/icons';

interface InsightsPanelProps {
  insights: AIInsight[];
  isLoading: boolean;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights, isLoading }) => {
  if (!isLoading && insights.length === 0) {
    return null; // Don't show the panel if there's nothing to show
  }

  return (
    <div className="bg-brand-primary/30 border border-brand-primary rounded-lg p-4 space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        <BrainCircuitIcon className="h-6 w-6 text-brand-accent" />
        <h3 className="text-lg font-semibold text-brand-text-primary">AI Insights</h3>
      </div>
      {isLoading && (
        <div className="text-sm text-brand-text-secondary animate-subtle-pulse">Generating insights...</div>
      )}
      {!isLoading && insights.length > 0 && (
         <ul className="space-y-2">
            {insights.map(insight => (
                <li key={insight.id} className="text-sm text-brand-text-secondary list-disc list-inside ml-2">
                    {insight.content}
                </li>
            ))}
         </ul>
      )}
    </div>
  );
};

export default InsightsPanel;
