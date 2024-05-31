import {AsyncLocalStorage} from 'node:async_hooks';

/**
 * Context storage
 */
export default class ContextStorage {
  private static als = new AsyncLocalStorage<Record<string, unknown>>();

  /**
   * Run a function with a new context
   * @param {Function} fn The function to run
   * @returns {*} The result of the function
   */
  static runAndReturn<R = unknown>(fn: () => R): R {
    return this.als.run<R>({}, fn);
  }

  /**
   * Get a value from the context
   * @param {string} key The key to get
   * @returns {*} The value
   */
  static get<R = unknown>(key: string): R | undefined {
    return this.als.getStore()?.[key] as R | undefined;
  }

  /**
   * Set a value in the context
   * @param {string} key The key to set
   * @param {*} value The value to set
   * @returns {void}
   */
  static set<T>(key: string, value: T): void {
    const store = this.als.getStore();
    if (!store) return;
    store[key] = value;
  }
}
