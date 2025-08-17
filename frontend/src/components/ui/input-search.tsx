import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';

interface InputSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
export const InputSearch = ({ className, ...props }: InputSearchProps) => {
  return (
    <div className="relative flex items-center gap-2">
      <input
        type="search"
        data-slot="input"
        className={cn(
          'relative file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pl-12 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        {...props}
      />
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
    </div>
  );
};
