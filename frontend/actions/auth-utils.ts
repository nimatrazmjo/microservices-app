import { cookies } from "next/headers";
import { decodeJwtToken, isTokenExpired } from "@/lib/jwt";

/**
 * Gets the current user's ID from the JWT token
 * @returns The user ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return null;
    }

    const payload = decodeJwtToken(authToken.value);

    if (!payload || isTokenExpired(payload)) {
      return null;
    }
    // Depending on your JWT structure, the user ID might be in sub, id, userId, etc.
    return payload.sub || payload.id || payload.userId || null;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}

/**
 * Gets the full JWT payload
 * @returns The decoded JWT payload or null
 */
export async function getTokenPayload(): Promise<any | null> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return null;
    }

    const payload = decodeJwtToken(authToken.value);

    if (!payload || isTokenExpired(payload)) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Error getting token payload:", error);
    return null;
  }
}
