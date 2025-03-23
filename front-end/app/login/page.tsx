import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAuthenticated } from "../actions/auth"
import LoginForm from "./login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string }
}) {
  // Check if user is already authenticated
  const authenticated = await isAuthenticated()
  if (authenticated) {
    redirect("/dashboard")
  }

  const registered = searchParams.registered === "true"

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
          {registered && (
            <div className="rounded-md bg-green-50 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Registration successful! You can now log in.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/register" className="hover:text-brand underline underline-offset-4">
            Don&apos;t have an account? Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

