"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfile } from '@/context/user-context'
import { User } from "lucide-react"

export function DashboardWelcome() {
  const { profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {profile?.first_name || "User"}!</CardTitle>
        <CardDescription>You're now signed in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-primary/10 p-3">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">
              {profile ? `${profile.first_name} ${profile.last_name}` : "User"}
            </p>
            <p className="text-sm text-muted-foreground">{profile?.email || ""}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
