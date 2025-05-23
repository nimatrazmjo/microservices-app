import { UserForm } from "@/components/users/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewUserPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
      </div>

      <UserForm />
    </div>
  )
}
