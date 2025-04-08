'use client';
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { getUserProfile } from '@/app/actions/profile'
import { redirect } from 'next/navigation'
import { useProfile } from '@/context/user-context'
import { LoadingPage } from '@/components/feedback/loading-page'
import { ErrorPage } from '@/components/feedback/error-page'
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';

export default function DashboardPage() {

  const { profile, isLoading, error, refreshProfile } = useProfile()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <ErrorPage reset={refreshProfile} title='Failed to load profile'
      description={error} />
  }


  return (
    <div className="container flex flex-col items-center justify-center py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {profile?.first_name || profile?.last_name || "User"}!</CardTitle>
              <CardDescription>You're now signed in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{profile?.first_name}</p>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                This is your personal dashboard. You can manage your account settings and view your profile information
                here.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

