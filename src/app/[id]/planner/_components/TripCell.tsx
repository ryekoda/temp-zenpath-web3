"use client"
import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { MessageSquare } from 'lucide-react';
import ListRow from '@/app/[id]/_components/ListRow';
import TripStatusPill from './TripStatusPill';
import { GetTripStatus, tripStatusStyles } from '../_utils/tripStatus';

import { GetData } from '@/lib/data/getData';



// Column uids from the company's trip table settings
const CLIENT_COLUMN = '71130'
const STATUS_COLUMN = '38543'

interface Props {
    index: number
    name: string
    item: any
    allTrips: any[]
    allUsers: any[]
    allClients: any[]
    allEmployees: any[]
    showHeaders: any
    headerTitles: any
    onPress: any
    itemSpecs: any
    activityData: any
}

const TripCell: FC<Props> = ({ index, name, item, allUsers, allClients, allEmployees, showHeaders, headerTitles, onPress, itemSpecs, activityData }) => {
    const data: any = GetData(name, item, headerTitles, showHeaders && headerTitles ? allUsers : allClients, allEmployees)
    const [{isDragging}, drag] = useDrag(() => ({ type: "Cell", collect: monitor => ({ isDragging: !!monitor.isDragging(), }), }))
    const status = GetTripStatus(activityData?.info?.value)

    return (
        <ListRow
            columns={ headerTitles }
            itemSpecs={ itemSpecs }
            primaryColumn={ CLIENT_COLUMN }
            getValue={ (header) => data[header.type !== 'ref' ? header.uid : header.options.ref[0].value] }
            onOpen={ () => onPress(item, index, 0, true) }
            openLabel={ `Open trip for ${data[CLIENT_COLUMN] || 'unnamed client'}` }
            renderCell={ (header) => header.uid === STATUS_COLUMN ? <TripStatusPill status={ status }/> : undefined }
            trailing={ data['comments'] && <MessageSquare role='img' aria-label='Has comments' className='ml-auto h-4 w-4 shrink-0 text-ink-400'/> }
            accentClassName={ tripStatusStyles[status.tone].dot }
            dragRef={ drag }
            isDragging={ isDragging }/>
    )
};


export default TripCell;
