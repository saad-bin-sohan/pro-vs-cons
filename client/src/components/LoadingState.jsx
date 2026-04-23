import { LoaderCircle } from 'lucide-react';
import { cn } from '../lib/ui';

const LoadingState = ({ label = 'Loading...', className = '' }) => {
  return (
    <div className={cn('flex min-h-[240px] items-center justify-center', className)}>
      <div className="flex items-center gap-2.5">
        <LoaderCircle
          className="h-4 w-4 animate-spin flex-shrink-0"
          style={{ color: '#C05621' }}
        />
        <span className="text-sm" style={{ color: '#A8A39D' }}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default LoadingState;
