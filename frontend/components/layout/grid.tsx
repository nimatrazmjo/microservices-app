import type React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: "none" | "small" | "medium" | "large"
}

export function Grid({ children, columns = 3, gap = "medium", className, ...props }: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        {
          "grid-cols-1": columns === 1,
          "grid-cols-1 md:grid-cols-2": columns === 2,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": columns === 3,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4": columns === 4,
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5": columns === 5,
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6": columns === 6,
          "gap-0": gap === "none",
          "gap-4": gap === "small",
          "gap-6": gap === "medium",
          "gap-8": gap === "large",
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

