import { FC } from "react";
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/Utils';
import StatusPill from './StatusPill';
import { sampleRoute } from './sampleData';



// Stop positions on the illustrated map, in route order. Kept away from the
// left/right edges because the map is cropped to fill its container.
const stopPoints = [
    { x: 60, y: 30 },
    { x: 150, y: 165 },
    { x: 240, y: 75 },
]

const RouteMap: FC = () => {
    return (
        <svg viewBox="0 0 300 200" className='h-full w-full' preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="300" height="200" fill="#EEF3F1"/>

            {/* Parks and water */}
            <rect x="111" y="38" width="33" height="28" rx="3" fill="#D3EEDC"/>
            <rect x="201" y="129" width="33" height="28" rx="3" fill="#D3EEDC"/>
            <path d="M240 200 C 255 180, 285 175, 300 150 L 300 200 Z" fill="#D4E9F6"/>

            {/* Minor streets */}
            <g stroke="#FFFFFF" strokeWidth="2.5">
                { [52, 97, 142, 187].map(y => <line key={ `h${y}` } x1="0" y1={ y } x2="300" y2={ y }/>) }
                { [20, 82, 128, 172, 218, 282].map(x => <line key={ `v${x}` } x1={ x } y1="0" x2={ x } y2="200"/>) }
            </g>

            {/* Main streets */}
            <g stroke="#FFFFFF" strokeWidth="6">
                { [30, 75, 120, 165].map(y => <line key={ `H${y}` } x1="0" y1={ y } x2="300" y2={ y }/>) }
                { [60, 105, 150, 195, 240].map(x => <line key={ `V${x}` } x1={ x } y1="0" x2={ x } y2="200"/>) }
            </g>

            {/* Route */}
            <polyline points="60,30 60,120 150,120 150,165 240,165 240,75" fill="none" className='stroke-brand-600' strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>

            {/* Vehicle, en route to the first stop's destination */}
            <circle cx="105" cy="120" r="7" fill="#FFFFFF" className='stroke-brand-700' strokeWidth="2"/>
            <circle cx="105" cy="120" r="3" className='fill-brand-700'/>

            {/* Numbered stops */}
            {
                stopPoints.map((point, index) => (
                    <g key={ index }>
                        <circle cx={ point.x } cy={ point.y } r="9" fill="#FFFFFF" className='stroke-brand-600' strokeWidth="2.5"/>
                        <text x={ point.x } y={ point.y + 3.5 } textAnchor="middle" fontSize="10" fontWeight="700" className='fill-ink-900'>{ index + 1 }</text>
                    </g>
                ))
            }
        </svg>
    )
}

interface Props {
    layout?: 'side' | 'stacked'
    className?: string
}

// side: compact map with the stop list beside it (hero overlay).
// stacked: full-width map with the stops in a row underneath (showcase).
const RouteCard: FC<Props> = ({ layout = 'side', className }) => {
    const isStacked = layout === 'stacked'

    return (
        <div className={cn('flex overflow-hidden rounded-[var(--radius-card)] border border-line bg-white', isStacked ? 'flex-col' : 'flex-row', className)}>
            <div className={cn('aspect-[3/2] min-w-0', isStacked ? 'w-full' : 'flex-1')}>
                <RouteMap/>
            </div>

            <div className={cn('shrink-0 p-3 sm:p-4', isStacked ? 'border-t border-line' : 'w-[42%] border-l border-line')}>
                <div className='mb-3 flex items-start gap-2'>
                    <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-brand-600' strokeWidth={2}/>
                    <div>
                        <p className='text-[13px] font-semibold text-ink-900'>{ sampleRoute.driver }</p>
                        <p className='text-xs text-ink-500'>{ sampleRoute.stops.length } stops today</p>
                    </div>
                </div>

                <ol className={cn(isStacked ? 'grid gap-3 sm:grid-cols-3' : 'space-y-2.5')}>
                    {
                        sampleRoute.stops.map((stop, index) => (
                            <li key={ stop.client } className='flex min-w-0 items-start gap-2'>
                                <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-brand-600 text-[10px] font-bold text-ink-900'>
                                    { index + 1 }
                                </span>
                                <div className='min-w-0'>
                                    <p className='truncate text-xs font-semibold text-ink-900'>{ stop.client }</p>
                                    <p className='whitespace-nowrap text-xs text-ink-500'>{ stop.time }</p>
                                    { isStacked && <span className='mt-1.5 inline-block'><StatusPill status={ stop.status }/></span> }
                                </div>
                            </li>
                        ))
                    }
                </ol>
            </div>
        </div>
    )
};


export default RouteCard;
