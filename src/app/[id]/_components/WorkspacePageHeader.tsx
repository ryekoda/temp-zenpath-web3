"use client"
import { FC, MouseEvent, ReactNode } from 'react';
import { Columns, Heart, MoreHorizontal, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NumberOfHiddenHeaders } from '@/lib/tables/columns';



// The tooltips anchor to e.target, which can be the icon inside a button; anchor to the button itself.
export const tooltipAnchor = (e: MouseEvent<HTMLElement>) => ({ target: e.currentTarget })

export const toolbarButton = 'inline-flex h-10 items-center gap-2 rounded-[var(--radius-button)] border border-line bg-white px-3 text-sm font-medium text-ink-700 transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:pointer-events-none disabled:opacity-50'

interface ColumnsButtonProps {
    companySettings: any
    handleToolTipOpen: (name: string, e: any, data?: any) => void
}

// Opens the show/hide columns menu for a workspace table.
export const ColumnsButton: FC<ColumnsButtonProps> = ({ companySettings, handleToolTipOpen }) => {
    const hiddenColumns = NumberOfHiddenHeaders(companySettings)

    return (
        <button type='button' onClick={ (e) => handleToolTipOpen('visibleHeaders', tooltipAnchor(e)) } className={ toolbarButton }>
            <Columns aria-hidden="true" className='h-4 w-4'/>
            Columns
            { hiddenColumns > 0 && <span className='text-ink-500'>· { hiddenColumns } hidden</span> }
        </button>
    )
}

interface Props {
    title: string
    subtitle?: ReactNode
    primaryLabel: string
    onPrimary: () => void
    // Icon on the primary button (defaults to a plus)
    primaryIcon?: ReactNode
    // Green is for creating things (New trip, New client); use 'secondary' for other actions like printing
    primaryVariant?: 'primary' | 'secondary'
    memberCount: number
    handleModalOpen: (name: string, data?: any) => void
    handleToolTipOpen: (name: string, e: any, data?: any) => void
    // Toolbar row under the title (filters, view switches)
    children?: ReactNode
    // Optional row under the toolbar (summaries)
    footer?: ReactNode
}

// Title bar shared by the workspace pages (Planner, Employees, Clients).
const WorkspacePageHeader: FC<Props> = ({ title, subtitle, primaryLabel, onPrimary, primaryIcon, primaryVariant = 'primary', memberCount, handleModalOpen, handleToolTipOpen, children, footer }) => {
    return (
        <header className='shrink-0 border-b border-line bg-white px-8 pb-4 pt-5 print:hidden'>
            <div className='flex flex-wrap items-start justify-between gap-x-6 gap-y-3'>
                <div className='min-w-0'>
                    <h1 className='text-2xl font-semibold tracking-tight text-ink-900'>{ title }</h1>
                    { subtitle && <p className='mt-1 text-sm text-ink-500'>{ subtitle }</p> }
                </div>

                <div className='flex items-center gap-1'>
                    <Button variant='ghost' onClick={ () => handleModalOpen('feedback') } className='h-10 gap-2 rounded-[var(--radius-button)] px-3 text-ink-700'>
                        <Heart aria-hidden="true" className='h-4 w-4'/>
                        <span className='hidden lg:inline'>Give feedback</span>
                        <span className='sr-only lg:hidden'>Give feedback</span>
                    </Button>
                    <Button variant='ghost' onClick={ () => handleModalOpen('invite') } className='h-10 gap-2 rounded-[var(--radius-button)] px-3 text-ink-700'>
                        <UserPlus aria-hidden="true" className='h-4 w-4'/>
                        <span>Invite</span>
                        <span className='rounded-full bg-surface-soft px-1.5 text-xs tabular-nums text-ink-500' aria-label={ `${memberCount} members` }>{ memberCount }</span>
                    </Button>
                    <Button variant='ghost' onClick={ (e) => handleToolTipOpen('boardSettings', tooltipAnchor(e)) } aria-label='Workspace settings' className='h-10 w-10 rounded-[var(--radius-button)] p-0 text-ink-700'>
                        <MoreHorizontal aria-hidden="true" className='h-5 w-5'/>
                    </Button>
                    <Button variant={ primaryVariant } onClick={ onPrimary } className='ml-2 h-10 gap-2 px-4 font-semibold'>
                        { primaryIcon ?? <Plus aria-hidden="true" className='h-4 w-4' strokeWidth={2.5}/> }
                        { primaryLabel }
                    </Button>
                </div>
            </div>

            { children && <div className='mt-4 flex flex-wrap items-center gap-2'>{ children }</div> }
            { footer && <div className='mt-4 flex flex-wrap items-center gap-2'>{ footer }</div> }
        </header>
    )
};


export default WorkspacePageHeader;
