/**
 * Escape search query string for using with SQL LIKE/ILIKE syntax
 * @param {string} query search query string
 * @returns {string} return escaped search query string
 */
export function escapeSearchQueryString(query: string): string {
  // regex to escape wildcard for SQL LIKE - prefix with a backslash
  const regex = /([\\%_])/g;
  const replacePattern = '\\$1';

  return query.replace(regex, replacePattern);
}
