"use client"
import { SecuritySkeleton } from "@/components/skeletons/security-skeleton"
import { ErrorPage } from "@/components/feedback/error-page"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useProfile } from '@/context/user-context'

export default function SecurityPage() {
  const { isLoading, error, refreshProfile } = useProfile()

  if (isLoading) {
    return <SecuritySkeleton />
  }

  if (error) {
    return <ErrorPage title="Failed to load security settings" description={error} reset={refreshProfile} />
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Security</h1>

        <div className="space-y-8">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Update Password</Button>
            </CardFooter>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when signing in to your account
                  </p>
                </div>
                <Switch id="2fa" />
              </div>
              <Button variant="outline">Set Up Two-Factor Authentication</Button>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage your active sessions across devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-muted-foreground">Windows • Chrome • New York, USA</p>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Current
                </Button>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <p className="font-medium">Mobile Session</p>
                  <p className="text-sm text-muted-foreground">iOS • Safari • Boston, USA</p>
                  <p className="text-xs text-muted-foreground">Active 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
