import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: boolean
  footer?: boolean
}

export function SkeletonCard({ header = true, footer = false, className, ...props }: SkeletonCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      {header && (
        <CardHeader className="gap-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
      )}
      <CardContent className="space-y-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      {footer && (
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      )}
    </Card>
  )
}

