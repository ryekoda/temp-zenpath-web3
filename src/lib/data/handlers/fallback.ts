import { FIELD_IDS } from '../fields';
import { FormatData } from '../formatData';
import { GetUserInfo } from '@/lib/Utils';

export function getFallbackData(
    item: Record<string, any>,
    allEmployees: any[]
): Record<string, any> {
    const newItem: Record<string, any> = {};

    for (const [key, value] of Object.entries(item)) {
        let itemData = null;
        let type     = 'text';
        let newKey   = key;

        if (key === FIELD_IDS.TRIP_DRIVER || key === 'driverUID') {
            const driverInfo = GetUserInfo(value, allEmployees);
            itemData = driverInfo ? `${driverInfo.lName}, ${driverInfo.fName}` : '';
            newKey   = FIELD_IDS.TRIP_DRIVER;
        } else if (key === FIELD_IDS.TRIP_TYPE || key === 'type') {
            itemData = value;
            newKey   = FIELD_IDS.TRIP_TYPE;
        } else if (key === FIELD_IDS.TRIP_DATE || key === 'pickupDate') {
            itemData = value;
            newKey   = FIELD_IDS.TRIP_DATE;
        }

        newItem[newKey] = FormatData(type, itemData);
    }

    return newItem;
}