import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  items: ReactNode[];
  className?: string;
  speed?: number; // seconds for one full loop
}

/**
 * Infinite horizontal marquee. Pauses on hover. Halves speed on mobile via CSS.
 */
const Marquee = ({ items, className, speed = 40 }: Props) => {
  // Duplicate the list so the loop is seamless.
  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden border-y border-border bg-muted/30 py-3",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className="flex shrink-0 animate-[marquee_var(--marquee-duration)_linear_infinite] items-center gap-10 pr-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ ["--marquee-duration" as string]: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
