import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * Button with an animated conic-gradient glow border.
 * Uses design tokens (primary / accent / secondary).
 */
const GlowButton = forwardRef<HTMLButtonElement, Props>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-md p-[2px] font-semibold text-foreground",
        "transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Animated gradient ring */}
      <span
        aria-hidden
        className="absolute inset-[-150%] motion-reduce:hidden animate-[glow-rotate_4s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, hsl(var(--accent)), hsl(var(--secondary)), hsl(var(--primary)), hsl(var(--accent)))",
        }}
      />
      {/* Static fallback for reduced motion */}
      <span
        aria-hidden
        className="absolute inset-0 hidden motion-reduce:block"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))",
        }}
      />
      <span className="relative z-10 flex items-center gap-2 rounded-[5px] bg-primary-foreground px-6 py-3 text-sm">
        {children}
      </span>
    </button>
  );
});
GlowButton.displayName = "GlowButton";

export default GlowButton;
