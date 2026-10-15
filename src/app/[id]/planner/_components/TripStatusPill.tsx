import { FC } from 'react';
import { cn } from '@/lib/cn';
import { TripStatus, tripStatusStyles } from '../_utils/tripStatus';



interface Props {
    status: TripStatus
    count?: number
    className?: string
}

const TripStatusPill: FC<Props> = ({ status, count, className }) => {
    const styles = tripStatusStyles[status.tone]

    return (
        <span className={cn('inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-ink-900', styles.pill, className)}>
            <span aria-hidden="true" className={cn('h-1.5 w-1.5 shrink-0 rounded-full', styles.dot)}/>
            <span className='truncate'>{ status.label }</span>
            { count !== undefined && <span className='tabular-nums text-ink-500'>{ count }</span> }
        </span>
    )
};


export default TripStatusPill;
