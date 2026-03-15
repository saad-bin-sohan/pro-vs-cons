import { LoaderCircle } from 'lucide-react';
import { cn, surfaceClass } from '../lib/ui';

const LoadingState = ({ label = 'Loading...', className = '' }) => {
    return (
        <div className={cn('flex min-h-[240px] items-center justify-center', className)}>
            <div className={cn(surfaceClass, 'flex items-center gap-3 px-5 py-4')}>
                <LoaderCircle className="h-4 w-4 animate-spin text-amber-500" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
            </div>
        </div>
    );
};

export default LoadingState;
