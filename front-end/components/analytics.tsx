"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      // You can implement your analytics tracking here
      // Example with Google Analytics:
      // window.gtag('config', 'GA-MEASUREMENT-ID', {
      //   page_path: pathname + searchParams.toString(),
      // })

      console.log(`Page view: ${pathname}${searchParams ? `?${searchParams}` : ""}`)
    }
  }, [pathname, searchParams])

  return null
}

