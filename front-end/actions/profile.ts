"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Profile service URL
const PROFILE_API_URL =
  process.env.PROFILE_API_URL || "http://host.docker.internal:8000/profiles";

// Profile interface based on the provided structure
export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  profile_picture: string;
  user_id: string;
}

/**
 * Get the current user's profile
 * Uses JWT token for authentication and user identification
 */
export async function getUserProfile(): Promise<{
  profile?: UserProfile;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return { error: "Not authenticated" };
    }
    const response = await fetch(`${PROFILE_API_URL}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    console.log(response, "response");
    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Profile not found" };
      }

      if (response.status === 401) {
        // Handle unauthorized - token might be expired
        redirect("/login");
      }

      return { error: "Failed to fetch profile" };
    }

    const profile = await response.json();
    return { profile };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Update the current user's profile
 * JWT token identifies the user
 */
export async function updateProfile(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return { error: "Not authenticated" };
    }

    // Extract profile data from form
    const profileData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      date_of_birth: formData.get("date_of_birth") as string,
    };

    // Validate required fields
    if (
      !profileData.first_name ||
      !profileData.last_name ||
      !profileData.email
    ) {
      return { error: "Name and email are required" };
    }

    const response = await fetch(`${PROFILE_API_URL}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - token might be expired
        redirect("/login");
      }

      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Failed to update profile" };
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/dashboard/profile");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Upload a profile picture
 * JWT token identifies the user
 */
export async function uploadProfilePicture(
  formData: FormData
): Promise<{ success?: boolean; error?: string; url?: string }> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return { error: "Not authenticated" };
    }

    // Get the file from the form data
    const file = formData.get("profile_picture") as File;

    if (!file || file.size === 0) {
      return { error: "No file selected" };
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" };
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "File size must be less than 5MB" };
    }

    // Create a new FormData instance for the file upload
    const uploadFormData = new FormData();
    uploadFormData.append("profile_picture", file);

    const response = await fetch(`${PROFILE_API_URL}/upload-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        // Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - token might be expired
        redirect("/login");
      }

      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Failed to upload profile picture" };
    }

    const data = await response.json();

    // Revalidate the profile page to show updated picture
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      url: data.profile_picture,
    };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Create a new profile for the current user
 * JWT token identifies the user
 */
export async function createProfile(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return { error: "Not authenticated" };
    }

    // Extract profile data from form
    const profileData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      date_of_birth: formData.get("date_of_birth") as string,
    };

    // Validate required fields
    if (
      !profileData.first_name ||
      !profileData.last_name ||
      !profileData.email
    ) {
      return { error: "Name and email are required" };
    }

    const response = await fetch(`${PROFILE_API_URL}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - token might be expired
        redirect("/login");
      }

      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Failed to create profile" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating profile:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Delete the current user's profile
 * JWT token identifies the user
 */
export async function deleteProfile(): Promise<{
  success?: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(`${PROFILE_API_URL}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - token might be expired
        redirect("/login");
      }

      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Failed to delete profile" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting profile:", error);
    return { error: "An unexpected error occurred" };
  }
}
