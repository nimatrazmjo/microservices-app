"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface NavItem {
  title: string
  href: string
  disabled?: boolean
}

interface NavbarProps {
  items?: NavItem[]
  children?: React.ReactNode
  rightElements?: React.ReactNode
  logo?: React.ReactNode
}

export function Navbar({ items, children, rightElements, logo }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-4">
          {logo || (
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">Your App</span>
            </Link>
          )}
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-4 lg:space-x-6">
            {items?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  item.disabled && "cursor-not-allowed opacity-80",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}
            {children}
          </div>
          {rightElements && <div className="flex items-center space-x-2">{rightElements}</div>}
        </nav>

        {/* Mobile menu button */}
        <div className="flex flex-1 justify-end md:hidden">
          <Button variant="ghost" className="mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
          {rightElements && <div className="flex items-center">{rightElements}</div>}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {items?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block py-2 text-base font-medium",
                  pathname === item.href ? "text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            {children}
          </div>
        </div>
      )}
    </header>
  )
}

