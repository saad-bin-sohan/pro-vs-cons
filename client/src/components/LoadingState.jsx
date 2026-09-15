import { LoaderCircle } from 'lucide-react';
import { cn } from '../lib/ui';

const LoadingState = ({ label = 'Loading...', className = '' }) => {
  return (
    <div className={cn('flex min-h-[240px] items-center justify-center', className)}>
      <div className="flex items-center gap-2.5">
        <LoaderCircle className="h-4 w-4 animate-spin flex-shrink-0 text-brand" />
        <span className="text-sm text-ink-muted">{label}</span>
      </div>
    </div>
  );
};

export default LoadingState;
