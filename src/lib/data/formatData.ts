import dayjs from 'dayjs';
import { FormatDate, TimeConverter, UTCTimeToLocalTime } from '@/lib/format/dates';
import { FormatPhoneNumber } from '@/lib/format/phone';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';

export function FormatData(type: string, data: any): any {
    switch (type) {
        case 'date':
            return FormatDate(data);

        case 'phone':
            return data ? FormatPhoneNumber(data) : '';

        case 'time':
            if (typeof data === 'string') {
                return data.length > 15
                    ? TimeConverter(dayjs(data).toDate())
                    : TimeConverter(dayjs(`2023-04-13 ${data}`).toDate());
            }
            return data ? TimeConverter(dayjs(data).toDate()) : '';

        case 'address':
        case 'image':
            return data ?? '';

        default:
            return data ? CapitalizeFirstLetterOfEachWord(data) : '';
    }
}

export function removeEmpty(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
    );
}