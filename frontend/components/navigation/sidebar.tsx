"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string
    href: string
    icon?: React.ReactNode
  }[]
  defaultCollapsed?: boolean
  collapsible?: boolean
}

export function Sidebar({ className, items, defaultCollapsed = false, collapsible = true, ...props }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <div className={cn("relative", className)} {...props}>
      <ScrollArea className="h-full py-6">
        <div className={cn("flex flex-col gap-4", collapsed ? "items-center" : "px-4")}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
              {collapsed && <span className="sr-only">{item.title}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
      {collapsible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-4 h-6 w-6 rounded-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="sr-only">{collapsed ? "Expand" : "Collapse"}</span>
        </Button>
      )}
    </div>
  )
}

