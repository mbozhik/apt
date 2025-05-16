import * as React from 'react'

import {cn} from '@/lib/utils'

export const CELL_STYLES = {
  default: 'min-w-[100px] sm:min-w-[70px] py-3 xl:py-2.5 sm:py-0.5 border border-white',
  active: 'sticky left-0 z-20 bg-gray text-orange',
}

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({className, ...props}, ref) => <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({className, ...props}, ref) => <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({className, ...props}, ref) => <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({className, ...props}, ref) => <tfoot ref={ref} className={cn('border-t bg-white/20 font-medium [&>tr]:last:border-b-0', className)} {...props} />)
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({className, ...props}, ref) => <tr ref={ref} className={cn('border-b transition-colors hover:bg-black data-[state=selected]:bg-orange/20', CELL_STYLES.default, className)} {...props} />)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({className, ...props}, ref) => <th ref={ref} className={cn('h-10 px-2 text-center align-middle font-bold [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', 'bg-orange', CELL_STYLES.default, className)} {...props} />)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({className, ...props}, ref) => <td ref={ref} className={cn('p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', CELL_STYLES.default, className)} {...props} />)
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({className, ...props}, ref) => <caption ref={ref} className={cn('mt-4 text-sm', className)} {...props} />)
TableCaption.displayName = 'TableCaption'

export {Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption}
