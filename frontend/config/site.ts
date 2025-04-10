export const siteConfig = {
  name: "Your App",
  description: "A modern Next.js application with authentication",
  url: "https://yourapp.com",
  ogImage: "https://yourapp.com/og.jpg",
  links: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/yourusername/yourapp",
  },
  creator: "Your Name",
}

export const dashboardConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Settings",
      href: "/settings",
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "users",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: "profile",
    },
  ],
}

