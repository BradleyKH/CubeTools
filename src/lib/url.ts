const EXTERNAL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

/** Joins `base` and `path` with exactly one slash between them, keeping any trailing slash, query, and hash on `path`. */
export function joinBase(base: string, path: string): string {
  if (EXTERNAL.test(path) || path.startsWith('#')) return path;

  const prefix = base.endsWith('/') ? base : `${base}/`;
  return prefix + path.replace(/^\/+/, '');
}

/** Prefixes a site-relative path with the deployed base path. External URLs and bare `#hash` links pass through. */
export function withBase(path: string): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
