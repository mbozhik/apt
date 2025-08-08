# Bug: 'use cache' directive not working on Vercel production

## Description

The experimental `'use cache'` feature from Next.js 15 works correctly in development but completely fails to cache on Vercel in production.

## Environment

- **Next.js**: 15.4.2-canary.33 (Turbopack)
- **Platform**: Vercel
- **Runtime**: Node.js

### Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
    cacheComponents: true,
  },
}
```

## Implementation

```typescript
async function fetchSheetData(token: string): Promise<{data: SheetDataType | null; error: string | null}> {
  'use cache'

  cacheTag(`sheet-data-${token.toLowerCase()}`)
  cacheLife({
    stale: 604800, // 7 days
    revalidate: 86400, // 1 day
    expire: 1209600, // 14 days
  })

  const response = await fetch(SHEET_URL, {
    method: 'GET',
    headers: {Accept: 'application/json'},
    signal: AbortSignal.timeout(20000),
  })

  // ... error handling and data parsing
}
```

## Behavior

### Development (Local)

✅ **Works perfectly**

- First request: ~12 seconds (real API call)
- Cached requests: 324-749ms (15-40x faster)
- Logs show `Cache` prefix for cached responses

### Production (Vercel)

❌ **No caching at all**

- Every request: 12+ seconds (full API call)
- No `Cache` prefix in logs
- Identical requests to same token not cached

## Steps to Reproduce

1. Deploy Next.js 15 app with `'use cache'` to Vercel
2. Make multiple requests to the same cached function
3. Observe that no caching occurs in production

## Expected Result

Cached requests should be served in <1 second with `Cache` prefix in logs, similar to development behavior.

## Additional Context

- Tried reordering `cacheTag`/`cacheLife` directives
- Converted from axios to native fetch
- Removed console.log from cached functions
- Verified configuration settings

**Priority**: High (affects production UX with 12+ second load times)
