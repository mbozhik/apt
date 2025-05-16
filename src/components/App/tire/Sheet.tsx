'use client'

import {useState, useEffect} from 'react'
import axios from 'axios'

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '~/UI/Table'
import Skeleton from '~/UI/Skeleton'
import {P} from '~/UI/Typography'

type ApiResponse = {
  [key: string]: SheetData
}

type SheetData = {
  identifiedColumnsInfo: {
    columnIndex: number
    headerValues: string[]
  }[]
  data: {
    [key: string]: string | number
  }[]
}

const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || ''

export default function Sheet({token}: {token: string}) {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Token is required')
      setLoading(false)
      return
    }

    axios
      .get<ApiResponse>(SHEET_URL)
      .then(({data}) => setData(data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to fetch data'))
      .finally(() => setLoading(false))
  }, [token])

  const renderCellValue = (value: string | number) => {
    if (value === 'x') {
      return <span className="text-center block">x</span>
    }
    return value
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
        <P className="text-center">{JSON.stringify(error)}</P>
      </section>
    )
  }

  if (!data || !data[token] || !data[token].identifiedColumnsInfo || !data[token].data) {
    return (
      <section data-section="null-sheet-tire" className="p-4 space-y-1.5 bg-orange text-white rounded-lg">
        <P className="text-center">Нет данных для токена: {token}</P>
      </section>
    )
  }

  // Extract column information
  const columnInfo = data[token].identifiedColumnsInfo
  const tireData = data[token].data

  return (
    <section data-section="sheet-tire" className="overflow-x-auto">
      <Table>
        <TableCaption>Tire specifications and load capacity details.</TableCaption>
        <TableHeader>
          {/* First header row */}
          <TableRow>
            {columnInfo.map((col, index) => {
              // Skip empty header cells
              if (!col.headerValues[0] && index > 0) return null

              // Calculate colspan based on consecutive empty headers
              let colspan = 1
              if (index < columnInfo.length - 1) {
                let nextIndex = index + 1
                while (nextIndex < columnInfo.length && !columnInfo[nextIndex].headerValues[0]) {
                  colspan++
                  nextIndex++
                }
              }

              return (
                <TableHead key={`header1-${index}`} colSpan={colspan}>
                  {col.headerValues[0]}
                </TableHead>
              )
            })}
          </TableRow>

          {/* Second header row */}
          <TableRow>
            {columnInfo.map((col, index) => (
              <TableHead key={`header2-${index}`}>{col.headerValues[1]}</TableHead>
            ))}
          </TableRow>

          {/* Third header row (if needed) */}
          <TableRow>
            {columnInfo.map((col, index) => (
              <TableHead key={`header3-${index}`}>{col.headerValues[2]}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tireData.map((row, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Object.keys(row).map((key, cellIndex) => (
                <TableCell key={`cell-${rowIndex}-${cellIndex}`} className={cellIndex <= 0 ? 'text-orange font-bold' : ''}>
                  {renderCellValue(row[key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
