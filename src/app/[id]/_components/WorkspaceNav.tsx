import { FC } from "react";
import Link from 'next/link';
import { BarChart3, CalendarDays, ChevronLeft, ChevronRight, Contact, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import WorkspaceCover from '@/components/workspace/WorkspaceCover';
import { CapitalizeFirstLetter } from '@/lib/format/text';
import { cn } from '@/lib/cn';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import { SubscriptionStatus } from '@/lib/billing/plans';



export type WorkspaceTab = 'planner' | 'employees' | 'clients' | 'reports'

const tabs: { id: WorkspaceTab, label: string, icon: typeof Users }[] = [
    { id: 'planner', label: 'Planner', icon: CalendarDays },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'clients', label: 'Clients', icon: Contact },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
]

// Keep these widths: the planner's map positions itself using them (80px app sidebar + this nav).
const openWidth = 250
const closedWidth = 26

interface Props {
    currentTab: WorkspaceTab
    companyUID: string
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    companyInfo: any
    handleModalOpen: (name: string, data?: any) => void
}

// The workspace's own menu (Planner, Employees, Clients, Reports), shown next to the app sidebar.
const WorkspaceNav: FC<Props> = ({ currentTab, companyUID, isOpen, setIsOpen, companyInfo, handleModalOpen }) => {
    const workspaceName = companyInfo?.title ? CapitalizeFirstLetterOfEachWord(companyInfo.title) : 'Workspace'
    const planName = companyInfo?.plan?.[0]?.title ? CapitalizeFirstLetter(companyInfo.plan[0].title) : null
    const isSubscribed = SubscriptionStatus(companyInfo).isSubscriptionActive

    return (
        <aside
            className='relative h-full shrink-0 border-r border-line bg-white transition-[width] duration-200 ease-out motion-reduce:transition-none print:hidden'
            style={{ width: isOpen ? openWidth : closedWidth }}>
            <button
                type='button'
                onClick={ () => setIsOpen(!isOpen) }
                aria-expanded={ isOpen }
                aria-label={ isOpen ? 'Collapse workspace menu' : 'Expand workspace menu' }
                className='absolute -right-3.5 top-6 z-[12] flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-ink-500 shadow-sm transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                { isOpen ? <ChevronLeft aria-hidden="true" className='h-4 w-4' strokeWidth={2.25}/> : <ChevronRight aria-hidden="true" className='h-4 w-4' strokeWidth={2.25}/> }
            </button>

            {
                isOpen &&
                    <div className='flex h-full w-[250px] flex-col overflow-y-auto px-4 py-5'>
                        <div className='mb-6 flex items-center gap-3 px-1'>
                            <WorkspaceCover color={ companyInfo?.theme?.color } image={ companyInfo?.theme?.image } className='h-10 w-10 shrink-0 rounded-lg'/>
                            <div className='min-w-0'>
                                <p className='truncate text-[15px] font-semibold text-ink-900' title={ workspaceName }>{ workspaceName }</p>
                                { planName && <p className='text-xs text-ink-500'>{ planName } plan</p> }
                            </div>
                        </div>

                        <nav aria-label='Workspace'>
                            <ul className='space-y-1'>
                                {
                                    tabs.map(({ id, label, icon: Icon }) => {
                                        const isCurrent = currentTab === id

                                        return (
                                            <li key={ id }>
                                                <Link
                                                    href={ `/${companyUID}/${id}` }
                                                    aria-current={ isCurrent ? 'page' : undefined }
                                                    className={cn(
                                                        'flex items-center gap-3 rounded-[var(--radius-button)] px-3 py-2.5 text-[15px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                                                        isCurrent ? 'bg-brand-50 font-semibold text-brand-700' : 'font-medium text-ink-700 hover:bg-surface-soft hover:text-ink-900'
                                                    )}>
                                                    <Icon aria-hidden="true" className='h-5 w-5 shrink-0' strokeWidth={ isCurrent ? 2 : 1.75 }/>
                                                    { label }
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </nav>

                        {
                            !isSubscribed &&
                                <div className='mt-auto rounded-[var(--radius-card)] bg-brand-50 p-4'>
                                    <span className='mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-700'>
                                        <Sparkles aria-hidden="true" className='h-4 w-4' strokeWidth={2}/>
                                    </span>
                                    <p className='text-sm font-semibold text-ink-900'>Need more room?</p>
                                    <p className='mt-1 text-sm text-ink-700'>Upgrade for unlimited trips and workspaces.</p>
                                    <Button type='button' variant='primary' onClick={ () => handleModalOpen('pricing') } className='mt-3 h-9 w-full text-sm font-semibold'>
                                        See plans
                                    </Button>
                                </div>
                        }
                    </div>
            }
        </aside>
    )
};


export default WorkspaceNav;
