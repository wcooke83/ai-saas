import { cn } from '@/lib/utils';

interface VocUILogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function VocUILogo({ className, size = 'md' }: VocUILogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes[size], className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vocui-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="6" fill="url(#vocui-grad)" />
      <text
        x="16"
        y="24"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-1"
      >
        V
      </text>
    </svg>
  );
}
