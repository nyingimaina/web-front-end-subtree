export default class Paginator<T> {
  private page: number;
  private pageSize: number;
  private cache: Map<number, T[]>;
  private onPageChanged: (page: number) => void;
  private fetchFunction: (page: number, pageSize: number) => Promise<T[]>;
  private queue: Promise<T[]> = Promise.resolve([]);

  
  constructor(
    args: {
      fetchFunction: (page: number, pageSize: number) => Promise<T[]>;
      onPageChanged: (page: number) => void;
      initialPage?: number;
      initialPageSize?: number;
    } = {
      fetchFunction: async () => {
        throw new Error("fetchFunction is required");
      },
      onPageChanged: () => {
        throw new Error(`onPageChanged must be set`);
      },
    }
  ) {
    const {
      initialPage = 1,
      initialPageSize = 10,
      onPageChanged,
      fetchFunction,
    } = args;
    this.fetchFunction = fetchFunction;
    if (initialPage <= 0 || initialPageSize <= 0) {
      throw new Error("'page' and 'pageSize' must be positive numbers.");
    }
    this.page = initialPage;
    this.pageSize = initialPageSize;
    this.onPageChanged = onPageChanged;
    this.cache = new Map();
  }

  public get paginationState(): {
    page: number;
    cachedPages: Map<number, T[]>;
  } {
    return {
      page: this.page,
      cachedPages: this.cache,
    };
  }

  public get currentPageItems(): T[] {
    if (this.cache.has(this.page)) {
      return this.cache.get(this.page) as T[];
    } else {
      return [];
    }
  }

  async fetchPage(): Promise<T[]> {
    try {
      // Use a closure to return a promise that resolves when the function is complete
      const pageToFetch = this.page;

      // Queue the function call
      this.queue = this.queue.then(async () => {
        // Check if the page is in the cache
        if (this.cache.has(pageToFetch)) {
          return this.cache.get(pageToFetch) as T[]; // Return cached data
        }

        // Fetch the data
        const items = await this.fetchFunction(pageToFetch, this.pageSize);
        this.cache.set(pageToFetch, items); // Cache the result

        if (items.length === 0 && pageToFetch >= 1) {
          console.warn("Reached the end of available pages.");
        }
        return items;
      });

      return this.queue; // Return the queued promise
    } finally {
      this.onPageChanged(this.page);
    }
  }

  goToPage(targetPage: number) {
    if (targetPage <= 0) {
      throw new Error("Invalid page number.");
    }
    if (this.page !== targetPage) {
      this.page = targetPage;
      this.onPageChanged(this.page);
    }
  }

  nextPage() {
    this.page++;
    this.onPageChanged(this.page);
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.onPageChanged(this.page);
    } else {
      throw new Error("Already on the first page.");
    }
  }

  setPageSize(newPageSize: number) {
    if (newPageSize <= 0) {
      throw new Error("'pageSize' must be a positive number.");
    }
    if (newPageSize !== this.pageSize) {
      this.pageSize = newPageSize;
      this.page = 1;
      this.clearCache();
      this.onPageChanged(this.page);
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
