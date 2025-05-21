class CookieUtil {
  // Method to get a cookie value by its name
  static get<T>(name: string): T | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift() || "";

      // Only decode once
      const decodedValue = decodeURIComponent(cookieValue);

      try {
        return JSON.parse(decodedValue) as T; // Parse the decoded value and return
      } catch (e) {
        console.warn(
          `CookieUtil: Failed to parse cookie '${name}' as JSON. Returning raw value.`,
          e
        );
        return decodedValue as unknown as T; // Return the decoded string if parsing fails
      }
    }
    return null; // Return null if the cookie doesn't exist
  }

  // Method to set a cookie with a specified name, value, and options
  static set<T extends string | number | boolean | object>(
    name: string,
    value: T,
    options?: CookieOptions
  ): void {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    let cookieString = `${name}=${encodeURIComponent(stringValue)};`;

    if (options) {
      if (options.expires)
        cookieString += `expires=${options.expires.toUTCString()};`;
      if (options.path) cookieString += `path=${options.path};`;
      if (options.domain) cookieString += `domain=${options.domain};`;
      if (options.secure) cookieString += "secure;";
      if (options.sameSite) cookieString += `SameSite=${options.sameSite};`;
    }

    document.cookie = cookieString; // Set the cookie
  }

  // Method to delete a cookie by its name
  static delete(name: string, options?: CookieOptions): void {
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;

    if (options) {
      if (options.path) cookieString += `path=${options.path};`;
      if (options.domain) cookieString += `domain=${options.domain};`;
      if (options.secure) cookieString += "secure;";
      if (options.sameSite) cookieString += `SameSite=${options.sameSite};`;
    }

    document.cookie = cookieString; // Delete the cookie by setting its expiration date in the past
  }

  // Method to check if a cookie exists by its name
  static has(name: string): boolean {
    return document.cookie.includes(`${name}=`);
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
