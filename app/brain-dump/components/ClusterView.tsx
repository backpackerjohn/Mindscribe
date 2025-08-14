
import React from 'react';
import type { AIThoughtGroup } from '../../../types';
import ThoughtCluster from './ThoughtCluster';
import { LayoutGridIcon } from '../../../components/icons';

interface ClusterViewProps {
  clusters: AIThoughtGroup[];
  isLoading: boolean;
}

const ClusterView: React.FC<ClusterViewProps> = ({ clusters, isLoading }) => {
  if (isLoading) {
    return <div className="text-center text-brand-text-secondary p-8">Organizing your thoughts into clusters...</div>;
  }

  if (clusters.length === 0) {
    return (
      <div className="text-center text-brand-text-secondary p-8 rounded-lg bg-brand-surface border-2 border-dashed border-brand-primary">
        <LayoutGridIcon className="h-12 w-12 mx-auto mb-4 text-brand-secondary" />
        <h3 className="text-lg font-semibold text-brand-text-primary">No Clusters Here Yet</h3>
        <p className="mt-1">Click "Organize with AI" to group your thoughts into clusters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {clusters.map((cluster) => (
        <ThoughtCluster key={cluster.id} cluster={cluster} />
      ))}
    </div>
  );
};

export default ClusterView;
