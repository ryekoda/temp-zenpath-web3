"use client"
import { FC, useRef } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ChevronLeft, ChevronRight, Loader2, Search, User, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import { GetDriverNameFromUID } from '@/lib/workspace/members';
import { toolbarButton, tooltipAnchor } from './WorkspacePageHeader';



const iconButton = 'inline-flex h-10 w-10 items-center justify-center text-ink-500 transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600'

const datePickerSx = {
    width: 150,
    '& .MuiOutlinedInput-root': { height: 40, borderRadius: 0, fontSize: 14, fontFamily: 'inherit', color: 'var(--color-ink-900)' },
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': { fontSize: 18, color: 'var(--color-ink-500)' },
}

interface DateNavigatorProps {
    date: Date
    onChange: (date: Date) => void
}

// Previous day / date picker / next day, plus a Today shortcut.
export const DateNavigator: FC<DateNavigatorProps> = ({ date, onChange }) => {
    const day = dayjs(date)
    const isToday = day.isSame(dayjs(), 'day')

    return (
        <>
            <div className='inline-flex items-center overflow-hidden rounded-[var(--radius-button)] border border-line bg-white'>
                <button type='button' onClick={ () => onChange(day.subtract(1, 'day').toDate()) } aria-label='Previous day' className={ cn(iconButton, 'border-r border-line') }>
                    <ChevronLeft aria-hidden="true" className='h-4 w-4'/>
                </button>
                <LocalizationProvider dateAdapter={ AdapterDayjs }>
                    <DatePicker
                        value={ day }
                        onChange={ (value) => value && onChange(value.toDate()) }
                        slotProps={{ textField: { size: 'small', inputProps: { 'aria-label': 'Date' } } }}
                        sx={ datePickerSx }/>
                </LocalizationProvider>
                <button type='button' onClick={ () => onChange(day.add(1, 'day').toDate()) } aria-label='Next day' className={ cn(iconButton, 'border-l border-line') }>
                    <ChevronRight aria-hidden="true" className='h-4 w-4'/>
                </button>
            </div>

            <button type='button' onClick={ () => onChange(new Date()) } disabled={ isToday } className={ toolbarButton }>
                Today
            </button>
        </>
    )
}

interface DriverFilterProps {
    drivers: any[]
    selectedDriverUID?: string | null
    setSelectedDriverUID: (uid: any) => void
    handleToolTipOpen: (name: string, e: any, data?: any) => void
}

// Opens the driver picker ('filterProfiles' tooltip); shows the chosen driver with a clear button.
export const DriverFilter: FC<DriverFilterProps> = ({ drivers, selectedDriverUID, setSelectedDriverUID, handleToolTipOpen }) => {
    const driverName = selectedDriverUID ? CapitalizeFirstLetterOfEachWord(GetDriverNameFromUID(selectedDriverUID, drivers)) : null

    return (
        <div className='inline-flex items-center'>
            <button type='button' onClick={ (e) => handleToolTipOpen('filterProfiles', tooltipAnchor(e)) } className={ cn(toolbarButton, driverName && 'rounded-r-none border-r-0 bg-brand-50 text-brand-700 hover:bg-brand-50 hover:text-brand-700') }>
                <User aria-hidden="true" className='h-4 w-4'/>
                { driverName || 'All drivers' }
            </button>
            {
                driverName &&
                    <button type='button' onClick={ () => setSelectedDriverUID(null) } aria-label='Clear driver filter' className={ cn(toolbarButton, 'rounded-l-none border-l-0 bg-brand-50 px-2.5 text-brand-700 hover:bg-brand-100 hover:text-brand-700') }>
                        <X aria-hidden="true" className='h-4 w-4'/>
                    </button>
            }
        </div>
    )
}

export const ToolbarDivider = () => <span aria-hidden="true" className='mx-1 hidden h-6 w-px bg-line sm:block'/>


interface SearchFieldProps {
    value: string
    onChange: (value: string) => void
    label: string
    placeholder?: string
    // Shows a spinner in place of the search icon while results load
    isSearching?: boolean
}

// Toolbar search box. Escape or the clear button empties it.
export const SearchField: FC<SearchFieldProps> = ({ value, onChange, label, placeholder, isSearching }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    function clear() {
        onChange('')
        inputRef.current?.focus()
    }

    return (
        <div role='search' className='relative w-full sm:w-72'>
            {
                isSearching ?
                    <Loader2 aria-hidden="true" className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-500'/>
                :
                    <Search aria-hidden="true" className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500'/>
            }
            <input
                ref={ inputRef }
                type='search'
                value={ value }
                onChange={ (e) => onChange(e.target.value) }
                onKeyDown={ (e) => { if (e.key === 'Escape' && value) { e.preventDefault(); clear() } } }
                aria-label={ label }
                placeholder={ placeholder }
                autoComplete='off'
                spellCheck={ false }
                className='h-10 w-full rounded-[var(--radius-button)] border border-line bg-white pl-9 pr-9 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30 [&::-webkit-search-cancel-button]:hidden'/>
            {
                value &&
                    <button type='button' onClick={ clear } aria-label='Clear search' className='absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[var(--radius-button)] text-ink-500 transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                        <X aria-hidden="true" className='h-4 w-4'/>
                    </button>
            }
        </div>
    )
}
