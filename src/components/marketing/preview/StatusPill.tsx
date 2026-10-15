import { FC } from "react";
import { cn } from '@/lib/Utils';
import { TripStatus } from './sampleData';



// Every status has a text label, so it never relies on color alone.
const statusStyles: Record<TripStatus, { label: string, pill: string, dot: string }> = {
    ready: { label: 'Ready', pill: 'bg-status-success-soft text-brand-700', dot: 'bg-status-success' },
    enRoute: { label: 'En route', pill: 'bg-status-info-soft text-ink-700', dot: 'bg-status-info' },
    complete: { label: 'Complete', pill: 'bg-surface-soft text-ink-500 ring-1 ring-inset ring-line', dot: 'bg-ink-400' },
}

interface Props {
    status: TripStatus
}

const StatusPill: FC<Props> = ({ status }) => {
    const style = statusStyles[status]

    return (
        <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold', style.pill)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)}/>
            { style.label }
        </span>
    )
};


export default StatusPill;
