import type React from "react"
// Common types used across the application

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    pageCount: number
  }
}

export interface SortOption {
  label: string
  value: string
  direction: "asc" | "desc"
}

export interface FilterOption {
  id: string
  label: string
  value: string | number | boolean
}

export type SortDirection = "asc" | "desc"

export interface TableColumn<T> {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (row: T) => React.ReactNode
  enableSorting?: boolean
}

export interface SelectOption {
  label: string
  value: string
}

export interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
  external?: boolean
  label?: string
}

export interface FooterLink {
  title: string
  href: string
  external?: boolean
}

export interface FooterGroup {
  title: string
  links: FooterLink[]
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export interface DashboardConfig {
  mainNav: NavItem[]
  sidebarNav: NavItem[]
}

