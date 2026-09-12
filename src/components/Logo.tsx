interface LogoProps {
  className?: string;
  withWordmark?: boolean;
  tone?: "dark" | "light";
}

// Placeholder mark: a rising, stepped path with a node at each stage and an
// amber node at the top, standing in for the club's idea-to-company
// journey. Built to be swapped for a designed logo later without touching
// any layout that uses this component.
export default function Logo({
  className,
  withWordmark = true,
  tone = "dark"
}: LogoProps) {
  const primary = tone === "dark" ? "#12213A" : "#F6F7F5";
  const wordmarkColor = tone === "dark" ? "text-ink-900" : "text-paper";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M7 35L18 26L28 30L41 11"
          stroke={primary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="35" r="3.2" fill={primary} />
        <circle cx="18" cy="26" r="3.2" fill={primary} />
        <circle cx="28" cy="30" r="3.2" fill={primary} />
        <circle cx="41" cy="11" r="4.2" fill="#FFB100" />
      </svg>
      {withWordmark && (
        <span className={`font-display text-lg font-semibold tracking-tight ${wordmarkColor}`}>
          EIC
        </span>
      )}
    </span>
  );
}
