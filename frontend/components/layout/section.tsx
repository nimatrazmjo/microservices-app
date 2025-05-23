import type React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn("py-12 md:py-16 lg:py-20", className)} {...props}>
      {children}
    </section>
  )
}

