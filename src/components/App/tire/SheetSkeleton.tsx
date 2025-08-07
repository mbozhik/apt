import Skeleton from '~/UI/Skeleton'

export default function SheetSkeleton() {
  return (
    <section data-section="loading-sheet-tire" className="space-y-4">
      <div className="flex gap-3 items-end justify-between">
        <Skeleton className="h-8 w-20 rounded-md" />

        <div className="flex gap-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-orange/20 rounded-md" />
          ))}
        </div>

        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </section>
  )
}
