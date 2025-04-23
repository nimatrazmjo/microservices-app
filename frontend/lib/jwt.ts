/**
 * Utility functions for working with JWT tokens
 */

/**
 * Decodes a JWT token and returns its payload
 * @param token The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export function decodeJwtToken(token: string): any {
  try {
    // JWT tokens are made of three parts: header.payload.signature
    // Split the token and get the payload (second part)
    const base64Payload = token.split(".")[1];

    // Replace characters that are not valid in standard base64
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");

    // Decode the base64 string
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");

    // Parse the JSON string into an object
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

/**
 * Verifies if a token is expired
 * @param payload The decoded JWT payload
 * @returns True if token is expired, false otherwise
 */
export function isTokenExpired(payload: any): boolean {
  if (!payload || !payload.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  return Date.now() >= expirationTime;
}
