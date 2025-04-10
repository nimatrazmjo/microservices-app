import type React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: "default" | "small" | "medium" | "large" | "full"
}

export function Container({ children, className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 md:px-6",
        {
          "max-w-screen-sm": size === "small",
          "max-w-screen-md": size === "medium",
          "max-w-screen-xl": size === "large",
          "max-w-screen-2xl": size === "default",
          "max-w-none": size === "full",
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

