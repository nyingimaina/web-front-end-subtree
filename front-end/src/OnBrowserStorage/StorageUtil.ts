class StorageUtil {
  // Method to get a value from localStorage by its key
  static get<T>(key: string): T | null {
    const storedValue = localStorage.getItem(key);

    if (storedValue) {
      try {
        return JSON.parse(storedValue) as T; // Parse the stored value and return
      } catch (e) {
        console.warn(
          `StorageUtil: Failed to parse value for key '${key}' as JSON. Returning raw value.`,
          e
        );
        return storedValue as unknown as T; // Return as string if parsing fails
      }
    }
    return null; // Return null if the key doesn't exist
  }

  // Method to set a value in localStorage with a specified key
  static set<T>(key: string, value: T): void {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    localStorage.setItem(key, stringValue); // Set the value in localStorage
  }

  // Method to remove an item from localStorage by its key
  static remove(key: string): void {
    localStorage.removeItem(key); // Remove the item from localStorage
  }

  // Method to check if a key exists in localStorage
  static has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Method to clear all items in localStorage
  static clear(): void {
    localStorage.clear(); // Clear all items in localStorage
  }

  static removeByPrefix(prefix: string): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
  }
}

export default StorageUtil;
