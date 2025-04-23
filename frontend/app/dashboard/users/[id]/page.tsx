import { UserForm } from "@/components/users/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
      </div>

      <UserForm userId={params.id} />
    </div>
  )
}
