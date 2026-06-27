export function PostHogIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="13" width="4" height="8" rx="1" />
      <rect x="9" y="8" width="4" height="13" rx="1" />
      <rect x="16" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

export function LinearIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M1.2 61.5a48.9 48.9 0 0 0 37.3 37.3L1.2 61.5ZM.1 49.3 50.7 99.9c2.2-.1 4.3-.3 6.4-.7L.8 42.9c-.4 2.1-.6 4.2-.7 6.4ZM3 34.4l62.6 62.6c1.9-.7 3.7-1.5 5.4-2.4L5.4 29c-.9 1.7-1.7 3.5-2.4 5.4ZM10 22.4 77.6 90c1.6-1.2 3.1-2.5 4.5-3.9l-72.2-72.2c-1.4 1.4-2.7 2.9-3.9 4.5Z" />
    </svg>
  );
}

export function GitHubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function CheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function SparkIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.5L19 9.3l-5.2 1.8L12 16.6l-1.8-5.5L5 9.3l5.2-1.8L12 2z" />
      <circle cx="18.5" cy="4.5" r="1.5" />
    </svg>
  );
}

export function ArrowUp({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function PlusIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
