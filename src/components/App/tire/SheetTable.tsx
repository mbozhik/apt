'use client'

import {ArrowLeft, ArrowRight, RefreshCw} from 'lucide-react'

import type {SheetTable} from '~~/tire/Sheet'

import {cn} from '@/lib/utils'

import {useRef, useState} from 'react'
import axios from 'axios'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow, CELL_STYLES} from '~/UI/Table'
import {P} from '~/UI/Typography'

type Props = {
  token: string
  initialData: SheetTable | null
  initialError: string | null
  cached?: boolean
  stale?: boolean
}

export default function SheetData({token, initialData, initialError, cached, stale}: Props) {
  const containerRef = useRef<HTMLTableElement>(null)
  const [isRefetching, setIsRefetching] = useState(false)
  const [sheetData, setSheetData] = useState(initialData)
  const [error, setError] = useState(initialError)

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

  const handleRefetch = async () => {
    setIsRefetching(true)
    setError(null)

    try {
      const response = await axios.post(`/api/tire/${encodeURIComponent(token)}/refresh`, {
        timeout: 20000,
      })

      setSheetData(response.data.data)
      setError(null)
    } catch (error) {
      console.error('Error refetching data:', error)

      const errorMessage = axios.isAxiosError(error) && error.response?.data?.error ? error.response.data.error : 'Failed to refresh data'

      setError(errorMessage)
    } finally {
      setIsRefetching(false)
    }
  }

  if (error) {
    return (
      <section data-section="error-sheet-tire" className="p-4 space-y-1.5 bg-orange text-white rounded-lg">
        <P className="text-center">{error}</P>

        <div className="flex justify-center">
          <button onClick={handleRefetch} disabled={isRefetching} className="flex items-center gap-2 text-white underline hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
            <RefreshCw className={cn('size-4', isRefetching && 'animate-spin')} />
            {isRefetching ? 'Загрузка...' : 'Повторить попытку'}
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
        <div className="flex flex-col gap-1">
          <button onClick={handleRefetch} disabled={isRefetching} className="flex items-center gap-1 text-orange hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title="Обновить данные">
            <RefreshCw className={cn('size-3', isRefetching && 'animate-spin')} />
            {isRefetching ? 'Обновление...' : 'Обновить'}
          </button>

          {/* {(cached || stale) && <div className="text-xs text-gray-500">{stale ? <span className="text-orange">Данные устарели, обновляются в фоне</span> : cached ? <span>Данные из кэша</span> : null}</div>} */}
        </div>

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
