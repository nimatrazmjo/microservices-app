import type React from "react"
import { cn } from "@/lib/utils"

interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: string
  error?: string
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
}

export function FormRow({ label, description, error, htmlFor, required, children, className, ...props }: FormRowProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="space-y-1">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

