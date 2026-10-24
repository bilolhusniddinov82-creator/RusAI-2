export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-label="RusAI"
    >
      <defs>
        <linearGradient id="rusai-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3ECF5E" />
          <stop offset="100%" stopColor="#22B8F0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#rusai-logo-grad)" />
      {/* Speech bubble — represents the AI conversation at the heart of the product */}
      <path
        d="M8 11.5A4.5 4.5 0 0 1 12.5 7h7A4.5 4.5 0 0 1 24 11.5v4A4.5 4.5 0 0 1 19.5 20h-5.4l-3.8 2.8a.6.6 0 0 1-.96-.48V20h-.8A4.5 4.5 0 0 1 4.06 16"
        fill="none"
        stroke="none"
      />
      <path
        d="M8 11.3A4.3 4.3 0 0 1 12.3 7h7.4A4.3 4.3 0 0 1 24 11.3v3.9a4.3 4.3 0 0 1-4.3 4.3h-5.6l-3.6 2.66a.55.55 0 0 1-.88-.44v-2.22A4.3 4.3 0 0 1 8 15.2v-3.9z"
        fill="white"
        fillOpacity="0.96"
      />
      {/* Sparkle — the "AI" accent */}
      <circle cx="22.5" cy="8.5" r="2.1" fill="white" />
    </svg>
  );
}
