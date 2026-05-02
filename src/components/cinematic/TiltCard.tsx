import { ReactNode, useRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  max?: number; // max rotation in degrees
  glare?: boolean;
}

/**
 * Subtly rotates its child based on mouse position.
 * Disabled on touch / coarse pointers and when prefers-reduced-motion is set.
 */
const TiltCard = ({ children, className, max = 6, glare = true }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const isDisabled = () => {
    if (typeof window === "undefined") return true;
    if (window.matchMedia?.("(pointer: coarse)").matches) return true;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
    return false;
  };

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || isDisabled()) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -2 * max;
    const ry = (px - 0.5) * 2 * max;
    node.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
    if (glare) {
      node.style.setProperty("--glare-x", `${px * 100}%`);
      node.style.setProperty("--glare-y", `${py * 100}%`);
    }
  };

  const handleLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: "preserve-3d", transition: "transform 200ms ease-out" }}
      className={cn("relative", className)}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), hsl(var(--primary-foreground) / 0.12), transparent 50%)",
          }}
        />
      )}
    </div>
  );
};

export default TiltCard;
