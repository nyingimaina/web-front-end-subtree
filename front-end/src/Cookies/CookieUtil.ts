// CookieUtil.ts
class CookieUtil {
  // Method to get a cookie value by its name
  static get<T>(name: string): T | null {
    if (!document) {
      return null;
    }
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift() || "";
      try {
        return JSON.parse(decodeURIComponent(cookieValue)) as T; // Parse the cookie value and return
      } catch {
        return cookieValue as unknown as T; // Return as string if parsing fails
      }
    }
    return null; // Return null if the cookie doesn't exist
  }

  // Method to set a cookie with a specified name, value, and options
  static set<T>(name: string, value: T, options?: CookieOptions): void {
    if (!document) {
      throw new Error("Object document not available");
    }
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    let cookieString = `${name}=${encodeURIComponent(stringValue)};`;

    if (options) {
      if (options.expires) {
        cookieString += `expires=${options.expires.toUTCString()};`;
      }
      if (options.path) {
        cookieString += `path=${options.path};`;
      }
      if (options.domain) {
        cookieString += `domain=${options.domain};`;
      }
      if (options.secure) {
        cookieString += "secure;";
      }
      if (options.sameSite) {
        cookieString += `SameSite=${options.sameSite};`;
      }
    }

    document.cookie = cookieString; // Set the cookie
  }

  // Method to delete a cookie by its name
  static delete(name: string, options?: CookieOptions): void {
    if (!document) {
      throw new Error("Object document not available");
    }
    const cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    document.cookie = cookieString; // Delete the cookie by setting its expiration date in the past

    // If options are provided, delete the cookie with the same options
    if (options && options.path) {
      document.cookie = `${name}=; path=${options.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    }
  }
}

// Define options for cookie settings
interface CookieOptions {
  expires?: Date; // Expiration date
  path?: string; // Path for the cookie
  domain?: string; // Domain for the cookie
  secure?: boolean; // Secure flag
  sameSite?: "Lax" | "Strict" | "None"; // SameSite attribute
}

export default CookieUtil;
