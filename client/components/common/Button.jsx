import clsx from 'clsx';

const variants = {
  primary:
    'bg-app-primary text-white hover:bg-app-primary-strong border border-app-primary',
  secondary:
    'bg-app-surface text-app-text hover:bg-app-surface-2 border border-app-border',
  ghost:
    'bg-transparent text-app-text hover:bg-app-surface-2 border border-transparent',
  danger:
    'bg-app-danger text-white hover:opacity-90 border border-app-danger',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
};

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}