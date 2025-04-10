"use client"

import { useState, useEffect } from "react"
import { UserCard } from "./user-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { getProfiles, UserProfile } from '@/actions/profile'
// Mock user data - in a real app, this would come from an API


export function UserList() {
  const [users, setUsers] = useState<UserProfile[]>()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter users based on search term
  useEffect(() => {
    const fetchProfile = async () => {
      const profiles = await getProfiles();
      if (profiles) {
        setUsers(profiles);
      }
    }

    fetchProfile();
  }, [searchTerm])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user) => (
          <UserCard key={user.user_id} user={user} />
        ))}
      </div>

      {users?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium">No users found</p>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  )
}
