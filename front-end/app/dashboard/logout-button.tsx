"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "../../actions/auth"

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="outline" size="sm">
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </form>
  )
}
