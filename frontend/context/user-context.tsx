"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getUserProfile, type UserProfile } from "@/actions/profile"

// Define the shape of the context
interface ProfileContextType {
    profile: UserProfile | null
    isLoading: boolean
    error: string | null
    refreshProfile: () => Promise<void>
}

// Create the context with a default value
const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    isLoading: true,
    error: null,
    refreshProfile: async () => { },
})

// Provider component that will wrap the dashboard
export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Function to fetch profile data
    const fetchProfile = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const { profile, error } = await getUserProfile()

            if (error) {
                setError(error)
                if (error === "Profile not found") {
                    router.push("/dashboard/profile/create")
                }
            } else if (profile) {
                setProfile(profile)
            }
        } catch (err) {
            setError("Failed to load profile data")
            console.error("Error fetching profile:", err)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch profile on initial load
    useEffect(() => {
        fetchProfile()
    }, [])

    // Function to refresh profile data
    const refreshProfile = async () => {
        await fetchProfile()
    }

    // Value object that will be provided to consumers
    const value = {
        profile,
        isLoading,
        error,
        refreshProfile,
    }

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

// Custom hook to use the profile context
export function useProfile() {
    const context = useContext(ProfileContext)

    if (context === undefined) {
        throw new Error("useProfile must be used within a ProfileProvider")
    }

    return context
}

