// Illustrative sample data for the marketing product previews.
// Keep it internally consistent: times are in order and statuses match them.

export type TripStatus = 'ready' | 'enRoute' | 'complete'

export interface SampleTrip {
    client: string
    assignee: string
    status: TripStatus
    time: string
    destination: string
}

export const sampleTrips: SampleTrip[] = [
    { client: 'Gabriel Fox', assignee: 'Dana Brooks', status: 'complete', time: '8:30 AM', destination: 'Lakeside Health Center' },
    { client: 'Priscilla Richards', assignee: 'Marcus Lee', status: 'enRoute', time: '10:00 AM', destination: 'Riverside Care Center' },
    { client: 'Aaron Adams', assignee: 'Marcus Lee', status: 'ready', time: '11:30 AM', destination: 'Maple Grove Senior Living' },
    { client: 'Sara Ellis', assignee: 'Marcus Lee', status: 'ready', time: '2:00 PM', destination: 'Westview Clinic' },
]

// Marcus Lee's route for the day, in stop order.
export const sampleRoute = {
    driver: 'Marcus Lee',
    stops: sampleTrips.filter(trip => trip.assignee === 'Marcus Lee'),
}

export function GetInitials(name: string) {
    return name.split(' ').map(part => part[0]).join('')
}
