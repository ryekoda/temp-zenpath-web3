import { FC } from "react";
import { CalendarDays, Car, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import StatusPill from './StatusPill';
import { GetInitials, sampleTrips, TripStatus } from './sampleData';



const rowAccent: Record<TripStatus, string> = {
    ready: 'border-l-status-success',
    enRoute: 'border-l-status-info',
    complete: 'border-l-ink-400',
}

const stats = [
    { label: 'Trips today', value: sampleTrips.length, icon: CalendarDays },
    { label: 'En route', value: sampleTrips.filter(trip => trip.status === 'enRoute').length, icon: Car },
    { label: 'Completed', value: sampleTrips.filter(trip => trip.status === 'complete').length, icon: Check },
]

const Avatar: FC<{ name: string, className?: string }> = ({ name, className }) => (
    <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold', className)}>
        { GetInitials(name) }
    </span>
)

const TripsTable: FC = () => {
    return (
        <div>
            <div className='mb-4 grid grid-cols-3 divide-x divide-line rounded-xl border border-line'>
                {
                    stats.map(({ label, value, icon: Icon }) => (
                        <div key={ label } className='flex items-center gap-2.5 px-3 py-2.5'>
                            <Icon className='hidden h-4 w-4 shrink-0 text-ink-500 sm:block' strokeWidth={1.75}/>
                            <div>
                                <p className='text-base font-bold leading-tight text-ink-900'>{ value }</p>
                                <p className='text-xs text-ink-500'>{ label }</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className='grid grid-cols-[minmax(0,1fr)_86px_62px] gap-3 px-3 pb-2 text-xs font-semibold text-ink-700 sm:grid-cols-[minmax(0,1fr)_28px_86px_62px] 2xl:grid-cols-[minmax(0,1fr)_28px_86px_62px_minmax(0,1fr)]'>
                <span>Client</span>
                <span className='hidden sm:block'/>
                <span>Status</span>
                <span>Time</span>
                <span className='hidden 2xl:block'>Destination</span>
            </div>

            <ul className='space-y-1.5'>
                {
                    sampleTrips.map(trip => (
                        <li key={ trip.client } className={cn('grid grid-cols-[minmax(0,1fr)_86px_62px] items-center gap-3 rounded-lg border border-l-[3px] border-line px-3 py-2 sm:grid-cols-[minmax(0,1fr)_28px_86px_62px] 2xl:grid-cols-[minmax(0,1fr)_28px_86px_62px_minmax(0,1fr)]', rowAccent[trip.status])}>
                            <span className='flex min-w-0 items-center gap-2'>
                                <Avatar name={ trip.client } className='bg-brand-100 text-brand-700'/>
                                <span className='truncate text-[13px] font-medium text-ink-900'>{ trip.client }</span>
                            </span>
                            <span className='hidden sm:block' title={ trip.assignee }>
                                <Avatar name={ trip.assignee } className='bg-surface-soft text-ink-700 ring-1 ring-line'/>
                            </span>
                            <span><StatusPill status={ trip.status }/></span>
                            <span className='whitespace-nowrap text-[13px] text-ink-700'>{ trip.time }</span>
                            <span className='hidden truncate text-[13px] text-ink-700 2xl:block'>{ trip.destination }</span>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
};


export default TripsTable;
