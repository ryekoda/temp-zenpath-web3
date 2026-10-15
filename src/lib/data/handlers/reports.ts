import { FIELD_IDS } from '../fields';
import { FormatData } from '../formatData';
import { GetUserInfo } from '@/lib/Utils';

export function getReportData(
    item: Record<string, any>,
    headerTitles: any[],
    allUsers: any[],
    allEmployees: any[]
): Record<string, any> {
    const newItem: Record<string, any> = {};

    const clientUID  = item[FIELD_IDS.TRIP_CLIENT] || item.riderUID;
    const clientInfo = GetUserInfo(clientUID, allUsers);
    
    for (const header of headerTitles) {
        if (header.type !== 'ref') continue;

        const refUID  = header.options?.ref?.[0]?.value;
        const refType = header.options?.ref?.[0]?.type;

        if (!refUID) continue;

        let itemData = item[refUID];

        if (itemData === undefined || refUID === FIELD_IDS.TRIP_CLIENT || refUID === FIELD_IDS.TRIP_ADDRESS) {
            const fallbackMap: Record<string, any> = {
                [FIELD_IDS.TRIP_CLIENT]:      clientInfo ? `${clientInfo.lName}, ${clientInfo.fName}` : '',
                [FIELD_IDS.TRIP_PICKUP_TIME]: item.pickupTime,
                [FIELD_IDS.TRIP_TYPE]:        item.type,
                [FIELD_IDS.TRIP_DESTINATION]: item.destination,
                [FIELD_IDS.CLIENT_PHONE]:     clientInfo?.[FIELD_IDS.CLIENT_PHONE] || clientInfo?.phone || '',
                [FIELD_IDS.TRIP_ADDRESS]:     item[FIELD_IDS.TRIP_ADDRESS]?.address || clientInfo?.[FIELD_IDS.CLIENT_ADDRESS]?.address || clientInfo?.address || '',
            };
            itemData = fallbackMap[refUID] ?? '';
        } else if (refType === 'address') {
            itemData = item[refUID]?.address || '';
        }

        newItem[refUID] = FormatData(refType, itemData);
    }

    return newItem;
}