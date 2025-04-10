"use client"


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfile } from '@/context/user-context'

export function DashboardStats() {
  const { profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {profile ? "Your profile is complete" : "Complete your profile to get started"}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <a href="/dashboard/profile">View Profile</a>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Configure your account preferences and security settings</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <a href="/dashboard/settings">View Settings</a>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your security preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Update your password and security settings</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <a href="/dashboard/security">View Security</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
