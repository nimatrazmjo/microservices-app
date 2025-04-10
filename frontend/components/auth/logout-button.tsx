"use client"

import { logout } from '@/actions/auth'
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

interface LogoutButtonProps {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
}

export function LogoutButton({ variant = "ghost", size = "sm", className }: LogoutButtonProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    // Using a form with action to properly invoke the server action
    return (
        <form
            action={async () => {
                setIsLoggingOut(true)
                await logout()
            }}
        >
            <Button type="submit" variant={variant} size={size} disabled={isLoggingOut}>
                {isLoggingOut ? (
                    "Signing out..."
                ) : (
                    <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </>
                )}
            </Button>
        </form>
    )
}

