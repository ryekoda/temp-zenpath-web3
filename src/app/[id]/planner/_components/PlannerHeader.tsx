"use client"
import { FC } from 'react';
import dayjs from 'dayjs';
import { List, Map as MapIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import WorkspacePageHeader, { ColumnsButton } from '@/app/[id]/_components/WorkspacePageHeader';
import { DateNavigator, DriverFilter, ToolbarDivider } from '@/app/[id]/_components/WorkspaceFilters';
import TripStatusPill from './TripStatusPill';
import { TripStatus } from '../_utils/tripStatus';



export type PlannerView = 'schedule' | 'map'

interface Props {
    company: any
    companySettings: any
    filterDate: Date
    dateDidChange: (date: Date) => void
    drivers: any[]
    selectedDriverUID?: string | null
    setSelectedDriverUID: (uid: any) => void
    view: PlannerView
    setView: (view: PlannerView) => void
    statusCounts: { status: TripStatus, count: number }[]
    tripCount: number
    handleModalOpen: (name: string, data?: any) => void
    handleToolTipOpen: (name: string, e: any, data?: any) => void
}

const PlannerHeader: FC<Props> = ({ company, companySettings, filterDate, dateDidChange, drivers, selectedDriverUID, setSelectedDriverUID, view, setView, statusCounts, tripCount, handleModalOpen, handleToolTipOpen }) => {
    const date = dayjs(filterDate)
    const isToday = date.isSame(dayjs(), 'day')

    return (
        <WorkspacePageHeader
            title='Planner'
            subtitle={
                <>
                    { date.format('dddd, MMMM D, YYYY') }
                    { isToday && <span className='ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700'>Today</span> }
                </>
            }
            primaryLabel='New trip'
            onPrimary={ () => handleModalOpen('create') }
            memberCount={ company?.allActiveRoles?.length ?? 0 }
            handleModalOpen={ handleModalOpen }
            handleToolTipOpen={ handleToolTipOpen }
            footer={
                <div className='flex flex-wrap items-center gap-2' aria-live='polite'>
                    <span className='mr-1 text-sm font-medium text-ink-900'>
                        { tripCount } { tripCount === 1 ? 'trip' : 'trips' }
                    </span>
                    {
                        statusCounts.map(({ status, count }) => (
                            <TripStatusPill key={ status.tone } status={ status } count={ count }/>
                        ))
                    }
                </div>
            }>
            <DateNavigator date={ filterDate } onChange={ dateDidChange }/>
            <ToolbarDivider/>
            <DriverFilter drivers={ drivers } selectedDriverUID={ selectedDriverUID } setSelectedDriverUID={ setSelectedDriverUID } handleToolTipOpen={ handleToolTipOpen }/>

            { view === 'schedule' && <ColumnsButton companySettings={ companySettings } handleToolTipOpen={ handleToolTipOpen }/> }

            <div role='group' aria-label='Planner view' className='ml-auto inline-flex rounded-[var(--radius-button)] border border-line bg-surface-soft p-1'>
                {
                    ([['schedule', 'Schedule', List], ['map', 'Map', MapIcon]] as const).map(([id, label, Icon]) => (
                        <button
                            key={ id }
                            type='button'
                            onClick={ () => setView(id) }
                            aria-pressed={ view === id }
                            className={ cn(
                                'inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                                view === id ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-900'
                            ) }>
                            <Icon aria-hidden="true" className='h-4 w-4'/>
                            { label }
                        </button>
                    ))
                }
            </div>
        </WorkspacePageHeader>
    )
};


export default PlannerHeader;
