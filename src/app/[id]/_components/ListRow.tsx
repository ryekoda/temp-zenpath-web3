"use client"
import { CSSProperties, FC, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ListColumnWidth } from '@/lib/tables/columns';



// Width of a column, matching the column header above it (user-resized widths win).
export function ColumnWidth(header: any, columnIndex: number, itemSpecs: any[]) {
    return itemSpecs.length > 0 && itemSpecs[columnIndex] ? itemSpecs[columnIndex].width : ListColumnWidth(header.uid) + 'px'
}

interface Props {
    columns: any[]
    itemSpecs: any[]
    // Column uid shown as the row's title (left-aligned, bold, opens the row)
    primaryColumn: string
    // Text shown in a column; return undefined to use the row data as-is
    getValue: (header: any) => any
    // Leave out for read-only rows
    onOpen?: () => void
    openLabel?: string
    // Replaces the default text for a column (e.g. a status pill)
    renderCell?: (header: any) => ReactNode | undefined
    // Shown before / after the title inside the primary column
    leading?: ReactNode
    trailing?: ReactNode
    accentClassName?: string
    // Overrides the column sizing (default: fixed widths that match the List column headers)
    columnStyle?: (header: any, columnIndex: number) => CSSProperties
    dragRef?: any
    isDragging?: boolean
}

// One record in a workspace table (trip, employee, client). With onOpen the whole card is clickable
// and the title is a real button, so keyboard users can open the record too.
const ListRow: FC<Props> = ({ columns, itemSpecs, primaryColumn, getValue, onOpen, openLabel, renderCell, leading, trailing, accentClassName, columnStyle, dragRef, isDragging }) => {
    return (
        <div className='mt-2 break-inside-avoid print:mt-0'>
            <div
                ref={ dragRef }
                onClick={ onOpen }
                className={ cn('relative flex w-full flex-row items-stretch overflow-hidden rounded-[var(--radius-card)] border border-line bg-white py-2.5 shadow-[0_1px_2px_rgba(16,26,51,0.04)] print:rounded-none print:border-x-0 print:border-t-0 print:py-2 print:shadow-none', onOpen && 'cursor-pointer transition-colors duration-150 hover:border-brand-500/40 hover:bg-brand-50/50 motion-reduce:transition-none') }
                style={{ opacity: isDragging ? 0.5 : 1 }}>
                { accentClassName && <span aria-hidden="true" className={ cn('absolute inset-y-0 left-0 w-1', accentClassName) }/> }

                {
                    columns.map((header: any, columnIndex: number) => {
                        const value = getValue(header)
                        const isPrimary = header.uid === primaryColumn
                        const custom = renderCell?.(header)

                        return (
                            <div key={ header.uid } className={ cn('flex min-w-0 items-center border-r border-line/70 px-3 last:border-r-0', isPrimary && 'gap-3 pl-4') } style={ columnStyle ? columnStyle(header, columnIndex) : { width: ColumnWidth(header, columnIndex, itemSpecs) } }>
                                {
                                    isPrimary ?
                                        <>
                                            { leading }
                                            {
                                                onOpen ?
                                                    <button type='button' onClick={ (e) => { e.stopPropagation(); onOpen() } } aria-label={ openLabel } title={ value || undefined } className='min-w-0 truncate rounded text-left text-sm font-medium text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2'>
                                                        { value || 'Untitled' }
                                                    </button>
                                                :
                                                    <p className='min-w-0 truncate text-sm font-medium text-ink-900' title={ value || undefined }>{ value || '—' }</p>
                                            }
                                            { trailing }
                                        </>
                                    : custom !== undefined ?
                                        <div className='flex w-full justify-center'>{ custom }</div>
                                    :
                                        <p className={ cn('w-full truncate text-center text-sm', value ? 'text-ink-700' : 'text-ink-400') } title={ value || undefined }>
                                            { value || <span className='print:invisible'>—</span> }
                                        </p>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};


export default ListRow;
