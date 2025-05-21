export default class Paginator<T> {
  private page: number;
  private pageSize: number;
  private totalPages: number = 2;
  private cache: Map<number, T[]>;
  private onPageChanged: (page: number) => void;
  private fetchFunction: (args: {
    page: number;
    pageSize: number;
  }) => Promise<T[]>;
  private queue: Promise<T[]> = Promise.resolve([]);

  constructor(
    args: {
      fetchFunction: (args: { page: number; pageSize: number }) => Promise<T[]>;
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
    pageSize: number;
    cachedPages: Map<number, T[]>;
    totalPages: number;
    isOnLastPage: boolean;
  } {
    return {
      page: this.page,
      cachedPages: this.cache,
      pageSize: this.pageSize,
      totalPages: this.totalPages,
      isOnLastPage: this.page === this.totalPages + 1,
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
    const pageToFetch = this.page;

    this.queue = this.queue.then(async () => {
      const hasCachedPage = this.cache.has(pageToFetch);

      const items = hasCachedPage
        ? (this.cache.get(pageToFetch) as T[])
        : await this.fetchFunction({
            page: pageToFetch,
            pageSize: this.pageSize,
          });
      if (hasCachedPage === false) {
        this.cache.set(pageToFetch, items);
      }

      if (items.length < this.pageSize && pageToFetch >= 1) {
        this.totalPages = pageToFetch - 1;
      } else {
        this.totalPages += 1;
      }

      this.onPageChanged(this.page);
      return items;
    });

    return this.queue;
  }

  async goToPage(targetPage: number) {
    if (targetPage <= 0) {
      throw new Error("Invalid page number.");
    }
    if (this.page !== targetPage) {
      this.page = targetPage;
      await this.fetchPage();
    }
  }

  async nextPage() {
    if (this.page > this.totalPages) {
      await this.goToPage(this.totalPages + 1);
      return false;
    } else if (this.page === this.totalPages) {
      return false;
    }
    this.page++;
    await this.fetchPage();
    return true;
  }

  async previousPage() {
    if (this.page > 1) {
      this.page--;
      await this.fetchPage();
      return true;
    }
    return false;
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
