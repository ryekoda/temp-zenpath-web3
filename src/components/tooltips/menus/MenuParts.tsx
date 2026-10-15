import { FC, ReactNode } from 'react';
import { cn } from '@/lib/cn';



// Building blocks shared by every tooltip menu, so they all look and behave alike.

export const Menu: FC<{ label: string, children: ReactNode, className?: string }> = ({ label, children, className }) => (
    <div role='menu' aria-label={ label } className={ cn('flex flex-col', className) }>
        { children }
    </div>
)

export const MenuHeading: FC<{ children: ReactNode }> = ({ children }) => (
    <p role='presentation' className='px-2.5 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500'>{ children }</p>
)

export const MenuDivider = () => <div role='separator' className='my-1 h-px bg-line'/>

export const MenuNote: FC<{ children: ReactNode }> = ({ children }) => (
    <p className='max-w-[240px] px-2.5 py-2 text-sm text-ink-500'>{ children }</p>
)

interface MenuItemProps {
    onClick: () => void
    icon?: ReactNode
    tone?: 'default' | 'danger'
    // For checkable rows (role='menuitemcheckbox')
    checked?: boolean
    children: ReactNode
}

export const MenuItem: FC<MenuItemProps> = ({ onClick, icon, tone = 'default', checked, children }) => (
    <button
        type='button'
        role={ checked === undefined ? 'menuitem' : 'menuitemcheckbox' }
        aria-checked={ checked }
        onClick={ onClick }
        className={ cn(
            'flex w-full items-center gap-2.5 rounded-[var(--radius-button)] px-2.5 py-2 text-left text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600 [&_svg]:shrink-0',
            tone === 'danger' ? 'text-status-danger hover:bg-status-danger-soft focus:bg-status-danger-soft' : 'text-ink-900 hover:bg-surface-soft focus:bg-surface-soft'
        ) }>
        { icon && <span aria-hidden="true" className={ cn('flex min-w-[1rem] items-center justify-center [&>svg]:h-4 [&>svg]:w-4', tone === 'danger' ? 'text-status-danger' : 'text-ink-500') }>{ icon }</span> }
        <span className='min-w-0 grow truncate'>{ children }</span>
    </button>
)
