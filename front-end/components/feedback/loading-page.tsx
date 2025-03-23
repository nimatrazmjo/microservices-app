import { LoadingSpinner } from "@/components/feedback/loading-spinner"

export function LoadingPage() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <h3 className="mt-4 text-lg font-medium">Loading...</h3>
    </div>
  )
}

