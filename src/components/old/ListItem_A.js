import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FormatDate, FormatPhoneNumber, TimeConverter, CapitalizeFirstLetterOfEachWord, GetUserInfo, UTCTimeToLocalTime } from '@/lib/Utils';

// Dictionary Mapping for Magic Numbers to protect long-term maintainability
const FIELD_IDS = {
    EMPLOYEE_NAME: '34057',
    EMPLOYEE_POSITION: '45566',
    EMPLOYEE_PHONE: '23800',
    EMPLOYEE_HIRED: '44853',
    CLIENT_NAME: '10990',
    CLIENT_PHONE: '72260',
    CLIENT_ADDRESS: '59737',
    CLIENT_DOB: '27966',
    CLIENT_DISABILITY: '92085',
    TRIP_CLIENT: '71130',
    TRIP_DRIVER: '46783',
    TRIP_ADDRESS: '67300',
    TRIP_DATE: '16538',
    TRIP_TYPE: '95242',
    TRIP_PICKUP_TIME: '97264',
    TRIP_DESTINATION: '32168'
};

export function GetData(name, item, headerTitles, allUsers, allEmployees) {
    if (!headerTitles || headerTitles.length === 0) {
        // Fallback catch-all logic block if no columns are passed
        let newItem = {};
        for (const [key, value] of Object.entries(item)) {
            let itemData = null;
            let type = 'text';
            let newKey = key;

            if (key === FIELD_IDS.TRIP_DRIVER || key === 'driverUID') {
                const driverInfo = GetUserInfo(value, allEmployees);
                itemData = driverInfo ? `${driverInfo.lName}, ${driverInfo.fName}` : '';
                newKey = FIELD_IDS.TRIP_DRIVER;
            } else if (key === FIELD_IDS.TRIP_TYPE || key === 'type') {
                itemData = value;
                newKey = FIELD_IDS.TRIP_TYPE;
            } else if (key === FIELD_IDS.TRIP_DATE || key === 'pickupDate') {
                itemData = value;
                newKey = FIELD_IDS.TRIP_DATE;
            }

            newItem[newKey] = FormatData(type, itemData);
        }
        return newItem;
    }

    let newItem = {};

    // ==========================================
    // DOMAIN 1: EMPLOYEES VIEW
    // ==========================================
    if (name === 'employees') {
        for (let i = 0; i < headerTitles.length; i++) {
            const header = headerTitles[i];
            const uid = header.uid;
            let itemData = item[uid];

            if (typeof item[uid] === 'undefined' || uid === FIELD_IDS.EMPLOYEE_NAME) {
                const fallbackMap = {
                    [FIELD_IDS.EMPLOYEE_NAME]: (item.lName || item.fName) ? `${item.lName || ''}, ${item.fName || ''}` : '',
                    [FIELD_IDS.EMPLOYEE_POSITION]: item.position,
                    [FIELD_IDS.EMPLOYEE_PHONE]: item.phone,
                    [FIELD_IDS.EMPLOYEE_HIRED]: item.dateHired
                };
                itemData = fallbackMap[uid] !== undefined ? fallbackMap[uid] : '';
            }

            if (header.type === 'dropDown' && header.options?.dropDown) {
                const selectedOption = header.options.dropDown.find(opt => opt.value === item[uid]);
                if (selectedOption) itemData = selectedOption.title;
            }

            newItem[uid] = FormatData(header.type, itemData);
        }
        newItem['id'] = item.id;
        newItem['userUID'] = item['userUID'] || '';
        newItem['comments'] = item['comments'] || '';
    } 
    
    // ==========================================
    // DOMAIN 2: CLIENTS VIEW
    // ==========================================
    else if (name === 'clients') {
        for (let i = 0; i < headerTitles.length; i++) {
            const header = headerTitles[i];
            const uid = header.uid;
            let itemData = item[uid];

            if (header.type === 'address' && item[uid]) {
                itemData = item[uid].address;
            }

            if (typeof item[uid] === 'undefined' || uid === FIELD_IDS.CLIENT_NAME) {
                const fallbackMap = {
                    [FIELD_IDS.CLIENT_NAME]: (item.lName || item.fName) ? `${item.lName || ''}, ${item.fName || ''}` : '',
                    [FIELD_IDS.CLIENT_PHONE]: item.phone,
                    [FIELD_IDS.CLIENT_ADDRESS]: item.address,
                    [FIELD_IDS.CLIENT_DOB]: item.dob,
                    [FIELD_IDS.CLIENT_DISABILITY]: item.disability
                };
                itemData = fallbackMap[uid] !== undefined ? fallbackMap[uid] : '';
            }

            newItem[uid] = FormatData(header.type, itemData);
        }
        newItem['id'] = item.id;
        newItem['comments'] = item['comments'] || '';
    } 
    
    // ==========================================
    // DOMAIN 3: TRIPS OR HISTORY VIEW
    // ==========================================
    else if (name === 'trips' || name === 'history') {
        for (let i = 0; i < headerTitles.length; i++) {
            const header = headerTitles[i];
            const uid = header.uid;

            const clientUID = item[FIELD_IDS.TRIP_CLIENT] || item.riderUID;
            const driverUID = item[FIELD_IDS.TRIP_DRIVER] || item.driverUID;

            const clientInfo = GetUserInfo(clientUID, allUsers);
            const driverInfo = GetUserInfo(driverUID, allEmployees);

            let itemData = item[uid];

            const homeAddy = clientInfo?.[FIELD_IDS.CLIENT_ADDRESS]?.address || clientInfo?.address || '';

            if (typeof item[uid] !== 'undefined') {
                if (uid === FIELD_IDS.TRIP_CLIENT || uid === FIELD_IDS.TRIP_DRIVER) {
                    itemData = uid === FIELD_IDS.TRIP_CLIENT 
                        ? (clientInfo ? `${clientInfo.lName}, ${clientInfo.fName}` : '') 
                        : (driverInfo ? `${driverInfo.lName}, ${driverInfo.fName}` : '');
                } else if (header.type === 'address' && uid === FIELD_IDS.TRIP_ADDRESS) {
                    itemData = (item[FIELD_IDS.TRIP_ADDRESS] && item[FIELD_IDS.TRIP_ADDRESS] !== FIELD_IDS.CLIENT_ADDRESS)
                        ? item[FIELD_IDS.TRIP_ADDRESS].address 
                        : homeAddy;
                } else if (header.type === 'address') {
                    itemData = item[uid]?.address || '';
                } else if (uid === FIELD_IDS.TRIP_DATE) {
                    itemData = UTCTimeToLocalTime(new Date(item[uid]));
                }
            } else {
                const fallbackMap = {
                    [FIELD_IDS.TRIP_CLIENT]: clientInfo ? `${clientInfo.lName}, ${clientInfo.fName}` : '',
                    [FIELD_IDS.TRIP_DRIVER]: driverInfo ? `${driverInfo.lName}, ${driverInfo.fName}` : '',
                    [FIELD_IDS.TRIP_TYPE]: item.type,
                    [FIELD_IDS.TRIP_PICKUP_TIME]: item.pickupTime,
                    [FIELD_IDS.TRIP_DESTINATION]: item.destination,
                    [FIELD_IDS.TRIP_DATE]: item.pickupDate,
                    [FIELD_IDS.TRIP_ADDRESS]: homeAddy
                };
                itemData = fallbackMap[uid] !== undefined ? fallbackMap[uid] : '';
            }

            newItem[uid] = FormatData(header.type, itemData);
        }
        newItem['comments'] = item['comments'] || '';
    } 
    
    // ==========================================
    // DOMAIN 4: REPORTS MANAGEMENT VIEW (CLEANED)
    // ==========================================
    else if (name === 'reports') {
        for (let i = 0; i < headerTitles.length; i++) {
            const header = headerTitles[i];
            if (header.type !== 'ref') continue;

            const refUID = header.options?.ref?.[0]?.value;
            const refType = header.options?.ref?.[0]?.type;

            const clientUID = item[FIELD_IDS.TRIP_CLIENT] || item.riderUID;
            const clientInfo = GetUserInfo(clientUID, allUsers);
            // console.log('MMMM: ', clientUID, clientInfo, allUsers);
            
            let itemData = item[refUID];

            if (typeof item[refUID] === 'undefined' || refUID === FIELD_IDS.TRIP_CLIENT || refUID === FIELD_IDS.TRIP_ADDRESS) {
                const fallbackMap = {
                    [FIELD_IDS.TRIP_CLIENT]: clientInfo ? `${clientInfo.lName}, ${clientInfo.fName}` : '',
                    [FIELD_IDS.TRIP_PICKUP_TIME]: item.pickupTime,
                    [FIELD_IDS.TRIP_TYPE]: item.type,
                    [FIELD_IDS.TRIP_DESTINATION]: item.destination,
                    [FIELD_IDS.CLIENT_PHONE]: clientInfo?.[FIELD_IDS.CLIENT_PHONE] || clientInfo?.phone || '',
                    [FIELD_IDS.TRIP_ADDRESS]: item[FIELD_IDS.TRIP_ADDRESS]?.address || clientInfo?.[FIELD_IDS.CLIENT_ADDRESS]?.address || clientInfo?.address || '',
                    'placeholder...': ''
                };
                itemData = fallbackMap[refUID] !== undefined ? fallbackMap[refUID] : '';
            } else if (refType === 'address') {
                itemData = item[refUID]?.address || '';
            }
            
            newItem[refUID] = FormatData(refType, itemData);
        }
    }

    // Deep cleaner deletes parsing errors from empty values
    const removeEmpty = (obj) => {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
        );
    };

    return removeEmpty(newItem);
}

