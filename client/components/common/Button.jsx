import clsx from 'clsx';

const variants = {
  primary:
    'border border-app-primary bg-app-primary text-white hover:bg-app-primary-strong hover:border-app-primary-strong',
  secondary:
    'border border-app-border bg-app-surface text-app-text hover:bg-app-surface-2',
  ghost:
    'border border-transparent bg-transparent text-app-text hover:bg-app-surface-2',
  danger:
    'border border-app-danger bg-app-danger text-white hover:opacity-90',
  success:
    'border border-app-success bg-app-success text-white hover:opacity-90',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
  xl: 'h-14 px-6 text-base',
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-primary/25 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}