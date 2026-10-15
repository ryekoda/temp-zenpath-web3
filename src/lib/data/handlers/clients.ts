import { FIELD_IDS } from '../fields';
import { FormatData } from '../formatData';

export function getClientData(
    item: Record<string, any>,
    headerTitles: any[],
    allUsers: any[],
    allEmployees: any[]
): Record<string, any> {
    const newItem: Record<string, any> = {};

    for (const header of headerTitles) {
        const uid = header.uid;
        let itemData = item[uid];

        if (header.type === 'address' && itemData) {
            itemData = itemData.address;
        }

        if (itemData === undefined || uid === FIELD_IDS.CLIENT_NAME) {
            const fallbackMap: Record<string, any> = {
                [FIELD_IDS.CLIENT_NAME]:       (item.lName || item.fName) ? `${item.lName || ''}, ${item.fName || ''}` : '',
                [FIELD_IDS.CLIENT_PHONE]:      item.phone,
                [FIELD_IDS.CLIENT_ADDRESS]:    item.address,
                [FIELD_IDS.CLIENT_DOB]:        item.dob,
                [FIELD_IDS.CLIENT_DISABILITY]: item.disability,
            };
            itemData = fallbackMap[uid] ?? '';
        }

        newItem[uid] = FormatData(header.type, itemData);
    }

    newItem.id       = item.id;
    newItem.comments = item.comments || '';

    return newItem;
}