"use client"
import { FC, useState, useRef, useEffect } from 'react';
import { ColorRing } from  'react-loader-spinner';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { UpdateTableSettings } from '@/helpers/database/CompanySettings';
import useEmployees from '@/hooks/useEmployees';
import useClients from '@/hooks/useClients';
import PageHeader from '@/components/PageHeader';
import List from '@/components/List';
import ModalScroll from '@/components/ui/modal/ModalScroll';
import WorkspaceNav from '@/app/[id]/_components/WorkspaceNav';
import Tooltip from '@/components/ui/Tooltip';
import { IsAccessGranted } from '@/lib/Utils';
import { Cell } from './subViews/Cell';
import HistroyCell from './subViews/HistoryCell';
import Form from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import LargeHeading from '@/components/ui/LargeHeading';
import SortListData from '@/lib/ListSort.js';
import { HeaderTitles } from '@/lib/GlobalFunctions';
import { cn } from '@/lib/Utils';
import { FormData, InputChanged, Save, Delete, ErrorMessage, Reload } from './Actions';
import Paragraph from '@/components/ui/Paragraph';
import useTrips from '@/hooks/useTrips';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';





interface Props {
    companyUID: string
}

const Organizer: FC<Props> = ({ companyUID }) => {
    const { currentUser, stripeInfo, dbURL } = useAuth()
    const [isWorkspaceNavOpen, setIsWorkspaceNavOpen] = useState(true)
    const [refreshUID, setRefreshUID] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [lastDoc, setLastDoc] = useState()
    const [selectedClientUID, setSelectedClientUID] = useState<any>()
    const clients: any = useClients(companyUID, [], lastDoc, refreshUID, true, dbURL, isLoading, setIsLoading)
    const company: any = useCompany(companyUID, stripeInfo, true, refreshUID, dbURL)
    const companySettings: any = useCompanySettings(companyUID, 'clients', refreshUID, true, dbURL)
    const companyTripSettings: any = useCompanySettings(companyUID, 'trips', refreshUID, true, dbURL)
    const [selectedClientInfo, setSelectedClientInfo] = useState(null)
    const [isModalOptionsShowing, setIsModalOptionsShowing] = useState(false)
    const [filterDate, setFilterDate] = useState(null)
    const [fields, setFields] = useState<any[]>([])
    const historyTrips: any[] = useTrips(companyUID, null, null, selectedClientUID ? selectedClientUID : null, filterDate, lastDoc, refreshUID, true, dbURL, isLoading, setIsLoading)
    const historyClients: any = useClients(companyUID, historyTrips.map(a => a['71130']), lastDoc, refreshUID, true, dbURL, isLoading, setIsLoading)
    // HmPLCvo7GriIS0i4aTyR
    const employees: any = useEmployees(companyUID, null, lastDoc, refreshUID, true, dbURL, isLoading, setIsLoading)
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

    function FilterInputChanged(e: any) {        
        setFilterDate(e.toDate())
    }

    function ClearFilterInput() {
        setFilterDate(null)
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

    function loadMoreData() { 
        setLastDoc(clients[clients.length - 1].lastDoc)
        reloadData()
    }

    function reloadData() { 
        setModalName('create')
        setSelectedClientUID(null)
        setFields(FormData('create', null, companySettings).client)
        Reload(setRefreshUID) 
    }
    
    
    return (
        <div className='w-[calc(100%-80px)] ml-20 h-full bg-slate-400 flex flex-row relative'>
            <ModalScroll name={ modalName } type={ 0 } isOpen={ isShowingModal } handleClose={ handleModalClose } title={ modalName === 'create' ? 'create client' : isModalOptionsShowing ? 'client history' : 'edit client' } currentUser={ currentUser } setRefreshUID={ setRefreshUID } company={ company } companyUID={ companyUID } stripeInfo={ stripeInfo } companySettings={ companySettings } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } setCurrentTooltip={ setCurrentTooltip } isModalOptionsShowing={ isModalOptionsShowing } handleModalOption={ handleModalOption } dbURL={ dbURL }>
                <div className='pb-[150px] flex flex-row' style={{ display: isModalOptionsShowing ? 'none' : 'flex' }}>
                    <Form name={ modalName } fields={ fields } setFields={ setFields } selectedData={ selectedClientInfo } options={ modalOptions } tripHistory={ [] } autoCompleteData={ autoCompleteData } isToolTipOpen={ isToolTipOpen } currentTooltip={ currentTooltip } errorMessage={ ErrorMessage(errorCode).message } submitButtonTitle='Save' onSubmit={ saveEntry } onDelete={ deleteEntry }/>
                    <div className='px-6 w-72 relative' style={ modalName === 'edit' ? { display: 'block' } : { display: 'none' }}>
                        <LargeHeading size='xm' className='text-slate-500 py-1'>
                            Extras
                        </LargeHeading>
                        <Button variant='default' onClick={ () => handleModalOption('history', true) } className={cn('w-full', 'className')}>
                            <>
                                Show History
                            </>
                        </Button>
                    </div>
                </div>

                <div className='min-h-screen relative' style={{ display: isModalOptionsShowing ? 'flex' : 'none' }}>
                    <div className='block min-w-full'>
                        <div className='flex justify-end pb-6'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker value={ filterDate ? dayjs(filterDate) : filterDate } onChange={ (e) => FilterInputChanged(e) }/>
                            </LocalizationProvider>
                            <Button variant='custom' onClick={ () => ClearFilterInput() } className={cn('w-fit mt-2', 'className')} disabled={ filterDate ? false : true } style={{ visibility: filterDate ? 'visible' : 'hidden' }}>
                                <>
                                    Clear
                                </>
                            </Button>
                        </div>
                        <div className='overflow-x-scroll'>
                            {
                                (historyTrips && historyTrips.length > 0) ?
                                    <>
                                        {
                                            SortListData(historyTrips, sortSectionUID, sortDirection).map((item: any, i: any) => (
                                                <HistroyCell key={ item.id } index={ i } name='trips' item={ item } allClients={ historyClients } allEmployees={ employees } showHeaders={ true } headerTitles={ HeaderTitles(companyTripSettings, true) } allUsers={ historyClients } onPress={ cellPressed } itemSpecs={ itemSpecs }/>
                                            ))
                                        }
                                    </>
                                :
                                    <>
                                        <Paragraph className='text-slate-400'>No trips on this date</Paragraph>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </ModalScroll>

            <Tooltip name={ toolTipName } currentUser={ currentUser } company={ company } companySettings={ companySettings } profiles={ [] } isOpen={ isToolTipOpen } trigger={ toolTipTrigger } position={ toolTipPosition } onItemPress={ handleToolTipItemPressed } handleClose={ handleToolTipClose } autoCompleteData={ autoCompleteData } data={ toolTipData }>
                <></>
            </Tooltip>


            <WorkspaceNav currentTab='clients' companyUID={ companyUID } isOpen={ isWorkspaceNavOpen } setIsOpen={ setIsWorkspaceNavOpen } companyInfo={ company } handleModalOpen={ handleModalOpen }/>

            <div className='grow h-full relative'>
                {
                    (isLoading) ?
                        <div style={{ width: '80px', height: '80px', margin: '0 auto',  marginTop: '200px', display: 'block' }}>
                            <ColorRing visible={true} height="80" width="80" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" colors={['#26C797', '#717FF6', '#D93F67', '#F0E44F', '#FCBC05']}/>
                        </div>
                        :
                        <div>
                            {
                                (IsAccessGranted(company, currentUser) === 'approved') ?
                                    <div className='bg-white h-full absolute w-full overflow-scroll'>
                                        <div style={{ width: '100%', left: '0', position: 'sticky', zIndex: '10' }}>
                                            <div className='w-full' style={{ margin: '0 auto', padding: '0px 50px 0px 50px', boxSizing: 'border-box' }}>
                                                <PageHeader title='clients' userInfo={ currentUser } companyInfo={ company } members={ company.allActiveRoles } companySettings={ companySettings } handleModalOpen={ handleModalOpen } handleToolTipOpen={ handleToolTipOpen }/>
                                            </div>
                                        </div>
                                
                                        <List name='clients' data={ clients } loadMoreData={ loadMoreData } companyInfo={ company } companySettings={ companySettings } showHeaders={ true } reloadData={ reloadData } popperTrigger={ popperTrigger } popperTriggers={ popperTriggers } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } selectedData={ selectedData } setSelectedData={ setSelectedData } selectedItem={ selectedItem } sortDirection2={ sortDirection } setSortDirection2={ setSortDirection } sortSectionUID2={ sortSectionUID } setSortSectionUID2={ setSortSectionUID } boardUID={ companyUID } itemSpecs={ itemSpecs } setItemSpecs={ setItemSpecs } handleToolTipOpen={ handleToolTipOpen } dbURL={ dbURL }>
                                            {
                                                SortListData(clients, sortSectionUID, sortDirection).map((item: any, i: any) => (
                                                    <Cell key={ item.id } index={ i } name='clients' item={ item } allClients={ clients } allEmployees={ employees } showHeaders={ true } headerTitles={ HeaderTitles(companySettings, true) } onPress={ cellPressed } itemSpecs={ itemSpecs }/>
                                                ))
                                            }
                                        </List>
                                
                                        <div className='w-full bg-white flex flex-row sticky' style={{ left: '0', margin: '0 auto', padding: '20px 0px 20px 0px', bottom: '0' }}>
                                            <div className='w-full box-border' style={{ margin: '0 auto', padding: '0px 50px 0px 50px' }}>
                                                <Button variant='default' onClick={ () => handleModalOpen('create') } className={cn('w-fit', 'className')}>
                                                    <>
                                                    Add new client
                                                    </>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                :
                                    <p>Rejected</p>
                            }
                        </div>
                }
            </div>
        </div>
    )
};


export default Organizer;