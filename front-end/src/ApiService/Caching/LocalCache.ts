import StorageUtil from "@/OnBrowserStorage/StorageUtil";
import CachedDataNames from "./CachedDataNames";

export default class LocalCache {
    
    private static readonly CACHE_PREFIX = "jattac.cache.";

    private static  getCacheKey(key: CachedDataNames) {
      return `${this.CACHE_PREFIX}${key}`;
    }
  

  public static get<T>(key: CachedDataNames): T | null {
    const cacheKey = this.getCacheKey(key);
    return StorageUtil.get<T>(cacheKey);
  }

 

  public static set<T>(key: CachedDataNames, value: T): void {
    const cacheKey = this.getCacheKey(key);
    StorageUtil.set(cacheKey, value);
  }

  public static remove(key: CachedDataNames): void {
    const cacheKey = this.getCacheKey(key);
    StorageUtil.remove(cacheKey);
  }

  public static clear(): void {
    StorageUtil.removeByPrefix(this.CACHE_PREFIX);
  }

  public static has(key: CachedDataNames): boolean {
    const cacheKey = this.getCacheKey(key);
    return StorageUtil.has(cacheKey);
  }


  // TODO: implement mutex and atomicity



}