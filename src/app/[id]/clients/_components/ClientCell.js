import React from 'react';
import { useDrag } from 'react-dnd';
import { MessageSquare } from 'lucide-react';
import ListRow from '@/app/[id]/_components/ListRow';
import InitialsAvatar from '@/components/ui/InitialsAvatar';
import { GetData } from '@/lib/data/getData';



// Column uid of the client's name in the client table settings
const NAME_COLUMN = '10990'

export const ClientCell = ( props ) => {
    const { index, name, item, allUsers, allClients, allEmployees, showHeaders, headerTitles, onPress, itemSpecs } = props
    const data = GetData(name, item, headerTitles, showHeaders && headerTitles ? allUsers : allClients, allEmployees)
    const [{isDragging}, drag] = useDrag(() => ({ type: "Cell", collect: monitor => ({ isDragging: !!monitor.isDragging(), }), }))

    return (
        <ListRow
            columns={ headerTitles }
            itemSpecs={ itemSpecs }
            primaryColumn={ NAME_COLUMN }
            getValue={ (header) => data[header.type !== 'ref' ? header.uid : header.options.ref[0].value] }
            onOpen={ () => onPress(item, index, 0, true) }
            openLabel={ `Edit ${data[NAME_COLUMN] || 'client'}` }
            leading={ <InitialsAvatar first={ item.fName } last={ item.lName }/> }
            trailing={ data['comments'] && <MessageSquare role='img' aria-label='Has comments' className='ml-auto h-4 w-4 shrink-0 text-ink-400'/> }
            dragRef={ drag }
            isDragging={ isDragging }/>
    )
}
