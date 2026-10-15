"use client"
import { FC, useState, useRef, useMemo } from 'react';
import { ColorRing } from 'react-loader-spinner';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { UpdateTableSettings } from '@/helpers/database/CompanySettings';
import useClients from '@/hooks/useClients';
import useEmployees from '@/hooks/useEmployees';
import useTrips from '@/hooks/useTrips';
import WorkspaceNav from '@/app/[id]/_components/WorkspaceNav';
import Tooltip from '@/components/ui/Tooltip';
import ModalScroll from '@/components/ui/modal/ModalScroll';
import { IsAccessGranted } from '@/lib/Utils';
import { HeaderTitles } from '@/lib/GlobalFunctions';
import PageHeader from '@/components/PageHeader';
import List from '@/components/List';
import SortListData from '@/lib/ListSort.js';
import { Cell } from './subViews/Cell';
import { Reload } from './Actions';

interface nameProps {
    companyUID: string
}

const Organizer: FC<nameProps> = ({ companyUID }) => {
    const { currentUser, stripeInfo, dbURL } = useAuth()
    const [isWorkspaceNavOpen, setIsWorkspaceNavOpen] = useState(true)
    const [refreshUID, setRefreshUID] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const [lastDoc, setLastDoc] = useState<any>()
    const [filterDate, setFilterDate] = useState(new Date())
    const [selectedDriverUID, setSelectedDriverUID] = useState<any>()
    
    // Core custom data streams
    const company: any = useCompany(companyUID, stripeInfo, true, refreshUID, dbURL)
    const companySettings: any = useCompanySettings(companyUID, 'reports', refreshUID, true, dbURL)
    const trips = useTrips(companyUID, null, selectedDriverUID, null, filterDate, lastDoc, refreshUID, true, dbURL, isLoading, setIsLoading)

    // 🔑 FIX: Memoizing client IDs prevents your fetch streams from causing infinite loops
    const clientUIDs = useMemo(() => {
        if (!trips || trips.length === 0) return [];
        return trips.map((trip: any) => trip['71130']).filter(Boolean);
    }, [trips]);

    const clients = useClients(companyUID, clientUIDs, null, refreshUID, true, dbURL, isLoading, setIsLoading, true)
    const drivers = useEmployees(companyUID, 'driver', null, null, true, dbURL)
    
    // UI Layout state engines
    const popperTrigger = useRef<any>();
    const popperTriggers = useRef<any>([]);
    const popperHeaderTriggers = useRef<any>([]);
    const [isToolTipOpen, setIsToolTipOpen] = useState(false);
    const [currentTooltip, setCurrentTooltip] = useState('');
    const [toolTipPosition, setToolTipPosition] = useState('bottom')
    const [toolTipTrigger, setToolTipTrigger] = useState<any>()
    const [toolTipName, setToolTipName] = useState('boardSettings')
    const [toolTipData, setToolTipData] = useState<any>()
    const [itemSpecs, setItemSpecs] = useState([])
    const [autoCompleteData, setAutoCompleteData] = useState([])
    const [sortDirection, setSortDirection] = useState('default')
    const [sortSectionUID, setSortSectionUID] = useState('')
    const [modalName, setModalName] = useState('create')
    const [isShowingModal, setIsShowingModal] = useState(false)


    // 🆕 ADD THESE TWO MISSING STATE LINES:
    const [selectedData, setSelectedData] = useState<any>(null)
    const [selectedItem, setSelectedItem] = useState<any>(null)

    // Handlers
    const handleModalOpen = (name: string, data: any) => {
        setModalName(name)
        setIsShowingModal(true);
        setIsToolTipOpen(false)
    }

    const handleModalClose = (reset: boolean) => {
        setIsShowingModal(false);
        if (reset) {
            reloadData()
        }
    }

    const handleToolTipOpen = (name: string, e: any, data?: any) => {
        const target = e.target
        setToolTipName(name)
        setToolTipTrigger(target)
        setIsToolTipOpen(true)
        setToolTipData(data)
        
        if (name === 'boardSettings' || name === 'addListColumn') {
            setToolTipPosition('bottom-end')
        } else {
            setToolTipPosition('bottom')
        }
    }

    const handleToolTipItemPressed = (name: string, data: any) => {
        if (name === 'visibleHeaders') {            
            if (companySettings) {
                const tableSettingsUID = companySettings.id
                const allHeaders = companySettings.headers
                const headerUID = data.uid
                const headerTitle = data.title
                const headerIsHidden = data.isHidden
                
                updateVisibleHeaders(tableSettingsUID, headerUID, headerTitle, headerIsHidden, allHeaders) 
            }
        } else {
            handleModalOpen(name, null)
        }
    }

    async function updateVisibleHeaders(tableSettingsUID: any, headerUID: any, headerTitle: any, headerIsHidden: any, allHeaders: any) {
        await UpdateTableSettings(tableSettingsUID, dbURL, headerUID, headerTitle, headerIsHidden, allHeaders, null)
            .catch((err) => console.error('table settings error: ', err)); 
        reloadData()
    }

    const handleToolTipClose = (reset: boolean) => {
        setToolTipTrigger(null)
        setIsToolTipOpen(false)
    }

    function dateDidChange(newDate: Date) {             
        setFilterDate(newDate)
        reloadData()
    }

    function driverDidChange(type: any, name: any, e: any, setValue: any) {
        e.stopPropagation();
        const target = e.target
        setValue(target.value)    
        setSelectedDriverUID(target.value)
        reloadData()
    }

    function loadMoreData() { 
        // LoadMoreItems(employees, setLastDoc)
    }

    function reloadData() { 
        Reload(setRefreshUID) 
    }

    // 🔑 FIX: Memoize header processing to shield render pipelines from overhead crashes
    const activeHeaders = useMemo(() => {
        return HeaderTitles(companySettings, true);
    }, [companySettings]);
    
    return (
        <div className='w-[calc(100%-80px)] ml-20 h-full bg-slate-400 flex flex-row relative print:w-full'>
            <ModalScroll 
                name={ modalName } 
                type={ 0 } 
                isOpen={ isShowingModal } 
                handleClose={ handleModalClose } 
                currentUser={ currentUser } 
                setRefreshUID={ setRefreshUID } 
                company={ company } 
                companyUID={ companyUID } 
                stripeInfo={ stripeInfo } 
                companySettings={ companySettings } 
                isToolTipOpen={ isToolTipOpen } 
                setIsToolTipOpen={ setIsToolTipOpen } 
                setCurrentTooltip={ setCurrentTooltip } 
                dbURL={ dbURL } 
                handleModalOpen={ handleModalOpen } 
                handleToolTipOpen={ handleToolTipOpen }
            />

            <Tooltip 
                name={ toolTipName } 
                currentUser={ currentUser } 
                company={ company } 
                companySettings={ companySettings } 
                profiles={ [] } 
                isOpen={ isToolTipOpen } 
                trigger={ toolTipTrigger } 
                position={ toolTipPosition } 
                onItemPress={ handleToolTipItemPressed } 
                handleClose={ handleToolTipClose } 
                autoCompleteData={ autoCompleteData } 
                data={ toolTipData }
            >
                <></>
            </Tooltip>

            <WorkspaceNav currentTab='reports' companyUID={ companyUID } isOpen={ isWorkspaceNavOpen } setIsOpen={ setIsWorkspaceNavOpen } companyInfo={ company } handleModalOpen={ handleModalOpen }/>

            <div className='grow h-full relative print:w-full'>
                {
                    (isLoading) ?
                        <div className='w-[80px] h-[80px]' style={{ margin: '0 auto',  marginTop: '200px', display: 'block' }}>
                            <ColorRing visible={true} height="80" width="80" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" colors={['#26C797', '#717FF6', '#D93F67', '#F0E44F', '#FCBC05']}/>
                        </div>
                        :
                        <div>
                            {
                                (IsAccessGranted(company, currentUser) === 'approved') ?
                                    <div className='bg-white h-full absolute w-full overflow-scroll print:overflow-visible'>
                                        <div className='w-full' style={{ left: '0', position: 'sticky', zIndex: '10' }}>
                                            <div className='w-full' style={{ margin: '0 auto', padding: '0px 50px 0px 50px', boxSizing: 'border-box' }}>
                                                <PageHeader title='reports' userInfo={ currentUser } companyInfo={ company } members={ company.allActiveRoles } companySettings={ companySettings } allData={ drivers } filterDate={ filterDate } dateDidChange={ dateDidChange } driverDidChange={ driverDidChange } selectedDriverUID={ selectedDriverUID } handleModalOpen={ handleModalOpen } handleToolTipOpen={ handleToolTipOpen } setSelectedDriverUID={ setSelectedDriverUID }/>
                                            </div>
                                        </div>
                                
                                        <List name='reports' data={ trips } loadMoreData={ loadMoreData } companyInfo={ company } companySettings={ companySettings } showHeaders={ true } reloadData={ reloadData } popperTrigger={ popperTrigger } popperTriggers={ popperTriggers } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } selectedData={ selectedData } setSelectedData={ setSelectedData } selectedItem={ selectedItem } sortDirection2={ sortDirection } setSortDirection2={ setSortDirection } sortSectionUID2={ sortSectionUID } setSortSectionUID2={ setSortSectionUID } boardUID={ companyUID } itemSpecs={ itemSpecs } setItemSpecs={ setItemSpecs } handleToolTipOpen={ handleToolTipOpen } dbURL={ dbURL } handleModalOpen={ handleModalOpen }>
                                        {
                                            /* 🔑 FIX: Safety boundary wrapper defends parsing if transactions haven't dropped from backend yet */
                                            trips && trips.length > 0 ? (
                                                SortListData(trips, sortSectionUID, sortDirection).map((item: any, i: number) => (
                                                    <Cell 
                                                        key={ item.id || i } 
                                                        index={ i } 
                                                        name='reports' 
                                                        item={ item } 
                                                        allClients={ clients } 
                                                        allEmployees={ drivers } 
                                                        showHeaders={ true } 
                                                        headerTitles={ activeHeaders } 
                                                        allUsers={ clients }
                                                    />
                                                ))
                                            ) : (
                                                <div className='w-full text-center py-12 text-slate-400 text-sm'>
                                                    No report logs recorded for this timeframe.
                                                </div>
                                            )
                                        }
                                        </List>
                                    </div>
                                :
                                <div className='w-full text-center mt-40 font-semibold text-red-500'>
                                    Access Status: Rejected
                                </div>
                            }
                        </div>
                }
            </div>
        </div>
    )
};

export default Organizer;