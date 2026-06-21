import img111 from "../assets/images/111.jpg";
import img112 from "../assets/images/112.jpg";
import img113 from "../assets/images/113.jpg";
import img114 from "../assets/images/114.jpg";
import img115 from "../assets/images/115.jpg";
import img116 from "../assets/images/116.jpg";
import img117 from "../assets/images/117.jpg";
import img118 from "../assets/images/118.jpg";
import img119 from "../assets/images/119.jpg";
import img120 from "../assets/images/120.jpg";
import img121 from "../assets/images/121.jpg";
import img122 from "../assets/images/122.jpg";
import img123 from "../assets/images/123.jpg";
import img19 from "../assets/images/19.jpg";
import img888 from "../assets/images/888.jpg";
import img88899 from "../assets/images/88899.jpg";
import logo from "../assets/images/images/logo.png";

// Direct mapping of file paths to imported Vite assets
const assetMap: Record<string, string> = {
  "111.jpg": img111,
  "/111.jpg": img111,
  "112.jpg": img112,
  "/112.jpg": img112,
  "113.jpg": img113,
  "/113.jpg": img113,
  "114.jpg": img114,
  "/114.jpg": img114,
  "115.jpg": img115,
  "/115.jpg": img115,
  "116.jpg": img116,
  "/116.jpg": img116,
  "117.jpg": img117,
  "/117.jpg": img117,
  "118.jpg": img118,
  "/118.jpg": img118,
  "119.jpg": img119,
  "/119.jpg": img119,
  "120.jpg": img120,
  "/120.jpg": img120,
  "121.jpg": img121,
  "/121.jpg": img121,
  "122.jpg": img122,
  "/122.jpg": img122,
  "123.jpg": img123,
  "/123.jpg": img123,
  "19.jpg": img19,
  "/19.jpg": img19,
  "888.jpg": img888,
  "/888.jpg": img888,
  "88899.jpg": img88899,
  "/88899.jpg": img88899,
  "logo.png": logo,
  "/logo.png": logo,
  "images/logo.png": logo,
  "/images/logo.png": logo,
};

/**
 * Utility to resolve asset URLs.
 * Maps local image paths to imported Vite compiled/hashed assets to guarantee they display perfectly on deployments.
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

  // Check if we have a direct Vite asset bundle import for this file
  const normalizedPath = path.trim();
  if (assetMap[normalizedPath]) {
    return assetMap[normalizedPath];
  }

  // Remove leading slash if any to build cleanly with the base URL for other public assets
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  // Retrieve Vite's built-in BASE_URL (defaults to "/" in dev but adapts based on bundler config)
  const baseUrl = (import.meta as any).env?.BASE_URL || "/";
  
  // Combine ensuring a single slash in between if necessary
  const finalBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${finalBase}${cleanPath}`;
};
