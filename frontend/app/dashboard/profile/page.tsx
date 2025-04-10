"use client"

import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"
import { ErrorPage } from "@/components/feedback/error-page"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useProfile } from '@/context/user-context'
import { ProfilePictureUpload } from '@/components/profile/profile-picture-upload'
import { ProfileForm } from '@/components/profile/profile-form'

export default function ProfilePage() {
  const { profile, isLoading, error, refreshProfile } = useProfile()
  const router = useRouter()

  // If profile not found, redirect to create profile page
  useEffect(() => {
    if (error === "Profile not found") {
      router.push("/dashboard/profile/create")
    }
  }, [error, router])

  // Show loading state
  if (isLoading) {
    return <ProfileSkeleton />
  }

  // Show error state
  if (error && error !== "Profile not found") {
    return <ErrorPage title="Failed to load profile" description={error} reset={refreshProfile} />
  }

  // If no profile, show error
  if (!profile) {
    return <ErrorPage title="Profile not found" description="Your profile could not be loaded" reset={refreshProfile} />
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Your Profile</h1>

        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <div>
            <ProfilePictureUpload profile={profile} />
          </div>

          <div>
            <ProfileForm profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}
