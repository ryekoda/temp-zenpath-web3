import { FIELD_IDS } from '../fields';
import { FormatData } from '../formatData';

export function getEmployeeData(
    item: Record<string, any>,
    headerTitles: any[],
    allUsers: any[],
    allEmployees: any[]
): Record<string, any> {
    const newItem: Record<string, any> = {};

    for (const header of headerTitles) {
        const uid = header.uid;
        let itemData = item[uid];

        if (itemData === undefined || uid === FIELD_IDS.EMPLOYEE_NAME) {
            const fallbackMap: Record<string, any> = {
                [FIELD_IDS.EMPLOYEE_NAME]:     (item.lName || item.fName) ? `${item.lName || ''}, ${item.fName || ''}` : '',
                [FIELD_IDS.EMPLOYEE_POSITION]: item.position,
                [FIELD_IDS.EMPLOYEE_PHONE]:    item.phone,
                [FIELD_IDS.EMPLOYEE_HIRED]:    item.dateHired,
            };
            itemData = fallbackMap[uid] ?? '';
        }

        if (header.type === 'dropDown' && header.options?.dropDown) {
            const match = header.options.dropDown.find((opt: any) => opt.value === item[uid]);
            if (match) itemData = match.title;
        }

        newItem[uid] = FormatData(header.type, itemData);
    }

    newItem.id       = item.id;
    newItem.userUID  = item.userUID  || '';
    newItem.comments = item.comments || '';

    return newItem;
}