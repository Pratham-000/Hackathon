export default function Loader({
  lines = 4,
  card = true,
  className = '',
}) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-app-border bg-app-surface p-5 ${className} ${
        card ? '' : 'border-none bg-transparent p-0'
      }`}
      aria-hidden="true"
    >
      <div className="mb-4 h-5 w-40 rounded-lg bg-app-surface-3" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-4 rounded-lg bg-app-surface-3"
            style={{
              width: index === lines - 1 ? '68%' : '100%',
            }}
          />
        ))}
      </div>
    </div>
  );
}