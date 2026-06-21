/**
 * Utility to dynamically resolve asset URLs.
 * This ensures that regardless of whether the application is running in an iframe,
 * under a sub-path (like GitHub Pages/Cloud Run custom paths), or a default root base path,
 * the images from the public directory are correctly loaded.
 */
export const resolveAsset = (path: string): string => {
  if (!path) return "";
  
  // If it is already a full/external URL or base64 data URI, return it as-is
  if (
    path.startsWith("http://") || 
    path.startsWith("https://") || 
    path.startsWith("data:")
  ) {
    return path;
  }

  // Remove leading slash if any to build cleanly with the base URL
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  // Retrieve Vite's built-in BASE_URL (defaults to "/" in dev but adapts based on bundler config)
  const baseUrl = (import.meta as any).env?.BASE_URL || "/";
  
  // Combine ensuring a single slash in between if necessary
  const finalBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${finalBase}${cleanPath}`;
};
