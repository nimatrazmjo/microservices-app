import type React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    title: string
    href: string
  }[]
  separator?: React.ReactNode
  homeHref?: string
  includeHome?: boolean
}

export function Breadcrumb({
  segments,
  separator = <ChevronRight className="h-4 w-4" />,
  homeHref = "/",
  includeHome = true,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)} {...props}>
      <ol className="flex items-center gap-1.5">
        {includeHome && (
          <li>
            <Link href={homeHref} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}
        {includeHome && segments.length > 0 && <li className="text-muted-foreground">{separator}</li>}
        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center gap-1.5">
            <Link
              href={segment.href}
              className={cn(
                "hover:text-foreground",
                index === segments.length - 1 ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {segment.title}
            </Link>
            {index < segments.length - 1 && <span className="text-muted-foreground">{separator}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

