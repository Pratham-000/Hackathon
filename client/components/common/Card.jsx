import clsx from 'clsx';

export default function Card({ children, className, padded = true }) {
  return (
    <section
      className={clsx(
        'rounded-2xl border border-app-border bg-app-surface card-shadow',
        padded && 'p-5 md:p-6',
        className
      )}
    >
      {children}
    </section>
  );
}