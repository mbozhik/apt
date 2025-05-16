import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {getTires} from '@/sanity/lib/requests'

const cache = new Map<string, string>()

async function getTokenToSlugMapping() {
  if (cache.size) return cache

  const tires = await getTires().catch(() => [])
  tires.forEach(({token, slug}) => {
    if (token?.current && slug?.current) {
      cache.set(token.current, slug.current)
    }
  })

  return cache
}

export async function middleware(request: NextRequest) {
  const token = request.nextUrl.pathname.split('/').pop()

  if (token && token.length <= 4) {
    const slug = (await getTokenToSlugMapping()).get(token)
    if (slug) {
      return NextResponse.redirect(new URL(`/tire/${slug}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/tire/:path*',
}
