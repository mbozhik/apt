'use client'

import {ArrowLeft, ArrowRight, RefreshCw} from 'lucide-react'

import {useRef} from 'react'

import {cn} from '@/lib/utils'
import {useSheetData} from '@/hooks/useSheetData'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow, CELL_STYLES} from '~/UI/Table'
import Skeleton from '~/UI/Skeleton'
import {P} from '~/UI/Typography'

export default function Sheet({token}: {token: string}) {
  const containerRef = useRef<HTMLTableElement>(null)

  const {
    data: sheetData,
    loading,
    error,
    refetch,
    isFromCache,
  } = useSheetData(token, {
    enabled: !!token,
    retryCount: 3,
    retryDelay: 1000,
  })

  const renderCellValue = (value: string | number) => {
    if (value === 'x') {
      return <span className="text-center block">x</span>
    }
    return value
  }

  function SheetHeader() {
    if (!columnInfo?.length) return null

    const headerRowsCount = columnInfo[0].headerValues.length

    const getHeaderSpans = (col: (typeof columnInfo)[0], rowIndex: number) => {
      const currentValue = col.headerValues[rowIndex]

      // If empty cell and not first in group, skip
      if (!currentValue && col.columnIndex > 0) {
        const prevCol = columnInfo[col.columnIndex - 1]
        const prevValue = prevCol?.headerValues[rowIndex]
        if (prevValue) return null
      }

      // Calculate rowSpan
      let rowSpan = 1
      if (currentValue) {
        for (let i = rowIndex + 1; i < headerRowsCount; i++) {
          if (!col.headerValues[i]) rowSpan++
          else break
        }
      }

      // Calculate colSpan
      let colSpan = 1
      if (currentValue) {
        let nextIndex = col.columnIndex + 1
        while (nextIndex < columnInfo.length) {
          const nextCol = columnInfo[nextIndex]
          if (nextCol.headerValues[rowIndex]) break

          // Check if this column is part of the same group
          let isPartOfGroup = true
          for (let i = 0; i < rowIndex; i++) {
            if (nextCol.headerValues[i]) {
              isPartOfGroup = false
              break
            }
          }

          if (!isPartOfGroup) break
          colSpan++
          nextIndex++
        }
      }

      return currentValue ? {rowSpan, colSpan} : null
    }

    // Track rendered cells to avoid duplicates
    const renderedCells = new Set<string>()

    return (
      <TableHeader>
        {Array.from({length: headerRowsCount}).map((_, rowIndex) => (
          <TableRow key={`row-${rowIndex}`}>
            {columnInfo.map((col) => {
              const cellId = `${col.columnIndex}-${rowIndex}`

              // Skip if cell was already rendered due to rowSpan
              if (renderedCells.has(cellId)) return null

              const spans = getHeaderSpans(col, rowIndex)
              if (!spans) return null

              // Mark cells that will be covered
              for (let i = 0; i < spans.rowSpan; i++) {
                for (let j = 0; j < spans.colSpan; j++) {
                  renderedCells.add(`${col.columnIndex + j}-${rowIndex + i}`)
                }
              }

              return (
                <TableHead key={cellId} rowSpan={spans.rowSpan} colSpan={spans.colSpan} className={cn(col.columnIndex === 0 && CELL_STYLES.active)}>
                  {col.headerValues[rowIndex]}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
    )
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return

    const scrollAmount = 200
    const currentScroll = containerRef.current.scrollLeft
    const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount

    containerRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    })
  }

  if (loading) {
    return (
      <section data-section="loading-sheet-tire" className="space-y-3">
        <div className="flex justify-between gap-3">
          <Skeleton className="h-10 w-full bg-orange/20" />
          <Skeleton className="h-10 w-full bg-orange/20" />
          <Skeleton className="h-10 w-full bg-orange/20" />
        </div>

        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </section>
    )
  }

  if (error) {
    return (
      <section data-section="error-sheet-tire" className="p-4 space-y-1.5 bg-orange text-white rounded-lg">
        <P className="text-center">{error}</P>
        <div className="flex justify-center">
          <button onClick={() => refetch()} className="flex items-center gap-2 text-white underline hover:opacity-80 transition-opacity">
            <RefreshCw className="size-4" />
            Повторить попытку
          </button>
        </div>
      </section>
    )
  }

  if (!sheetData || !sheetData.identifiedColumnsInfo || !sheetData.data) {
    return (
      <section data-section="null-sheet-tire" className="p-4 space-y-1.5 bg-orange text-white rounded-lg">
        <P className="text-center">Нет данных для токена: {token}</P>
      </section>
    )
  }

  const columnInfo = sheetData.identifiedColumnsInfo
  const tireData = sheetData.data

  return (
    <section data-section="sheet-tire" data-token={token} className={cn('relative w-full', 'space-y-4')}>
      <div data-block="controllers-sheet-tire" className="flex gap-1 sm:gap-4 items-end justify-between">
        <button onClick={() => refetch()} className="flex items-center gap-1 text-orange hover:opacity-80 transition-opacity cursor-pointer" title="Обновить данные">
          <RefreshCw className="size-3" />
          Обновить
        </button>

        <div className="flex gap-1 sm:gap-4">
          <ArrowLeft onClick={() => scroll('left')} className="size-8 hover:text-orange duration-200 cursor-pointer" strokeWidth={1.7} />
          <ArrowRight onClick={() => scroll('right')} className="size-8 hover:text-orange duration-200 cursor-pointer" strokeWidth={1.7} />
        </div>
      </div>

      <div data-block="table-sheet-tire" ref={containerRef} className="relative overflow-x-auto border border-white">
        <Table>
          <SheetHeader />
          <TableBody>
            {tireData.map((row: any, rowIndex: number) => (
              <TableRow key={`row-${rowIndex}`}>
                {Object.keys(row).map((key, cellIndex) => (
                  <TableCell key={`cell-${rowIndex}-${cellIndex}`} className={cn(cellIndex <= 0 && [CELL_STYLES.active, 'font-bold'])}>
                    {renderCellValue(row[key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
