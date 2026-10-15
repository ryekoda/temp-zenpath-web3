"use client"
import { FC, useState, useRef, useEffect } from 'react';
import { Contact, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { UpdateTableSettings } from '@/helpers/database/CompanySettings';
import useEmployees from '@/hooks/useEmployees';
import useClients from '@/hooks/useClients';
import List from '@/components/list/List';
import WorkspaceModal from '@/components/modals/WorkspaceModal';
import WorkspaceNav from '@/app/[id]/_components/WorkspaceNav';
import WorkspacePageHeader, { ColumnsButton } from '@/app/[id]/_components/WorkspacePageHeader';
import { AccessDenied, EmptyState } from '@/app/[id]/_components/WorkspaceStates';
import ListSkeleton from '@/components/ui/loading/ListSkeleton';
import Tooltip from '@/components/tooltips/Tooltip';
import { IsAccessGranted } from '@/lib/workspace/access';
import { ClientCell } from './_components/ClientCell';
import TripHistory from './_components/TripHistory';
import Form from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import SortListData from '@/lib/tables/sortRows';
import { HeaderTitles } from '@/lib/tables/columns';
import { FormData, InputChanged, Save, Delete, ErrorMessage, Reload } from './_utils/Actions';
import useTrips from '@/hooks/useTrips';





interface Props {
    companyUID: string
}

const Organizer: FC<Props> = ({ companyUID }) => {
    const { currentUser, stripeInfo, dbURL } = useAuth()
    const [isWorkspaceNavOpen, setIsWorkspaceNavOpen] = useState(true)
    const [refreshUID, setRefreshUID] = useState()
    const [isLoading, setIsLoading] = useState(true)
    // Paging cursor for the client list only (Load more); cleared whenever the page reloads
    const [clientsCursor, setClientsCursor] = useState<any>()
    const [selectedClientUID, setSelectedClientUID] = useState<any>()
    const clients: any = useClients(companyUID, [], clientsCursor, refreshUID, true, dbURL, isLoading, setIsLoading)
    const company: any = useCompany(companyUID, stripeInfo, true, refreshUID, dbURL)
    const companySettings: any = useCompanySettings(companyUID, 'clients', refreshUID, true, dbURL)
    const companyTripSettings: any = useCompanySettings(companyUID, 'trips', refreshUID, true, dbURL)
    const [selectedClientInfo, setSelectedClientInfo] = useState(null)
    const [isModalOptionsShowing, setIsModalOptionsShowing] = useState(false)
    const [filterDate, setFilterDate] = useState<Date | null>(null)
    const [fields, setFields] = useState<any[]>([])
    const historyTrips: any[] = useTrips(companyUID, null, null, selectedClientUID ? selectedClientUID : null, filterDate, null, refreshUID, true, dbURL, isLoading, setIsLoading)
    const historyClients: any = useClients(companyUID, historyTrips.map(a => a['71130']), null, refreshUID, true, dbURL, isLoading, setIsLoading)
    // HmPLCvo7GriIS0i4aTyR
    const employees: any = useEmployees(companyUID, null, null, refreshUID, true, dbURL, isLoading, setIsLoading)
    const popperTrigger = useRef();
    const popperTriggers = useRef([]);
    const popperHeaderTriggers = useRef([]);
    const [isToolTipOpen, setIsToolTipOpen] = useState(false);
    const [toolTipPosition, setToolTipPosition] = useState('bottom')
    const [toolTipTrigger, setToolTipTrigger] = useState<any>()
    const [toolTipName, setToolTipName] = useState('boardSettings')
    const [toolTipData, setToolTipData] = useState()
    const [currentTooltip, setCurrentTooltip] = useState('');
    const [itemSpecs, setItemSpecs] = useState([])
    const [autoCompleteData, setAutoCompleteData] = useState([])
    const [timer, setTimer] = useState()
    const [selectedData, setSelectedData] = useState()
    const [selectedItem, setSelectedItem] = useState()
    const [sortDirection, setSortDirection] = useState('default')
    const [sortSectionUID, setSortSectionUID] = useState('')
    const [modalName, setModalName] = useState('create')
    const [isShowingModal, setIsShowingModal] = useState(false)
    const [modalOptions, setModalOptions] = useState({ employees: [], clients: [], positions: [] })
    const [currentActiveControlItem, setCurrentActiveControlItem] = useState('')
    const [errorCode, setErrorCode] = useState(0)



    useEffect(() => {
        setFields(FormData(modalName, null, companySettings).client)
    }, [ JSON.stringify(companySettings), refreshUID ])


    const handleModalOpen = (name: string, data?: any) => {
        setModalName(name)
   
        if (data) {            
            setFields(FormData(name, data, companySettings).client)            
            setSelectedClientUID(data.id)
        }
        setIsShowingModal(true);
        setIsToolTipOpen(false)
    }

    const handleModalOption = (name: string, isShowing: boolean) => {
        setIsModalOptionsShowing(isShowing)
    }

    const handleModalClose = (reset: boolean) => {
        setIsShowingModal(false);
        setIsModalOptionsShowing(false)

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
        } else if (name === 'form-autocomplete') {
            const item = { name: '71130', value: data }
            setFields(fields.map(field => {
                if (field.name !== item.name) return field
                return {...field, value: item.value ? item.value : ''}
            }))
            handleToolTipClose(false)
        } else if (name === 'listHeader-add') {
            updateListHeader('add', data)
        } else if (name === 'listHeader-delete') {            
            updateListHeader('remove', data)
        } else {
            handleModalOpen(name, null)
        }
    }

    async function updateVisibleHeaders(tableSettingsUID: any, headerUID: any, headerTitle: any, headerIsHidden: any, allHeaders: any) {
        const tableSettingsData = await UpdateTableSettings(tableSettingsUID, dbURL, headerUID, headerTitle, headerIsHidden, allHeaders, null).catch((err) => console.log('table settings error: ', err)); 
        reloadData()
    }

    async function updateListHeader(type: string, data?: any) {
        let headers = companySettings.headers

        if (type === 'add') {
            var rand = Math.floor(10000 + Math.random() * 90000);
            let newHeader = { title: data, isHidden: false, uid: rand.toString(), type: data, indexPosition:  headers.length }
            headers.push(newHeader)   

            await UpdateTableSettings(companySettings.id, dbURL, null, null, null, null, headers)
        } else {
            let newIndex = 0
            for (let i = 0; i < headers.length; i++) {
              const header = headers[i]
      
              if (header.uid === data) {
                headers.splice(i, 1)
              }
            }
      
            for (let i = 0; i < headers.length; i++) {
              const header = headers[i]
              header.indexPosition = header.indexPosition === i ? header.indexPosition : header.indexPosition === i - 1 ? i - 1 : i
            }
            
            await UpdateTableSettings(companySettings.id, dbURL, null, null, null, null, headers)
        }

        handleToolTipClose(true)
    }

    const handleToolTipClose = (reset: boolean) => {
        setToolTipTrigger(null)
        setIsToolTipOpen(false)

        if (reset) {
            reloadData()
        }
    }

    function saveEntry(e: any, setIsSubmitButtonDisabled: any) {
        e.preventDefault()
        
        Save(fields, companyUID, handleModalClose, setIsSubmitButtonDisabled, dbURL)
    }

    function deleteEntry(itemUID: any) {         
        Delete(itemUID, companyUID, handleModalClose, dbURL)
    }
    
    function cellPressed(item: any, index: number, sectionIndex: number, isUsingModal: boolean) {
        if (isUsingModal) {
          handleModalOpen('edit', item)
        } else {
          // open tooltip
        }
    }

    // Fetches the next page of clients and adds it to the list (useClients appends when given a cursor).
    function loadMoreData() {
        const cursor = clients[clients.length - 1]?.lastDoc
        if (cursor) {
            setClientsCursor(cursor)
        } else {
            console.warn('Load more: the clients API did not return a lastDoc cursor, so the next page can’t be requested.')
        }
    }

    function reloadData() { 
        setClientsCursor(undefined)
        setModalName('create')
        setSelectedClientUID(null)
        setFields(FormData('create', null, companySettings).client)
        Reload(setRefreshUID) 
    }
    
    
    return (
        <div className='w-[calc(100%-80px)] ml-20 h-full bg-surface-soft flex flex-row relative'>
            <WorkspaceModal name={ modalName } type={ 0 } isOpen={ isShowingModal } handleClose={ handleModalClose } title={ modalName === 'create' ? 'create client' : isModalOptionsShowing ? 'client history' : 'edit client' } currentUser={ currentUser } setRefreshUID={ setRefreshUID } company={ company } companyUID={ companyUID } stripeInfo={ stripeInfo } companySettings={ companySettings } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } setCurrentTooltip={ setCurrentTooltip } isModalOptionsShowing={ isModalOptionsShowing } handleModalOption={ handleModalOption } dbURL={ dbURL } handleModalOpen={ handleModalOpen } handleToolTipOpen={ handleToolTipOpen } maxWidth={ modalName === 'edit' ? 'md' : 'sm' }>
                <div className='flex flex-row gap-6' style={{ display: isModalOptionsShowing ? 'none' : 'flex' }}>
                    <Form name={ modalName } fields={ fields } setFields={ setFields } selectedData={ selectedClientInfo } options={ modalOptions } tripHistory={ [] } autoCompleteData={ autoCompleteData } isToolTipOpen={ isToolTipOpen } currentTooltip={ currentTooltip } errorMessage={ ErrorMessage(errorCode).message } submitButtonTitle='Save' onSubmit={ saveEntry } onDelete={ deleteEntry }/>
                    {
                        (modalName === 'edit') &&
                            <aside className='w-72 shrink-0'>
                                <div className='rounded-[var(--radius-card)] border border-line bg-surface-soft p-4'>
                                    <h3 className='text-sm font-semibold text-ink-900'>Trip history</h3>
                                    <p className='mt-1 text-sm text-ink-500'>See every trip booked for this client.</p>
                                    <Button variant='secondary' onClick={ () => handleModalOption('history', true) } className='mt-3 h-10 w-full gap-2'>
                                        <History aria-hidden="true" className='h-4 w-4'/>
                                        View trip history
                                    </Button>
                                </div>
                            </aside>
                    }
                </div>

                {
                    (isModalOptionsShowing) &&
                        <TripHistory trips={ historyTrips || [] } clients={ historyClients } employees={ employees } tripSettings={ companyTripSettings } filterDate={ filterDate } setFilterDate={ setFilterDate } sortSectionUID={ sortSectionUID } sortDirection={ sortDirection }/>
                }
            </WorkspaceModal>

            <Tooltip name={ toolTipName } currentUser={ currentUser } company={ company } companySettings={ companySettings } profiles={ [] } isOpen={ isToolTipOpen } trigger={ toolTipTrigger } position={ toolTipPosition } onItemPress={ handleToolTipItemPressed } handleClose={ handleToolTipClose } autoCompleteData={ autoCompleteData } data={ toolTipData }>
                <></>
            </Tooltip>


            <WorkspaceNav currentTab='clients' companyUID={ companyUID } isOpen={ isWorkspaceNavOpen } setIsOpen={ setIsWorkspaceNavOpen } companyInfo={ company } handleModalOpen={ handleModalOpen }/>

            <main className='flex h-full min-w-0 grow flex-col'>
                {
                    (!isLoading && IsAccessGranted(company, currentUser) !== 'approved') ?
                        <AccessDenied area='this workspace’s clients'/>
                    :
                        <>
                            <WorkspacePageHeader
                                title='Clients'
                                subtitle='The riders your team drives'
                                primaryLabel='New client'
                                onPrimary={ () => handleModalOpen('create') }
                                memberCount={ company?.allActiveRoles?.length ?? 0 }
                                handleModalOpen={ handleModalOpen }
                                handleToolTipOpen={ handleToolTipOpen }>
                                <ColumnsButton companySettings={ companySettings } handleToolTipOpen={ handleToolTipOpen }/>
                            </WorkspacePageHeader>

                            <div className='relative min-h-0 grow'>
                                {
                                    (isLoading) ?
                                        <ListSkeleton label='Loading clients…' showAvatar/>
                                    : (clients.length === 0) ?
                                        <EmptyState
                                            icon={ <Contact aria-hidden="true" strokeWidth={1.75}/> }
                                            title='No clients yet'
                                            description='Add the riders you drive so you can book trips for them.'
                                            action={
                                                <Button variant='primary' onClick={ () => handleModalOpen('create') } className='h-10 px-4 font-semibold'>
                                                    New client
                                                </Button>
                                            }/>
                                    :
                                        // List pads itself 50px per side; [&>div]:!px-8 lines the table up with the header above it.
                                        <div className='h-full overflow-auto pt-4 [&>div]:!px-8'>
                                            <List name='clients' data={ clients } loadMoreData={ loadMoreData } companyInfo={ company } companySettings={ companySettings } showHeaders={ true } reloadData={ reloadData } popperTrigger={ popperTrigger } popperTriggers={ popperTriggers } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } selectedData={ selectedData } setSelectedData={ setSelectedData } selectedItem={ selectedItem } sortDirection2={ sortDirection } setSortDirection2={ setSortDirection } sortSectionUID2={ sortSectionUID } setSortSectionUID2={ setSortSectionUID } boardUID={ companyUID } itemSpecs={ itemSpecs } setItemSpecs={ setItemSpecs } handleToolTipOpen={ handleToolTipOpen } dbURL={ dbURL }>
                                                {
                                                    SortListData(clients, sortSectionUID, sortDirection).map((item: any, i: any) => (
                                                        <ClientCell key={ item.id } index={ i } name='clients' item={ item } allClients={ clients } allEmployees={ employees } showHeaders={ true } headerTitles={ HeaderTitles(companySettings, true) } onPress={ cellPressed } itemSpecs={ itemSpecs }/>
                                                    ))
                                                }
                                            </List>
                                        </div>
                                }
                            </div>
                        </>
                }
            </main>
        </div>
    )
};


export default Organizer;