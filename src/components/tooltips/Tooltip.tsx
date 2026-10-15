"use client"
import { FC, KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { Placement } from '@popperjs/core';
import { cn } from '@/lib/cn';
import { HeaderTitles } from '@/lib/tables/columns';
import WorkspaceMenu from './menus/WorkspaceMenu';
import DriverMenu from './menus/DriverMenu';
import ColumnVisibilityMenu from './menus/ColumnVisibilityMenu';
import ClientSuggestionsMenu from './menus/ClientSuggestionsMenu';
import ColumnOptionsMenu from './menus/ColumnOptionsMenu';
import AddColumnMenu from './menus/AddColumnMenu';



// Menus that type into a text field keep focus in the field instead of moving into the menu.
const KEEPS_FOCUS_IN_TRIGGER = ['form-autocomplete']

interface Props {
    children?: ReactNode
    name: string
    currentUser?: any
    company?: any
    companySettings?: any
    profiles?: any[]
    trigger?: HTMLElement | null
    position?: string
    isOpen: boolean
    onItemPress: (name: string, data?: any) => void
    handleClose: (reset: boolean) => void
    autoCompleteData?: any[]
    data?: any
}

// The one popover each workspace page renders. `name` picks the menu; anything else shows `children`.
const Tooltip: FC<Props> = ({ children, name, currentUser, company, companySettings, profiles, trigger, position, isOpen, onItemPress, handleClose, autoCompleteData, data }) => {
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
    const [checkboxes, setCheckboxes] = useState<any[]>([])
    const lastTrigger = useRef<HTMLElement | null>(null)
    const { styles, attributes } = usePopper(trigger, popperElement, {
        placement: (position || 'bottom') as Placement,
        modifiers: [
            { name: 'offset', options: { offset: [0, 8] } },
            { name: 'preventOverflow', options: { padding: 12 } },
        ],
    })

    useEffect(() => {
        if (companySettings && name === 'visibleHeaders') {
            setCheckboxes(HeaderTitles(companySettings, false).filter((header: any) => header.title !== 'name' && header.title !== 'client'))
        }
    }, [ companySettings, name ])

    // Keyboard: Escape closes; focus moves into the menu on open and back to the button on close.
    useEffect(() => {
        if (!isOpen) {
            if (lastTrigger.current && popperElement?.contains(document.activeElement)) lastTrigger.current.focus()
            return
        }

        if (trigger) lastTrigger.current = trigger

        const onKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                handleClose(false)
            }
        }
        document.addEventListener('keydown', onKeyDown)

        if (!KEEPS_FOCUS_IN_TRIGGER.includes(name)) {
            requestAnimationFrame(() => popperElement?.querySelector<HTMLElement>('[role^="menuitem"], button:not([disabled]), input')?.focus())
        }

        return () => document.removeEventListener('keydown', onKeyDown)
    }, [ isOpen, name ])

    // Arrow keys move between menu items
    function onMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

        const items = Array.from(popperElement?.querySelectorAll<HTMLElement>('[role^="menuitem"]') || [])
        if (items.length === 0) return

        e.preventDefault()
        const index = items.indexOf(document.activeElement as HTMLElement)
        const next = e.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length
        items[next].focus()
    }

    // The client suggestions can empty out while the popup is open; don't show an empty box.
    const isVisible = isOpen && !(name === 'form-autocomplete' && !(autoCompleteData && autoCompleteData.length > 0))

    const content =
        name === 'boardSettings' ? <WorkspaceMenu company={ company } currentUser={ currentUser } onPress={ onItemPress }/>
        : name === 'filterProfiles' ? <DriverMenu drivers={ profiles || [] } onPress={ onItemPress }/>
        : name === 'visibleHeaders' ? <ColumnVisibilityMenu checkboxes={ checkboxes } setCheckboxes={ setCheckboxes } onPress={ onItemPress }/>
        : name === 'form-autocomplete' ? <ClientSuggestionsMenu clients={ autoCompleteData || [] } onPress={ onItemPress }/>
        : name === 'listHeaderOptions' ? <ColumnOptionsMenu columnUID={ data } onPress={ onItemPress }/>
        : name === 'addListColumn' ? <AddColumnMenu onPress={ onItemPress }/>
        : children

    return (
        <div className={ cn('fixed inset-0 z-[9000]', !isVisible && 'invisible') } aria-hidden={ !isVisible }>
            {/* Clicking anywhere outside the menu closes it */}
            <div className='absolute inset-0' onClick={ () => handleClose(false) }/>

            <div
                ref={ setPopperElement }
                style={ styles.popper }
                { ...attributes.popper }
                onKeyDown={ onMenuKeyDown }
                className='z-[9999] max-w-[calc(100vw-24px)] rounded-[var(--radius-card)] border border-line bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(16,26,51,0.28)]'>
                { content }
            </div>
        </div>
    )
}


export default Tooltip
