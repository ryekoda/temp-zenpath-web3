import dayjs from 'dayjs';
import { ParseDate } from '@/lib/format/dates';



// Trip pickup time field; older trips stored it as `pickupTime` instead
const PICKUP_TIME = '97264'

// Minutes after midnight of a trip's pickup time, read the same way the row displays it
// (see FormatData's 'time' case), or null when the trip has no readable time.
function PickupMinutes(trip: any): number | null {
    const value = trip?.[PICKUP_TIME] ?? trip?.pickupTime
    if (value === undefined || value === null || value === '') return null

    // Short strings are a time of day on their own ('14:30'); anything else is a full date/time
    const time = typeof value === 'string' && value.length <= 15
        ? dayjs(`2023-04-13 ${value}`)
        : dayjs(ParseDate(value) ?? undefined)

    return time.isValid() ? time.hour() * 60 + time.minute() : null
}

// The manifest's default order: earliest pickup first. Trips without a time go last;
// trips with the same time keep the order they arrived in.
export function SortByPickupTime(trips: any[]): any[] {
    return [...trips].sort((a, b) => {
        const timeA = PickupMinutes(a)
        const timeB = PickupMinutes(b)

        if (timeA === null && timeB === null) return 0
        if (timeA === null) return 1
        if (timeB === null) return -1
        return timeA - timeB
    })
}
