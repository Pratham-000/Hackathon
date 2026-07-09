import clsx from 'clsx';

export default function Input({
  label,
  error,
  className,
  ...props
}) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-app-text">{label}</span>
      ) : null}
      <input
        className={clsx(
          'h-11 w-full rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none transition focus:border-app-primary focus:ring-2 focus:ring-app-primary/20',
          error && 'border-app-danger focus:border-app-danger focus:ring-app-danger/20',
          className
        )}
        {...props}
      />
      {error ? <p className="text-sm text-app-danger">{error}</p> : null}
    </label>
  );
}