import { getEmployeeData } from './handlers/employees';
import { getClientData }   from './handlers/clients';
import { getTripData }     from './handlers/trips';
import { getReportData }   from './handlers/reports';
import { getFallbackData } from './handlers/fallback';
import { removeEmpty }     from './formatData';

type HandlerFn = (
    item: Record<string, any>,
    headerTitles: any[],
    allUsers: any[],
    allEmployees: any[]
) => Record<string, any>;

const handlers: Record<string, HandlerFn> = {
    employees: getEmployeeData,
    clients:   getClientData,
    trips:     getTripData,
    history:   getTripData,
    reports:   getReportData,
};

export function GetData(
    name: string,
    item: Record<string, any>,
    headerTitles: any[],
    allUsers: any[],
    allEmployees: any[]
): Record<string, any> {
    if (!headerTitles?.length) return getFallbackData(item, allEmployees);

    const handler = handlers[name];
    if (!handler) {
        console.warn(`GetData: no handler found for "${name}"`);
        return {};
    }

    return removeEmpty(handler(item, headerTitles, allUsers, allEmployees));
}