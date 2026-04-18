interface RateLimitCache {
  count: number;
  resetAt: number;
}

const rateLimiters: Record<string, Map<string, RateLimitCache>> = {};

export function checkRateLimit(
  req: Request | { headers?: any }, 
  action: string, // e.g. "signup" or "login"
  maxLimit: number, 
  windowMs: number
) {
  let ip = "127.0.0.1"; // fallback

  if (req instanceof Request) {
    ip = req.headers.get("x-forwarded-for") ?? 
         req.headers.get("x-real-ip") ?? 
         "127.0.0.1";
  } else if (req.headers) {
    // Handling NextAuth 'req' object
    ip = req.headers["x-forwarded-for"] ?? req.headers["x-real-ip"] ?? "127.0.0.1";
  }

  // Provide isolated maps per action type
  if (!rateLimiters[action]) {
    rateLimiters[action] = new Map();
  }
  const store = rateLimiters[action];

  const now = Date.now();
  const currentStatus = store.get(ip);

  if (currentStatus) {
    if (now > currentStatus.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return { success: true };
    }
    if (currentStatus.count >= maxLimit) {
      return { success: false, retryAfter: Math.ceil((currentStatus.resetAt - now) / 1000) };
    }
    currentStatus.count += 1;
    return { success: true };
  } else {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }
}
