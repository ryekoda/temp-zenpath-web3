// Shared look for form fields (forms in modals, invite, seats, pricing).
export const fieldClassName = 'h-12 w-full rounded-[var(--radius-button)] border border-line bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors duration-150 hover:border-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-surface-soft'

export const selectClassName = `${fieldClassName} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23607895' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10`

export const textareaClassName = 'w-full resize-none rounded-[var(--radius-button)] border border-line bg-white px-3.5 py-3 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors duration-150 hover:border-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20'

export const labelClassName = 'mb-1.5 block text-sm font-medium text-ink-700'

// MUI date/time pickers styled to match fieldClassName
export const pickerSx = {
    width: '100%',
    '& .MuiOutlinedInput-root': { height: 48, borderRadius: '10px', fontSize: 15, fontFamily: 'inherit', color: 'var(--color-ink-900)', backgroundColor: 'white' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-border)' },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-ink-400)' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-brand-600)', borderWidth: 1, boxShadow: '0 0 0 3px rgba(15,169,120,0.2)' },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': { fontSize: 20, color: 'var(--color-ink-500)' },
}
