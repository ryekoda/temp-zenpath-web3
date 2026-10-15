import { FC } from "react";
import ListRow from '@/app/[id]/_components/ListRow';
import { GetData } from '@/lib/data/getData';



// Column uid of the trip's client in the trip table settings
const CLIENT_COLUMN = '71130'

interface Props {
    index: any
    name: any
    item: any
    allUsers?: any
    allClients?: any
    allEmployees?: any
    showHeaders?: any
    headerTitles?: any
    onPress?: any
}

// One past trip in a client's trip history (inside the client modal). Read-only.
const TripHistoryCell: FC<Props> = ({ name, item, allUsers, allClients, allEmployees, showHeaders, headerTitles }) => {
    const data: any = GetData(name, item, headerTitles, showHeaders && headerTitles ? allUsers : allClients, allEmployees)

    return (
        <ListRow
            columns={ headerTitles }
            itemSpecs={ [] }
            primaryColumn={ CLIENT_COLUMN }
            getValue={ (header) => data[header.type !== 'ref' ? header.uid : header.options.ref[0].value] }/>
    )
};


export default TripHistoryCell;
