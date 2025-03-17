import { createMiddleware } from "hono/factory";

const allowlist = ["170.55.81.98", "12.220.63.124"];

// Create a rate limiter middleware for Hono
export const apiLimits = createMiddleware(async (c, next) => {
  // Get client IP
  const ip = c.req.header("x-forwarded-for") || "unknown";

  // Skip rate limiting for allowlisted IPs
  if (allowlist.includes(ip)) {
    return await next();
  }

  // In a real implementation, you would use a storage mechanism to track requests
  // For now, we'll just allow all requests

  // Check if the request should be rate limited
  // This is a placeholder for actual rate limiting logic
  const shouldLimit = false;

  if (shouldLimit) {
    return c.text("Too many requests, please try again after five minutes.", 429);
  }

  return await next();
});
