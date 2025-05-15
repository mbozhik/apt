import type {TIRE_QUERYResult, TIRE_ITEM_QUERYResult} from '../../../sanity.types'
export type {TIRE_QUERYResult, TIRE_ITEM_QUERYResult}

import {sanityFetch} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'

async function fetchEntity<T>(query: string, draft: boolean = true): Promise<T[]> {
  try {
    const {isEnabled} = await draftMode()

    const response = await sanityFetch({
      query,
      ...(isEnabled && draft
        ? {
            perspective: 'drafts',
            useCdn: false,
            stega: true,
          }
        : undefined),
    })
    return (response.data as T[]) || []
  } catch (error) {
    console.log('Error fetching data:', error)
    return []
  }
}

async function fetchEntityItem<T>(query: string, params?: {slug?: string}, draft: boolean = false): Promise<T | null> {
  try {
    const {isEnabled} = await draftMode()
    const response = await sanityFetch({
      query,
      params,
      ...(isEnabled && draft
        ? {
            perspective: 'previewDrafts',
            useCdn: false,
            stega: true,
          }
        : undefined),
    })
    return (response.data as T) || null
  } catch (error) {
    console.log('Error fetching data:', error)
    return null
  }
}

const TIRE_QUERY = defineQuery(`
    *[_type == "tire"]{
        naming, slug, token, id, image, params, descriptors,
    }`)
const TIRE_ITEM_QUERY = defineQuery(`
    *[_type == "tire" && slug.current == $slug][0]{
        naming, slug, token, id, image, params, descriptors,
    }`)

const QUERIES = {
  TIRE_QUERY,
  TIRE_ITEM_QUERY,
} as const

export const getTires = (): Promise<TIRE_QUERYResult> => fetchEntity(QUERIES.TIRE_QUERY)
export const getTireItem = (slug: string) => fetchEntityItem<TIRE_ITEM_QUERYResult>(QUERIES.TIRE_ITEM_QUERY, {slug})
