import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SecuritySkeleton() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <Skeleton className="h-10 w-1/4 mb-8" />

        <div className="space-y-8">
          {/* Password Change Skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
            <div className="flex justify-end p-6 pt-0">
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>

          {/* Two-Factor Authentication Skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-60" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <Skeleton className="h-10 w-40" />
            </CardContent>
          </Card>

          {/* Session Management Skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
