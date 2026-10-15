"use client"

import { useState, useRef } from 'react';
import { ColorRing } from 'react-loader-spinner';
import { UpdateTableSettings } from '@/helpers/database/CompanySettings';
import WorkspaceNav from '@/app/[id]/_components/WorkspaceNav';
import Tooltip from '@/components/ui/Tooltip';
import ModalScroll from '@/components/ui/modal/ModalScroll';
import { IsAccessGranted } from '@/lib/Utils';
import { HeaderTitles } from '@/lib/GlobalFunctions';
import PageHeader from '@/components/PageHeader';
import List from '@/components/List';
import SortListData from '@/lib/ListSort.js';
import { Cell } from '@/components/containers/reports/subViews/Cell';
import { Reload } from '@/components/containers/reports/Actions';

import { FC } from 'react';
import { useReportOrganizerData } from './_hooks/useReportOrganizerData';

interface OldOrganizerProps {
  companyUID: string;
}

const Organizer: FC<OldOrganizerProps> = ({ companyUID }) => {
    const { state, actions } = useReportOrganizerData(companyUID);
    
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
    const [modalName, setModalName] = useState('create')
    const [isShowingModal, setIsShowingModal] = useState(false)

    // 🆕 ADD THESE TWO MISSING STATE LINES:
    const [selectedData, setSelectedData] = useState<any>(null)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [lastDoc, setLastDoc] = useState<any>()
    const [isWorkspaceNavOpen, setIsWorkspaceNavOpen] = useState(true)

    // Handlers
    const handleModalOpen = (name: string, data: any) => {
        setModalName(name)
        setIsShowingModal(true);
        setIsToolTipOpen(false)
    }

    const handleToolTipItemPressed = (name: string, data: any) => {
        if (name === 'visibleHeaders') {            
            if (state.companySettings) {
                const tableSettingsUID = state.companySettings.id
                const allHeaders = state.companySettings.headers
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
        await UpdateTableSettings(tableSettingsUID, state.dbURL ? state.dbURL : "", headerUID, headerTitle, headerIsHidden, allHeaders, null)
            .catch((err) => console.error('table settings error: ', err)); 
        reloadData()
    }

    const handleToolTipClose = (reset: boolean) => {
        setToolTipTrigger(null)
        setIsToolTipOpen(false)
    }

    function dateDidChange(newDate: Date) {             
        actions.setFilterDate(newDate)
        reloadData()
    }

    function driverDidChange(type: any, name: any, e: any, setValue: any) {
        e.stopPropagation();
        const target = e.target
        setValue(target.value)    
        actions.setSelectedDriverUID(target.value)
        reloadData()
    }

    function loadMoreData() { 
        // LoadMoreItems(employees, setLastDoc)
    }

    function reloadData() { 
        Reload(actions.setRefreshUID) 
    }
    
    return (
        <div className='w-[calc(100%-80px)] ml-20 h-full bg-slate-400 flex flex-row relative print:w-full'>
            <ModalScroll 
                name={ modalName } 
                type={ 0 } 
                isOpen={ isShowingModal } 
                handleClose={ actions.handleModalClose } 
                currentUser={ state.currentUser } 
                setRefreshUID={ actions.setRefreshUID } 
                company={ state.company } 
                companyUID={ companyUID } 
                stripeInfo={ state.stripeInfo } 
                companySettings={ state.companySettings } 
                isToolTipOpen={ isToolTipOpen } 
                setIsToolTipOpen={ setIsToolTipOpen } 
                setCurrentTooltip={ setCurrentTooltip } 
                dbURL={ state.dbURL } 
                handleModalOpen={ handleModalOpen } 
                handleToolTipOpen={ actions.handleToolTipOpen }
            />

            <Tooltip 
                name={ toolTipName } 
                currentUser={ state.currentUser } 
                company={ state.company } 
                companySettings={ state.companySettings } 
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

            <WorkspaceNav currentTab='reports' companyUID={ companyUID } isOpen={ isWorkspaceNavOpen } setIsOpen={ setIsWorkspaceNavOpen } companyInfo={ state.company } handleModalOpen={ handleModalOpen }/>

            <div className='grow h-full relative print:w-full'>
                {
                    (state.isLoading) ?
                        <div className='w-[80px] h-[80px]' style={{ margin: '0 auto',  marginTop: '200px', display: 'block' }}>
                            <ColorRing visible={true} height="80" width="80" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" colors={['#26C797', '#717FF6', '#D93F67', '#F0E44F', '#FCBC05']}/>
                        </div>
                        :
                        <div>
                            {
                                (IsAccessGranted(state.company, state.currentUser) === 'approved') ?
                                    <div className='bg-white h-full absolute w-full overflow-scroll print:overflow-visible'>
                                        <div className='w-full' style={{ left: '0', position: 'sticky', zIndex: '10' }}>
                                            <div className='w-full' style={{ margin: '0 auto', padding: '0px 50px 0px 50px', boxSizing: 'border-box' }}>
                                                <PageHeader title='reports' userInfo={ state.currentUser } companyInfo={ state.company } members={ state.company.allActiveRoles } companySettings={ state.companySettings } allData={ state.drivers } filterDate={ state.filterDate } dateDidChange={ dateDidChange } driverDidChange={ driverDidChange } selectedDriverUID={ state.selectedDriverUID } handleModalOpen={ handleModalOpen } handleToolTipOpen={ actions.handleToolTipOpen } setSelectedDriverUID={ actions.setSelectedDriverUID }/>
                                            </div>
                                        </div>
                                
                                        <List name='reports' data={ state.trips } loadMoreData={ loadMoreData } companyInfo={ state.company } companySettings={ state.companySettings } showHeaders={ true } reloadData={ reloadData } popperTrigger={ popperTrigger } popperTriggers={ popperTriggers } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } selectedData={ selectedData } setSelectedData={ setSelectedData } selectedItem={ selectedItem } sortDirection2={ state.sortDirection } setSortDirection2={ actions.setSortDirection } sortSectionUID2={ state.sortSectionUID } setSortSectionUID2={ actions.setSortSectionUID } boardUID={ companyUID } itemSpecs={ itemSpecs } setItemSpecs={ setItemSpecs } handleToolTipOpen={ actions.handleToolTipOpen } dbURL={ state.dbURL ? state.dbURL : "" } handleModalOpen={ handleModalOpen }>
                                        {
                                            /* 🔑 FIX: Safety boundary wrapper defends parsing if transactions haven't dropped from backend yet */
                                            state.trips && state.trips.length > 0 ? (
                                                SortListData(state.trips, state.sortSectionUID, state.sortDirection).map((item: any, i: number) => (
                                                    <Cell 
                                                        key={ item.id || i } 
                                                        index={ i } 
                                                        name='reports' 
                                                        item={ item } 
                                                        allClients={ state.clients } 
                                                        allEmployees={ state.drivers } 
                                                        showHeaders={ true } 
                                                        headerTitles={ state.activeHeaders } 
                                                        allUsers={ state.clients }
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