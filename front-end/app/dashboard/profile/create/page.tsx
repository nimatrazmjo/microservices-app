"use client"
import { CreateProfileForm } from "@/components/profile/create-profile-form"
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"
import { useProfile } from "@/contexts/profile-context"
import { ErrorPage } from "@/components/feedback/error-page"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CreateProfilePage() {
  const { profile, isLoading, error, refreshProfile } = useProfile()
  const router = useRouter()

  // If profile already exists, redirect to profile page
  useEffect(() => {
    if (profile) {
      router.push("/dashboard/profile")
    }
  }, [profile, router])

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (error && error !== "Profile not found") {
    return <ErrorPage title="Failed to check profile status" description={error} reset={refreshProfile} />
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Complete Your Profile</h1>
        <p className="mb-8 text-muted-foreground">
          Please provide your profile information to complete your account setup.
        </p>

        <CreateProfileForm />
      </div>
    </div>
  )
}
