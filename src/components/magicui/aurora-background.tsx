import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
  backgroundClassName?: string;
}

export function AuroraBackground({ children, className, backgroundClassName }: AuroraBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className={cn("absolute inset-0", backgroundClassName ? backgroundClassName : "bg-[#0b0c10]")} />
        <div className="aurora-layer aurora-one" style={{ top: "-35%", left: "-15%" }} />
        <div className="aurora-layer aurora-two" style={{ top: "-10%", right: "-10%" }} />
        <div className="aurora-layer aurora-three" style={{ bottom: "-25%", left: "15%" }} />
      </div>
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
