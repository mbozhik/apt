import {apiVersion, dataset, projectId} from '@/sanity/env'

import {type NextRequest, NextResponse} from 'next/server'
import {createClient} from 'next-sanity'

const middlewareClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

const cache = new Map<string, string>()

async function getTokenToSlugMapping() {
  if (cache.size) return cache

  try {
    const tires = await middlewareClient.fetch(`
      *[_type == "tire"]{
        "token": token.current,
        "slug": slug.current
      }
    `)

    tires.forEach(({token, slug}: {token: string; slug: string}) => {
      if (token && slug) {
        cache.set(token.toUpperCase(), slug)
      }
    })

    return cache
  } catch (error) {
    console.error('Failed to fetch tire mappings:', error)
    return cache
  }
}

export async function middleware(request: NextRequest) {
  const token = request.nextUrl.pathname.split('/').pop()

  if (token && token.length <= 4) {
    const slug = (await getTokenToSlugMapping()).get(token.toUpperCase())
    if (slug) {
      return NextResponse.redirect(new URL(`/tire/${slug}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/tire/:path*',
}
