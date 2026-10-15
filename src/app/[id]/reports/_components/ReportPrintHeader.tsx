import { FC } from 'react';
import dayjs from 'dayjs';
import { CapitalizeFirstLetter, CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import { FormatPhoneNumber } from '@/lib/format/phone';
import { GetDriverNameFromUID } from '@/lib/workspace/members';



// This workspace prints its drivers' phone numbers on every manifest.
const EMERGENCY_CONTACTS_COMPANY_UID = 'Mf21IpttifgYXMDz2Sbp'

interface Props {
    company: any
    drivers: any[]
    selectedDriverUID?: string | null
    filterDate: Date
}

// Top of the printed driver manifest. Hidden on screen.
const ReportPrintHeader: FC<Props> = ({ company, drivers, selectedDriverUID, filterDate }) => {
    if (!company) return null

    const driverName = selectedDriverUID ? CapitalizeFirstLetterOfEachWord(GetDriverNameFromUID(selectedDriverUID, drivers)) : 'All drivers'

    return (
        <div className='hidden border-b-2 border-ink-900 pb-4 print:mb-2 print:block'>
            <div className='flex flex-row items-end justify-between gap-6'>
                <div>
                    <h1 className='text-2xl font-bold text-ink-900'>{ CapitalizeFirstLetterOfEachWord(company.title) }</h1>
                    <p className='mt-1 text-base font-semibold text-ink-700'>Driver: { driverName }</p>
                    <p className='text-sm text-ink-700'>{ dayjs(filterDate).format('dddd, MMMM D, YYYY') }</p>
                </div>

                {
                    company.id === EMERGENCY_CONTACTS_COMPANY_UID &&
                        <div className='w-[320px] rounded-lg border border-dashed border-ink-400 p-3'>
                            <h2 className='mb-1.5 text-xs font-bold uppercase tracking-wider text-ink-700'>Driver contacts</h2>
                            <div className='flex flex-col gap-1'>
                                {
                                    [...drivers].sort((a, b) => (a.fName > b.fName ? 1 : -1)).map((driver) => (
                                        <div key={ driver.id } className='flex items-center justify-between text-xs text-ink-900'>
                                            <span>{ CapitalizeFirstLetter(driver.fName) } { CapitalizeFirstLetter(driver.lName) }</span>
                                            <span className='tabular-nums'>{ FormatPhoneNumber(driver.phone) }</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                }
            </div>
        </div>
    )
};


export default ReportPrintHeader;
