type RateLimitOptions = {
  key: string;
  windowMs: number;
  maxRequests: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function applyRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();

  pruneExpiredBuckets(now);

  const existingBucket = buckets.get(options.key);
  if (!existingBucket || existingBucket.resetAt <= now) {
    const resetAt = now + options.windowMs;
    buckets.set(options.key, { count: 1, resetAt });

    return {
      allowed: true,
      limit: options.maxRequests,
      remaining: Math.max(options.maxRequests - 1, 0),
      resetSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  existingBucket.count += 1;

  return {
    allowed: existingBucket.count <= options.maxRequests,
    limit: options.maxRequests,
    remaining: Math.max(options.maxRequests - existingBucket.count, 0),
    resetSeconds: Math.max(
      Math.ceil((existingBucket.resetAt - now) / 1000),
      0,
    ),
  };
}

export function getClientAddressFromHeaders(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return headers.get("x-real-ip") ?? "unknown";
}
