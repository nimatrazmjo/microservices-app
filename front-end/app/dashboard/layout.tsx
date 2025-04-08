import type React from "react"
import type { Metadata } from "next"
import { DashboardNav } from "@/components/navigation/dashboard-nav"
import { UserNav } from "@/components/navigation/user-nav"
import { dashboardConfig } from "@/config/site"
import { ProfileProvider } from '@/context/user-context'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProfileProvider>
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        <div className="grid flex-1 md:grid-cols-[220px_1fr]">
          <aside className="hidden border-r md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex-1 overflow-auto py-2">
                <DashboardNav items={dashboardConfig.sidebarNav} />
              </div>
            </div>
          </aside>
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto p-6">{children}</div>
          </main>
        </div>
      </div>
    </ProfileProvider>
  )
}

