import React from 'react';



// MARK: ----- Radio
export const Radio = ( props ) => {
    const { title, isChecked, onChange } = props

    return (
        <label className='mt-2 flex cursor-pointer items-center gap-2.5 text-sm text-ink-900'>
            <input className='h-4 w-4 accent-[var(--color-brand-600)]' name='radioGroup' type='radio' checked={ isChecked } onChange={ () => onChange() }/>
            { title }
        </label>
    )
}

// MARK: ----- Checkbox
export const Checkbox_Container = ( props ) => {
    const { title, isChecked, onChange } = props

    return (
        <label className='mb-2 flex w-fit cursor-pointer items-center gap-2.5 text-sm text-ink-900'>
            <input className='h-4 w-4 rounded accent-[var(--color-brand-600)]' name={ title } type='checkbox' checked={ isChecked } onChange={ (e) => onChange(e) }/>
            { title }
        </label>
    )
}
