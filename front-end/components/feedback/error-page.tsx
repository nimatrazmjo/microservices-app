"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorPageProps {
  title?: string
  description?: string
  reset?: () => void
}

export function ErrorPage({
  title = "Something went wrong",
  description = "An error occurred. Please try again later.",
  reset,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
      {reset && (
        <Button onClick={reset} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  )
}

