import { LoaderIcon } from 'lucide-react';
import { cn } from '@/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return <LoaderIcon className={cn('animate-spin', className)} />;
}
