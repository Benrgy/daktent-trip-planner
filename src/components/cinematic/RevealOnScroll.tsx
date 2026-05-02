import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  delay?: number; // ms
  className?: string;
  as?: "div" | "section" | "article" | "li";
}

const RevealOnScroll = ({ children, delay = 0, className, as: Tag = "div" }: Props) => {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
    >
      {children}
    </Tag>
  );
};

export default RevealOnScroll;
