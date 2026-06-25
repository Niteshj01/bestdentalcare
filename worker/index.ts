// Cloudflare Worker backend for Dr. Sky Dentistry
// Utilizes standard Web Crypto APIs, Cloudflare D1 Database, and Cloudflare R2 Storage.

// Change this value to your actual custom R2 custom domain or R2 public URL
const R2_PUBLIC_URL = "PLACEHOLDER_REPLACE_WITH_REAL_URL";

export interface Env {
  DB: any; // D1Database
  BUCKET: any; // R2Bucket
  JWT_SECRET: string;
}

// SHA-256 helper
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- JWT HELPER IMPLEMENTATION ---
function base64urlEncode(str: string): string {
  const binary = new TextEncoder().encode(str);
  let binString = "";
  for (let i = 0; i < binary.length; i++) {
    binString += String.fromCharCode(binary[i]);
  }
  return btoa(binString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binString = atob(base64);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function signJwt(payload: any, secret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(dataToSign)
  );

  const signatureArray = Array.from(new Uint8Array(signature));
  const binString = signatureArray.map(b => String.fromCharCode(b)).join("");
  const encodedSignature = btoa(binString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${dataToSign}.${encodedSignature}`;
}

async function verifyJwt(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    const dataToVerify = `${encodedHeader}.${encodedPayload}`;
    const encoder = new TextEncoder();
    
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    let sigBase64 = encodedSignature.replace(/-/g, "+").replace(/_/g, "/");
    while (sigBase64.length % 4) sigBase64 += "=";
    const sigBinString = atob(sigBase64);
    const sigBytes = new Uint8Array(sigBinString.length);
    for (let i = 0; i < sigBinString.length; i++) {
      sigBytes[i] = sigBinString.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(dataToVerify)
    );

    if (!isValid) return null;

    const payload = JSON.parse(base64urlDecode(encodedPayload));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

// CORS Headers Helper
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

// JSON Response helper
function makeResponse(body: any, status = 200, headers: Record<string, string> = {}) {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
      ...headers
    }
  });
}

// Helper to authenticate requests
async function authenticate(request: Request, env: Env): Promise<any | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  return await verifyJwt(token, env.JWT_SECRET || "fallback_local_secret");
}

// Route parameters matching helper
function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS OPTIONS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // ----------------------------------------------------
      // AUTH ROUTES
      // ----------------------------------------------------

      // POST /api/auth/login
      if (method === "POST" && path === "/api/auth/login") {
        const { password } = await request.json() as { password?: string };
        if (!password) {
          return makeResponse({ error: "Password is required" }, 400);
        }
        
        const hash = await sha256(password);
        
        // Fetch current password hash from D1
        const adminSetting = await env.DB.prepare(
          "SELECT password_hash FROM admin_settings WHERE id = 1"
        ).first() as { password_hash: string } | null;

        const correctHash = adminSetting?.password_hash || "0192023a7bbd73250516f069df18b500a16b61a4d30a3be4ff622bafcfd824b1";

        if (hash === correctHash) {
          // Generate JWT Token valid for 24 hours
          const payload = {
            sub: "admin",
            exp: Math.floor(Date.now() / 1000) + (24 * 3600)
          };
          const token = await signJwt(payload, env.JWT_SECRET || "fallback_local_secret");
          return makeResponse({ token });
        } else {
          return makeResponse({ error: "Invalid password" }, 401);
        }
      }

      // POST /api/auth/change-password
      if (method === "POST" && path === "/api/auth/change-password") {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const { currentPassword, newPassword } = await request.json() as { currentPassword?: string; newPassword?: string };
        if (!currentPassword || !newPassword) {
          return makeResponse({ error: "All password fields are required" }, 400);
        }

        const currentHash = await sha256(currentPassword);
        const adminSetting = await env.DB.prepare(
          "SELECT password_hash FROM admin_settings WHERE id = 1"
        ).first() as { password_hash: string } | null;

        const correctHash = adminSetting?.password_hash || "0192023a7bbd73250516f069df18b500a16b61a4d30a3be4ff622bafcfd824b1";

        if (currentHash !== correctHash) {
          return makeResponse({ error: "Current password is incorrect" }, 400);
        }

        const newHash = await sha256(newPassword);
        await env.DB.prepare(
          "INSERT OR REPLACE INTO admin_settings (id, password_hash) VALUES (1, ?)"
        ).bind(newHash).run();

        return makeResponse({ success: true, message: "Password updated successfully" });
      }

      // ----------------------------------------------------
      // APPOINTMENTS ROUTES
      // ----------------------------------------------------

      // POST /api/appointments (Public booking)
      if (method === "POST" && path === "/api/appointments") {
        const { name, phone, service, date } = await request.json() as {
          name?: string;
          phone?: string;
          service?: string;
          date?: string;
        };

        if (!name || !phone || !service || !date) {
          return makeResponse({ error: "Missing required booking details" }, 400);
        }

        const result = await env.DB.prepare(
          "INSERT INTO appointments (name, phone, service, date, status) VALUES (?, ?, ?, ?, 'pending')"
        ).bind(name, phone, service, date).run();

        return makeResponse({ success: true, id: result.meta.last_row_id });
      }

      // GET /api/appointments (Auth protected)
      if (method === "GET" && path === "/api/appointments") {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const { results } = await env.DB.prepare(
          "SELECT id, name, phone, service, date, status, created_at FROM appointments ORDER BY created_at DESC"
        ).all();

        return makeResponse(results);
      }

      // PATCH /api/appointments/:id/status (Auth protected)
      const appointmentStatusMatch = matchRoute("/api/appointments/:id/status", path);
      if (method === "PATCH" && appointmentStatusMatch) {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const id = appointmentStatusMatch.id;
        const { status } = await request.json() as { status?: string };

        if (!status || !["confirmed", "pending", "cancelled"].includes(status)) {
          return makeResponse({ error: "Invalid status value" }, 400);
        }

        await env.DB.prepare(
          "UPDATE appointments SET status = ? WHERE id = ?"
        ).bind(status, id).run();

        return makeResponse({ success: true });
      }

      // ----------------------------------------------------
      // PHOTOS ROUTES
      // ----------------------------------------------------

      // GET /api/photos (Public gallery)
      if (method === "GET" && path === "/api/photos") {
        const { results } = await env.DB.prepare(
          "SELECT id, url, caption, created_at FROM photos ORDER BY id DESC"
        ).all();
        return makeResponse(results);
      }

      // POST /api/photos (Auth protected, multipart upload to R2)
      if (method === "POST" && path === "/api/photos") {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const caption = formData.get("caption") as string || "";

        if (!file) {
          return makeResponse({ error: "No image file provided" }, 400);
        }

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const r2Key = `photos/${timestamp}-${safeName}`;

        // Upload file stream directly to R2 bucket
        await env.BUCKET.put(r2Key, file.stream(), {
          httpMetadata: { contentType: file.type || "image/jpeg" }
        });

        // Resolve clean public URL
        const url = `https://${R2_PUBLIC_URL}/${r2Key}`;

        // Store meta in D1
        const result = await env.DB.prepare(
          "INSERT INTO photos (url, r2_key, caption) VALUES (?, ?, ?)"
        ).bind(url, r2Key, caption).run();

        return makeResponse({
          id: result.meta.last_row_id,
          url,
          caption
        });
      }

      // DELETE /api/photos/:id (Auth protected)
      const photoMatch = matchRoute("/api/photos/:id", path);
      if (method === "DELETE" && photoMatch) {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const id = photoMatch.id;

        // Retrieve R2 Key first to delete from R2 Storage
        const photo = await env.DB.prepare(
          "SELECT r2_key FROM photos WHERE id = ?"
        ).bind(id).first() as { r2_key: string } | null;

        if (photo) {
          try {
            await env.BUCKET.delete(photo.r2_key);
          } catch (r2Err) {
            console.error("Failed to delete from R2 storage:", r2Err);
          }
        }

        await env.DB.prepare("DELETE FROM photos WHERE id = ?").bind(id).run();
        return makeResponse({ success: true });
      }

      // ----------------------------------------------------
      // ARTICLES ROUTES
      // ----------------------------------------------------

      // GET /api/articles (Public journal)
      if (method === "GET" && path === "/api/articles") {
        const { results } = await env.DB.prepare(
          "SELECT id, title, content, cover_image, publish_date FROM articles ORDER BY id DESC"
        ).all();
        return makeResponse(results);
      }

      // POST /api/articles (Auth protected)
      if (method === "POST" && path === "/api/articles") {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const { title, content, cover_image, publish_date } = await request.json() as {
          title?: string;
          content?: string;
          cover_image?: string;
          publish_date?: string;
        };

        if (!title || !content) {
          return makeResponse({ error: "Title and content are required fields" }, 400);
        }

        const dateStr = publish_date || new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        }).toUpperCase();

        const result = await env.DB.prepare(
          "INSERT INTO articles (title, content, cover_image, publish_date) VALUES (?, ?, ?, ?)"
        ).bind(title, content, cover_image || "", dateStr).run();

        return makeResponse({
          id: result.meta.last_row_id,
          title,
          content,
          cover_image,
          publish_date: dateStr
        });
      }

      // DELETE /api/articles/:id (Auth protected)
      const articleMatch = matchRoute("/api/articles/:id", path);
      if (method === "DELETE" && articleMatch) {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const id = articleMatch.id;
        await env.DB.prepare("DELETE FROM articles WHERE id = ?").bind(id).run();
        return makeResponse({ success: true });
      }

      // ----------------------------------------------------
      // VIDEOS ROUTES
      // ----------------------------------------------------

      // GET /api/videos (Public video center)
      if (method === "GET" && path === "/api/videos") {
        const { results } = await env.DB.prepare(
          "SELECT id, youtube_url, title FROM videos ORDER BY id DESC"
        ).all();
        return makeResponse(results);
      }

      // POST /api/videos (Auth protected)
      if (method === "POST" && path === "/api/videos") {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const { youtube_url, title } = await request.json() as {
          youtube_url?: string;
          title?: string;
        };

        if (!youtube_url || !title) {
          return makeResponse({ error: "YouTube URL and title are required" }, 400);
        }

        const result = await env.DB.prepare(
          "INSERT INTO videos (youtube_url, title) VALUES (?, ?)"
        ).bind(youtube_url, title).run();

        return makeResponse({
          id: result.meta.last_row_id,
          youtube_url,
          title
        });
      }

      // DELETE /api/videos/:id (Auth protected)
      const videoMatch = matchRoute("/api/videos/:id", path);
      if (method === "DELETE" && videoMatch) {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const id = videoMatch.id;
        await env.DB.prepare("DELETE FROM videos WHERE id = ?").bind(id).run();
        return makeResponse({ success: true });
      }

      // ----------------------------------------------------
      // SERVICES ROUTES
      // ----------------------------------------------------

      // GET /api/services (Public services query)
      if (method === "GET" && path === "/api/services") {
        const { results } = await env.DB.prepare(
          "SELECT id, name, display_order FROM services ORDER BY display_order ASC"
        ).all();
        return makeResponse(results);
      }

      // POST /api/services (Auth protected)
      if (method === "POST" && path === "/api/services") {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const { name } = await request.json() as { name?: string };
        if (!name) {
          return makeResponse({ error: "Service name is required" }, 400);
        }

        // Determine next display_order
        const maxOrderRow = await env.DB.prepare(
          "SELECT MAX(display_order) as max_order FROM services"
        ).first() as { max_order: number | null } | null;

        const nextOrder = (maxOrderRow?.max_order || 0) + 1;

        const result = await env.DB.prepare(
          "INSERT INTO services (name, display_order) VALUES (?, ?)"
        ).bind(name, nextOrder).run();

        return makeResponse({
          id: result.meta.last_row_id,
          name,
          display_order: nextOrder
        });
      }

      // PATCH /api/services/reorder (Auth protected)
      if (method === "PATCH" && path === "/api/services/reorder") {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const { ids } = await request.json() as { ids?: number[] };
        if (!ids || !Array.isArray(ids)) {
          return makeResponse({ error: "An array of service IDs is required" }, 400);
        }

        const statements = ids.map((id, index) => 
          env.DB.prepare("UPDATE services SET display_order = ? WHERE id = ?").bind(index + 1, id)
        );

        await env.DB.batch(statements);
        return makeResponse({ success: true });
      }

      // DELETE /api/services/:id (Auth protected)
      const serviceMatch = matchRoute("/api/services/:id", path);
      if (method === "DELETE" && serviceMatch) {
        const admin = await authenticate(request, env);
        if (!admin) return makeResponse({ error: "Unauthorized" }, 401);

        const id = serviceMatch.id;
        await env.DB.prepare("DELETE FROM services WHERE id = ?").bind(id).run();
        return makeResponse({ success: true });
      }

      // Catch-all 404 for unhandled API routes
      return makeResponse({ error: `Not Found: ${method} ${path}` }, 404);

    } catch (err: any) {
      console.error(err);
      return makeResponse({ error: err.message || "Internal Server Error" }, 500);
    }
  }
};
