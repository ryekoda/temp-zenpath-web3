"use client"
import { FC } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { History, X } from 'lucide-react';
import SortListData from '@/lib/tables/sortRows';
import { HeaderTitles } from '@/lib/tables/columns';
import { ColumnWidth } from '@/app/[id]/_components/ListRow';
import { toolbarButton } from '@/app/[id]/_components/WorkspacePageHeader';
import { EmptyState } from '@/app/[id]/_components/WorkspaceStates';
import TripHistoryCell from './TripHistoryCell';



// Trip status isn't loaded on the clients page, so its column is left out here.
const STATUS_COLUMN = '38543'

interface Props {
    trips: any[]
    clients: any[]
    employees: any[]
    tripSettings: any
    filterDate: Date | null
    setFilterDate: (date: Date | null) => void
    sortSectionUID: string
    sortDirection: string
}

// A client's past trips, shown in the client modal.
const TripHistory: FC<Props> = ({ trips, clients, employees, tripSettings, filterDate, setFilterDate, sortSectionUID, sortDirection }) => {
    const columns = (HeaderTitles(tripSettings, true) || []).filter((header: any) => header.uid !== STATUS_COLUMN)

    return (
        <div className='min-w-full'>
            <div className='flex flex-wrap items-center justify-between gap-3 pb-4'>
                <p className='text-sm text-ink-500'>
                    { trips.length } { trips.length === 1 ? 'trip' : 'trips' }{ filterDate ? ` on ${dayjs(filterDate).format('MMMM D, YYYY')}` : '' }
                </p>
                <div className='flex items-center gap-2'>
                    <LocalizationProvider dateAdapter={ AdapterDayjs }>
                        <DatePicker
                            value={ filterDate ? dayjs(filterDate) : null }
                            onChange={ (value) => value && setFilterDate(value.toDate()) }
                            slotProps={{ textField: { size: 'small', inputProps: { 'aria-label': 'Filter by date' } } }}
                            sx={{ width: 170, '& .MuiOutlinedInput-root': { height: 40, borderRadius: '10px', fontSize: 14, fontFamily: 'inherit' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-border)' } }}/>
                    </LocalizationProvider>
                    {
                        filterDate &&
                            <button type='button' onClick={ () => setFilterDate(null) } className={ toolbarButton }>
                                <X aria-hidden="true" className='h-4 w-4'/>
                                Clear
                            </button>
                    }
                </div>
            </div>

            {
                trips.length > 0 ?
                    <div className='overflow-x-auto pb-2'>
                        <div className='w-max min-w-full'>
                            <div className='flex px-0 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-500'>
                                {
                                    columns.map((header: any, i: number) => (
                                        <div key={ header.uid } className={ i === 0 ? 'truncate pl-4 pr-3' : 'truncate px-3 text-center' } style={{ width: ColumnWidth(header, i, []) }}>
                                            { header.title }
                                        </div>
                                    ))
                                }
                            </div>
                            {
                                SortListData(trips, sortSectionUID, sortDirection).map((item: any, i: any) => (
                                    <TripHistoryCell key={ item.id } index={ i } name='trips' item={ item } allClients={ clients } allEmployees={ employees } showHeaders={ true } headerTitles={ columns } allUsers={ clients }/>
                                ))
                            }
                        </div>
                    </div>
                :
                    <div className='h-72'>
                        <EmptyState
                            icon={ <History aria-hidden="true" strokeWidth={1.75}/> }
                            title={ filterDate ? 'No trips on this date' : 'No trips yet' }
                            description={ filterDate ? 'Try another date, or clear the filter to see every trip.' : 'Trips booked for this client will show up here.' }/>
                    </div>
            }
        </div>
    )
};


export default TripHistory;
