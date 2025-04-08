import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <Skeleton className="h-10 w-1/4 mb-8" />

        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Profile Picture Card Skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-muted">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          {/* Profile Form Skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

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
                <Skeleton className="h-24 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
            <div className="flex justify-end space-x-4 p-6 pt-0">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
