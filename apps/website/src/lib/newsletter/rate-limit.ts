const tracker = new Map<string, { count: number; resetTime: number }>()

/**
 * Basic in-memory rate limiter for serverless route instances.
 * Prevents rapid script execution and abuse.
 * 
 * @param ip Unique identifier (IP address)
 * @param limit Maximum allowed requests in the window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  ip: string, 
  limit: number = 5, 
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const record = tracker.get(ip)

  if (!record) {
    tracker.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  // If time window has passed, reset the counter
  if (now > record.resetTime) {
    tracker.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  // If over the limit, block
  if (record.count >= limit) {
    return false
  }

  record.count += 1
  return true
}
