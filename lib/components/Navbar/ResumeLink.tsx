type Props = {
  href: string;
  className?: string;
};

export function ResumeLink({ href, className }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      Resume
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </a>
  );
}
