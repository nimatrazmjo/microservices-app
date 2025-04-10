"use client"
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"
import { ErrorPage } from "@/components/feedback/error-page"
import { useProfile } from '@/context/user-context'

export default function DashboardPage() {
  const { isLoading, error, refreshProfile } = useProfile()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <ErrorPage title="Failed to load dashboard" description={error} reset={refreshProfile} />
  }

  return (
    <div className="flex flex-col space-y-8">
      <DashboardWelcome />
      <DashboardStats />
    </div>
  )
}
