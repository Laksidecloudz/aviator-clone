export function PropellerIcon({ width = 48, height = 48, className = '' }) {
  return (
    <svg className={`propeller-icon ${className}`} viewBox="0 0 64 64" width={width} height={height}>
      <ellipse cx="32" cy="32" rx="28" ry="8" fill="currentColor" opacity="0.3" transform="rotate(-30 32 32)" />
      <ellipse cx="32" cy="32" rx="28" ry="8" fill="currentColor" opacity="0.3" transform="rotate(30 32 32)" />
      <ellipse cx="32" cy="32" rx="28" ry="8" fill="currentColor" opacity="0.3" />
      <circle cx="32" cy="32" r="6" fill="currentColor" />
    </svg>
  );
}
