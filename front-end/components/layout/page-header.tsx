import type React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function PageHeader({ heading, text, children, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 space-y-4", className)} {...props}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h1>
      {text && <p className="text-muted-foreground">{text}</p>}
      {children}
    </div>
  )
}

