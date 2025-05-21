export default class HashSet<T> implements Iterable<T> {
  private map = new Map<string, T>();

  // Add an item to the HashSet based on its serialized form.
  add(value: T): void {
    const key = JSON.stringify(value);
    this.map.set(key, value);
  }

  // Check if the HashSet contains an item based on its serialized form.
  has(value: T): boolean {
    const key = JSON.stringify(value);
    return this.map.has(key);
  }

  // Remove an item from the HashSet based on its serialized form.
  remove(value: T): boolean {
    const key = JSON.stringify(value);
    return this.map.delete(key);
  }

  // Get the size of the HashSet.
  get length(): number {
    return this.map.size;
  }

  // Clear all items from the HashSet.
  clear(): void {
    this.map.clear();
  }

  // Implement the iterable interface to allow 'for...of' and other iterators
  [Symbol.iterator](): Iterator<T> {
    return this.map.values();
  }

  // Method to return all values as an array
  toArray(): T[] {
    return Array.from(this.map.values());
  }

  // Generate a unique hash for the HashSet based on its contents
  getHash(): string {
    // Get all the keys (the serialized form of the objects)
    const keys = Array.from(this.map.keys());
    // Sort the keys to ensure consistent order
    keys.sort();
    // Create a hash string by joining the keys
    const hashString = keys.join("|");
    // Optionally, you can use a simple hash function like below or a more complex one
    return this.simpleHash(hashString);
  }

  // Simple hash function to generate a hash from a string
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i); // bitwise operations to create hash
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16); // Convert to hex
  }
}
