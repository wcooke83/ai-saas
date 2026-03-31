interface AuthorBylineProps {
  name?: string;
  role?: string;
  className?: string;
}

export function AuthorByline({
  name = 'Will Cooke',
  role = 'Founder at VocUI',
  className,
}: AuthorBylineProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`flex items-center gap-3${className ? ` ${className}` : ''}`}>
      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-semibold flex items-center justify-center">
        {initials}
      </div>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Written by{' '}
        <span className="font-medium text-secondary-700 dark:text-secondary-300">{name}</span>
        {' · '}
        {role}
      </p>
    </div>
  );
}
