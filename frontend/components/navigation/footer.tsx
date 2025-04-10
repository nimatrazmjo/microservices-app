import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  logo?: React.ReactNode
  copyright?: string
  links?: {
    title: string
    href: string
    external?: boolean
  }[][]
}

export function Footer({ className, logo, copyright, links, ...props }: FooterProps) {
  return (
    <footer className={cn("w-full border-t bg-background", className)} {...props}>
      <div className="container py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            {logo || (
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold">Your App</span>
              </Link>
            )}
            <p className="text-sm text-muted-foreground">
              {copyright || `© ${new Date().getFullYear()} Your Company. All rights reserved.`}
            </p>
          </div>
          {links?.map((group, i) => (
            <div key={i} className="flex flex-col gap-2">
              {group.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

