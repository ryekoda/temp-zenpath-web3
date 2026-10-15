import { CapitalizeFirstLetter } from '@/lib/format/text';



export type TripStatusTone = 'waiting' | 'enroute' | 'complete' | 'cancelled'

export interface TripStatus {
    tone: TripStatusTone
    label: string
}

// Turns a trip's latest 'changedTripStatus' activity value into a label and color tone.
// Trips with no status activity yet are waiting for a driver.
export function GetTripStatus(activityValue?: string | null): TripStatus {
    const value = (activityValue || '').toLowerCase()

    if (value === 'complete') return { tone: 'complete', label: 'Complete' }
    if (value === 'cancelled') return { tone: 'cancelled', label: 'Cancelled' }
    if (value === 'enroute' || value === 'en route') return { tone: 'enroute', label: 'En route' }
    if (value) return { tone: 'waiting', label: CapitalizeFirstLetter(value) }
    return { tone: 'waiting', label: 'Waiting for driver' }
}

// Tailwind classes per tone. The text stays dark; the dot and tint carry the color,
// so the label is always what tells the status.
export const tripStatusStyles: Record<TripStatusTone, { pill: string, dot: string }> = {
    waiting: { pill: 'bg-surface-soft border-line', dot: 'bg-ink-400' },
    enroute: { pill: 'bg-status-info-soft border-transparent', dot: 'bg-status-info' },
    complete: { pill: 'bg-status-success-soft border-transparent', dot: 'bg-status-success' },
    cancelled: { pill: 'bg-status-danger-soft border-transparent', dot: 'bg-status-danger' },
}
