"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { uploadProfilePicture, type UserProfile } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Camera, Loader2, Upload } from "lucide-react"
import { useProfile } from '@/context/user-context'

interface ProfilePictureUploadProps {
  profile: UserProfile
}

export function ProfilePictureUpload({ profile }: ProfilePictureUploadProps) {
  const { refreshProfile } = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview the selected image
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle form submission
  async function handleSubmit(formData: FormData) {
    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadProfilePicture(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Refresh the profile data in context
        await refreshProfile()
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsUploading(false)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Upload or update your profile picture</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {error && (
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-muted">
          {previewUrl ? (
            <Image src={previewUrl || "/placeholder.svg"} alt="Profile preview" fill className="object-cover" />
          ) : profile.profile_picture ? (
            <Image
              src={profile.profile_picture || "/placeholder.svg"}
              alt={`${profile.first_name} ${profile.last_name}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <form action={handleSubmit} className="w-full">
          <div className="flex flex-col space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              id="profile_picture"
              name="profile_picture"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />

            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </Button>

            {previewUrl && (
              <Button type="submit" disabled={isUploading} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Image"
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
