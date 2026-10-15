import { FIELD_IDS } from '../fields';
import { FormatData } from '../formatData';
import { GetUserInfo, UTCTimeToLocalTime } from '@/lib/Utils';

function formatName(info: any): string {
    return info ? `${info.lName}, ${info.fName}` : '';
}

function resolveAddress(item: Record<string, any>, homeAddy: string): string {
    const tripAddress = item[FIELD_IDS.TRIP_ADDRESS];
    return (tripAddress && tripAddress !== FIELD_IDS.CLIENT_ADDRESS)
        ? tripAddress.address
        : homeAddy;
}

export function getTripData(
    item: Record<string, any>,
    headerTitles: any[],
    allUsers: any[],
    allEmployees: any[]
): Record<string, any> {
    const newItem: Record<string, any> = {};

    const clientUID  = item[FIELD_IDS.TRIP_CLIENT] || item.riderUID;
    const driverUID  = item[FIELD_IDS.TRIP_DRIVER] || item.driverUID;
    const clientInfo = GetUserInfo(clientUID, allUsers);
    const driverInfo = GetUserInfo(driverUID, allEmployees);
    const homeAddy   = clientInfo?.[FIELD_IDS.CLIENT_ADDRESS]?.address || clientInfo?.address || '';

    for (const header of headerTitles) {
        const uid = header.uid;
        let itemData = item[uid];

        if (itemData !== undefined) {
            if (uid === FIELD_IDS.TRIP_CLIENT)  itemData = formatName(clientInfo);
            else if (uid === FIELD_IDS.TRIP_DRIVER)  itemData = formatName(driverInfo);
            else if (uid === FIELD_IDS.TRIP_ADDRESS && header.type === 'address') itemData = resolveAddress(item, homeAddy);
            else if (header.type === 'address')  itemData = item[uid]?.address || '';
            else if (uid === FIELD_IDS.TRIP_DATE) itemData = UTCTimeToLocalTime(new Date(item[uid]));
        } else {
            const fallbackMap: Record<string, any> = {
                [FIELD_IDS.TRIP_CLIENT]:      formatName(clientInfo),
                [FIELD_IDS.TRIP_DRIVER]:      formatName(driverInfo),
                [FIELD_IDS.TRIP_TYPE]:        item.type,
                [FIELD_IDS.TRIP_PICKUP_TIME]: item.pickupTime,
                [FIELD_IDS.TRIP_DESTINATION]: item.destination,
                [FIELD_IDS.TRIP_DATE]:        item.pickupDate,
                [FIELD_IDS.TRIP_ADDRESS]:     homeAddy,
            };
            itemData = fallbackMap[uid] ?? '';
        }

        newItem[uid] = FormatData(header.type, itemData);
    }

    newItem.comments = item.comments || '';

    return newItem;
}