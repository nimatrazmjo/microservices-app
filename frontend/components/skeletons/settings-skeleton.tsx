import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SettingsSkeleton() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <Skeleton className="h-10 w-1/4 mb-8" />

        <div className="space-y-8">
          {/* Account Settings Skeleton */}
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
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end p-6 pt-0">
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>

          {/* Notification Settings Skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              ))}
            </CardContent>
            <div className="flex justify-end p-6 pt-0">
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>

          {/* Security Settings Skeleton */}
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
            </CardContent>
            <div className="flex justify-end p-6 pt-0">
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
