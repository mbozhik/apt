import {cn} from '@/lib/utils'

export default function Skeleton({className}: {className?: string}) {
  return <div data-block="skeleton" className={cn('animate-pulse rounded-xs bg-white/10', className)} />
}