export function FormatData(type, data) {
    let item = null;
    switch(type) {
        case 'date':
            item = data ? FormatDate(new Date(data)) : '';
            break;
        case 'phone':
            item = data ? FormatPhoneNumber(data) : '';
            break;
        case 'time':
            if (typeof data === "string") {
                item = data.length > 15 
                    ? TimeConverter(dayjs(data).toDate()) 
                    : TimeConverter(dayjs(`2023-04-13 ${data}`).toDate());
            } else {
                item = data ? TimeConverter(dayjs(data).toDate()) : '';
            }
            break;
        case 'address':
        case 'image':
            item = data;
            break;
        default:
            item = data ? CapitalizeFirstLetterOfEachWord(data) : '';
    }
    return item;
}

export function CalculateSectionWidth(headerUID) {
    const widthMap = {
        '34057': '50%', '45566': '10%', '44853': '15%', '10990': '35%',
        '27966': '10%', '92085': '10%', '71130': '15%', '95242': '10%',
        '67300': '20%', '97264': '10%', '32168': '20%', '16538': '10%',
        '46783': '15%', '55410': '16%', '61895': '10%', '37498': '17%',
        '70600': '10%', '65474': '18%', '14787': '17%', '75606': '10%',
        '38543': '10%'
    };
    return widthMap[headerUID] || '20%';
}