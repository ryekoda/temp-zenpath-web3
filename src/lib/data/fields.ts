export const FIELD_IDS = {
    EMPLOYEE_NAME:     '34057',
    EMPLOYEE_POSITION: '45566',
    EMPLOYEE_PHONE:    '23800',
    EMPLOYEE_HIRED:    '44853',
    CLIENT_NAME:       '10990',
    CLIENT_PHONE:      '72260',
    CLIENT_ADDRESS:    '59737',
    CLIENT_DOB:        '27966',
    CLIENT_DISABILITY: '92085',
    TRIP_CLIENT:       '71130',
    TRIP_DRIVER:       '46783',
    TRIP_ADDRESS:      '67300',
    TRIP_DATE:         '16538',
    TRIP_TYPE:         '95242',
    TRIP_PICKUP_TIME:  '97264',
    TRIP_DESTINATION:  '32168',
} as const;

export function ReportColumnWidth(uid: string): string {
    const widthMap: Record<string, string> = {
        [FIELD_IDS.EMPLOYEE_NAME]:     '820px',
        [FIELD_IDS.EMPLOYEE_POSITION]: '120px',
        [FIELD_IDS.EMPLOYEE_HIRED]:    '150px',
        [FIELD_IDS.CLIENT_NAME]:       '400px',
        [FIELD_IDS.CLIENT_DOB]:        '150px',
        [FIELD_IDS.CLIENT_DISABILITY]: '150px',
        [FIELD_IDS.TRIP_CLIENT]:       '400px',
        [FIELD_IDS.TRIP_TYPE]:         '150px',
        [FIELD_IDS.TRIP_ADDRESS]:      '200px',
        [FIELD_IDS.TRIP_PICKUP_TIME]:  '150px',
        [FIELD_IDS.TRIP_DESTINATION]:  '200px',
        [FIELD_IDS.TRIP_DATE]:         '150px',
        [FIELD_IDS.TRIP_DRIVER]:       '400px',
        '55410': '16%',
        '61895': '10%',
        '37498': '17%',
        '70600': '10%',
        '65474': '18%',
        '14787': '17%',
        '75606': '10%',
        '94583': '10%',
    };
    return widthMap[uid] ?? '200px';
}

// export function ReportColumnWidth(uid: string): string {
//     const widthMap: Record<string, string> = {
//         [FIELD_IDS.EMPLOYEE_NAME]:     '50%',
//         [FIELD_IDS.EMPLOYEE_POSITION]: '10%',
//         [FIELD_IDS.EMPLOYEE_HIRED]:    '15%',
//         [FIELD_IDS.CLIENT_NAME]:       '35%',
//         [FIELD_IDS.CLIENT_DOB]:        '10%',
//         [FIELD_IDS.CLIENT_DISABILITY]: '10%',
//         [FIELD_IDS.TRIP_CLIENT]:       '15%',
//         [FIELD_IDS.TRIP_TYPE]:         '10%',
//         [FIELD_IDS.TRIP_ADDRESS]:      '20%',
//         [FIELD_IDS.TRIP_PICKUP_TIME]:  '10%',
//         [FIELD_IDS.TRIP_DESTINATION]:  '20%',
//         [FIELD_IDS.TRIP_DATE]:         '10%',
//         [FIELD_IDS.TRIP_DRIVER]:       '15%',
//     };
//     return widthMap[uid] ?? '20%';
// }