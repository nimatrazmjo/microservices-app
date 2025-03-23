"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Replace with your actual auth service URL
const AUTH_API_URL = process.env.AUTH_API_URL || "http://localhost:4000/api";

export async function login(formData: FormData) {
  const cookieStore = await cookies();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Login failed" };
    }

    // Store the token in a secure HTTP-only cookie
    (await cookies()).set({
      name: "auth-token",
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Store user data in a regular cookie for client access
    (await cookies()).set({
      name: "user-data",
      value: JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      }),
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function register(formData: FormData) {
  const cookieStore = await cookies();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Registration failed" };
    }

    // After successful registration, redirect to login
    redirect("/login?registered=true");
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Replace the logout function with this async version
export async function logout() {
  // Clear auth cookies
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  cookieStore.delete("user-data");

  // Redirect to login page
  redirect("/login");
}

export async function getUserData() {
  const cookieStore = await cookies();
  const userDataCookie = (await cookies()).get("user-data");

  if (!userDataCookie) {
    return null;
  }

  try {
    return JSON.parse(userDataCookie.value);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const token = (await cookies()).get("auth-token");
  return !!token;
}

// Replace the validateSession function with this version
export async function validateSession() {
  const token = (await cookies()).get("auth-token");

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/auth/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      // We need to handle this differently - we can't modify cookies here
      // Instead, redirect to a special route handler that will clear cookies
      logout();
    }

    // Token is valid, continue
    return true;
  } catch (error) {
    console.error("Session validation error:", error);
    logout();
  }
}
