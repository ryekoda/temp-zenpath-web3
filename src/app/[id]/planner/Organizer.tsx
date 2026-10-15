"use client"

import { FC, useState, useRef, useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import dayjs from 'dayjs';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/hooks/useCompany';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import useTrips from '@/hooks/useTrips';
import useEmployees from '@/hooks/useEmployees';
import useClients from '@/hooks/useClients';
import { useActivity } from '@/hooks/useActivity';
import { GetClients } from '@/helpers/database/Clients';
import { DeleteTrip } from '@/helpers/database/Trips';
import { UpdateTableSettings } from '@/helpers/database/CompanySettings';
import MapView from './_components/MapContainer';
import ScheduleContainer from './_components/ScheduleContainer';
import PlannerHeader, { PlannerView } from './_components/PlannerHeader';
import WorkspaceModal from '@/components/modals/WorkspaceModal';
import Tooltip from '@/components/tooltips/Tooltip';
import WorkspaceNav from '@/app/[id]/_components/WorkspaceNav';
import { AccessDenied } from '@/app/[id]/_components/WorkspaceStates';
import ListSkeleton from '@/components/ui/loading/ListSkeleton';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';
import Form from '@/components/ui/Form';
import Tabs from '@/components/ui/Tabs';
import { IsAccessGranted } from '@/lib/workspace/access';
import { FormData, ActivityFormData, Save, Delete, ErrorMessage, Reload, GetActivityInfo } from './_utils/Actions';
import { GetTripStatus, TripStatus } from './_utils/tripStatus';

// Order and short labels for the status summary under the header
const summaryStatuses: TripStatus[] = [
    { tone: 'waiting', label: 'Waiting' },
    { tone: 'enroute', label: 'En route' },
    { tone: 'complete', label: 'Complete' },
    { tone: 'cancelled', label: 'Cancelled' },
]



interface nameProps {
    companyUID: string
}

const Organizer: FC<nameProps> = ({ companyUID }) => {
    const { currentUser, stripeInfo, dbURL } = useAuth()
    const [refreshUID, setRefreshUID] = useState()
    const company = useCompany(companyUID, stripeInfo, true, refreshUID, dbURL)
    const companySettings: any = useCompanySettings(companyUID, 'trips', refreshUID, true, dbURL)
    const [isShowingMap, setIsShowingMap] = useState(true)
    const [isWorkspaceNavOpen, setIsWorkspaceNavOpen] = useState(true)
    const [mapSettings, setMapSettings] = useState({ lng: -122.39949031164404, lat: 37.78767368537758, zoom: 12 })
    const [selectedTrip] = useState()
    const [isShowingDropOffLocation, setIsShowingDropOffLocation] = useState(false)
    const [selectedEmployeeUID, setSelectedEmployeeUID] = useState()
    const [autoCompleteData, setAutoCompleteData] = useState([])
    const [lastDoc, setLastDoc] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [filterDate, setFilterDate] = useState(dayjs(new Date()).toDate())
    const trips = useTrips(companyUID, null, selectedEmployeeUID, null, filterDate, lastDoc, refreshUID, true, dbURL, isLoading, setIsLoading)
    const [fields, setFields] = useState<any[]>([])
    const [fieldCluster, setFieldCluster] = useState<any[]>([])
    const [tabTitles, setTabTitles] = useState([ 'leg a' ])
    const [tabIndex, setTabIndex] = useState({ current: 0, previous: 0 })
    const tripHistory = useTrips(companyUID, null, null, (fields.length > 0 && fields[0].value) ? fields[0].value : null, null, null, refreshUID, true, dbURL)
    const drivers = useEmployees(companyUID, 'driver', null, refreshUID, true, dbURL)
    const clients = useClients(companyUID, trips.map(a => a['71130']), null, refreshUID, true, dbURL, isLoading, setIsLoading, true)

    const popperTrigger = useRef();
    const popperTriggers = useRef([]);
    const [isToolTipOpen, setIsToolTipOpen] = useState(false);
    const [currentTooltip, setCurrentTooltip] = useState('');
    const [toolTipPosition, setToolTipPosition] = useState('bottom')
    const [toolTipTrigger, setToolTipTrigger] = useState<any>()
    const [toolTipData, setToolTipData] = useState()
    const [toolTipName, setToolTipName] = useState('boardSettings')
    const [selectedData, setSelectedData] = useState()
    const [selectedItem, setSelectedItem] = useState()
    const [sortDirection, setSortDirection] = useState('default')
    const [sortSectionUID, setSortSectionUID] = useState('')
    const [modalName, setModalName] = useState('create')
    const [activityField, setActivityField] = useState()
    const [selectedTripInfo, setSelectedTripInfo] = useState<any>(null)
    const [selectedTripUID, setSelectedTripUID] = useState<any>()
    const [modalOptions, setModalOptions] = useState({ employees: drivers, clients: clients, disabilities: [] })
    const activity = useActivity(companyUID, trips.map(a => a['id']), null, null, null, refreshUID, true, dbURL, isLoading, setIsLoading)
    const [isShowingModal, setIsShowingModal] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const statusCounts = summaryStatuses
        .map((status) => ({ status, count: trips.filter((trip: any) => GetTripStatus(GetActivityInfo(activity, trip.id).info.value).tone === status.tone).length }))
        .filter(({ count }) => count > 0)

    useEffect(() => {
        const initialFields = FormData(modalName, null, companySettings).trip
        const isShowingMapCookie = getCookie('isShowingMapView') === 'true' 
        setIsShowingMap(isShowingMapCookie)
        
        setFields(initialFields)        
        setFieldCluster([initialFields])
    }, [ JSON.stringify(companySettings), refreshUID ])

    useEffect(() => {        
        if (fieldCluster[tabIndex.previous]) {          
            // save when tab changes
            fieldCluster[tabIndex.previous] = fields
        }

        if (fieldCluster.length > 0) {
            // reset current field            
            if (fieldCluster[tabIndex.current]) setFields(fieldCluster[tabIndex.current])
        }        
    }, [ tabIndex.current ])

    useEffect(() => {
        // setActivityField(ActivityFormData(modalName, modalName === 'create' ? null : activity, companySettings, selectedTripInfo ? selectedTripInfo.id : null).activity)
    }, [ JSON.stringify(companySettings), modalName, JSON.stringify(activity), selectedTripInfo ])

    useEffect(() => {
        InitializeAutoCompleteData()
    }, [ JSON.stringify(fields) ])

    useEffect(() => {
        // const welcomeAnnouncementWasSeen: boolean = currentUser.hasOwnProperty('seenWelcomeAnnouncement') ? currentUser['seenWelcomeAnnouncement'] : false

        // if (!welcomeAnnouncementWasSeen) {
        //     setIsShowingModal(true)
        //     setModalName('welcome')
        // }

        navigator.geolocation.getCurrentPosition(function(position) {
            setMapSettings({
                lng: position.coords.longitude,
                lat: position.coords.latitude,
                zoom: 15
            })
        });
    }, [])


    async function InitializeAutoCompleteData() {
        let allItems: any = []
        let fieldValue = ''
      
        for (let i = 0; i < fields.length; i++) {
          const theField = fields[i]
      
          if (theField['name'] === '71130' && theField['value']) {
            fieldValue = theField['value']
          }
        }
      
        if (fieldValue) {
            const clientsData = await GetClients([fieldValue], companyUID, null, true, dbURL).catch((err) => console.log('clients error: ', err));   
            allItems.push(...clientsData)
        }

        setAutoCompleteData(allItems)
    }

    function setView(view: PlannerView) {
        setIsShowingMap(view === 'map')
        setCookie('isShowingMapView', (view === 'map').toString())
    }

    function loadMoreData() {
        // LoadMoreItems(employees, setLastDoc)
    }

    const filterDateChanged = (newDate: Date) => {
        setFilterDate(newDate)
        
        // setFilterDate(newDate.toDate())
        reloadData()
    }
    
    const handleModalOpen = (name: string, data: any) => {
        setModalName(name)
        
        if (data) {    
            setFields(FormData(name, data, companySettings).trip)
            setSelectedTripUID(data.id)
        }
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
        if (name === 'filterProfiles') {
            setSelectedEmployeeUID(data)
            handleToolTipClose(false)
        } else if (name === 'visibleHeaders') {
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
        const tableSettingsData = await UpdateTableSettings(tableSettingsUID, dbURL, headerUID, headerTitle, headerIsHidden, allHeaders, []).catch((err) => console.log('table settings error: ', err)); 
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

    function handleTabsItemPressed(name: string) {
        
        if (name === 'add') {
            if (tabTitles.length < 4) {
                tabTitles.push(`leg ${ (tabTitles.length === 1) ? 'b' : (tabTitles.length === 2) ? 'c' : tabTitles.length === 3 ? 'd' : 'e' }`);
                setTabTitles([...tabTitles])

                var initialFields: any = FormData(modalName, null, companySettings).trip
                initialFields = initialFields.filter(function(item: any) {
                    return (item.name !== '71130' && item.name !== '95242' && item.name !== '67300')
                })
                
                fieldCluster.push(initialFields) 
            }
        } else if (name === 'remove') {
            if (tabTitles.length > 1) {
                tabTitles.pop()
                setTabTitles([...tabTitles])

                if (fieldCluster.length > 1) {
                    fieldCluster.pop()
                }

                if (!tabTitles[tabIndex.current] && !fieldCluster[tabIndex.current]) {
                    if (fieldCluster.length > 0) {
                        // reset current field  
                        const newIndex = tabTitles.length - 1  
                        setTabIndex({ current: newIndex, previous: tabIndex.current })
                    }
                }
            }
        }
    }
    
    function saveEntry(e: any, setIsSubmitButtonDisabled: any) {
        e.preventDefault()
    
        // set current fields to cluster
        fieldCluster[tabIndex.current] = fields
        const item = { uid: selectedTripUID, data: fields, data2: fieldCluster }
        
        Save(item, setIsSubmitButtonDisabled, modalName, setModalName, company, trips, companyUID, setIsShowingModal, handleModalClose, reloadData, fields, autoCompleteData, activityField, dbURL)
    }

    function deleteEntry(itemUID: any) {
        Delete(itemUID, dbURL)
    }

    function reloadData() { 
        setModalName('create')
        setSelectedTripUID(null)
        setFields(FormData('create', null, companySettings).trip)
        setFieldCluster([])
        setTabTitles([ 'leg a' ])
        setTabIndex({ current: 0, previous: 0 })
        Reload(setRefreshUID) 
    }
    
    
    return (
        <div className='w-[calc(100%-80px)] ml-20 h-full bg-surface-soft flex flex-row relative'>
            <WorkspaceModal name={ modalName } type={ 0 } isOpen={ isShowingModal } handleClose={ handleModalClose } title={ modalName === 'create' ? 'create trip' : 'edit trip' } currentUser={ currentUser } setRefreshUID={ setRefreshUID } company={ company } companyUID={ companyUID } stripeInfo={ stripeInfo } companySettings={ companySettings } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } setCurrentTooltip={ setCurrentTooltip } dbURL={ dbURL } handleModalOpen={ handleModalOpen } handleToolTipOpen={ handleToolTipOpen }>
                <div>
                    <Tabs tabtitles={ tabTitles } tabIndex={ tabIndex } setTabIndex={ setTabIndex } onPress={ handleTabsItemPressed } modalName={ modalName }>
                        <Form name={ modalName } companyUID={ companyUID } fields={ fields } setFields={ setFields } selectedData={ selectedTripUID } options={ modalOptions } tripHistory={ tripHistory } allDrivers={ drivers } isToolTipOpen={ isToolTipOpen } currentTooltip={ currentTooltip } errorMessage={ ErrorMessage(errorCode).message } submitButtonTitle='Save' onSubmit={ saveEntry } onDelete={ deleteEntry } setIsToolTipOpen={ setIsToolTipOpen } handleToolTipOpen={ handleToolTipOpen } handleToolTipClose={ handleToolTipClose } dbURL={ dbURL } autoCompleteData={ autoCompleteData } setAutoCompleteData={ setAutoCompleteData }/>
                    </Tabs>
                </div>
            </WorkspaceModal>

            <Tooltip name={ toolTipName } currentUser={ currentUser } company={ company } companySettings={ companySettings } profiles={ drivers } isOpen={ isToolTipOpen } trigger={ toolTipTrigger } position={ toolTipPosition } onItemPress={ handleToolTipItemPressed } handleClose={ handleToolTipClose } autoCompleteData={ autoCompleteData } data={ toolTipData }>
                <></>
            </Tooltip>
            
            <WorkspaceNav currentTab='planner' companyUID={ companyUID } isOpen={ isWorkspaceNavOpen } setIsOpen={ setIsWorkspaceNavOpen } companyInfo={ company } handleModalOpen={ handleModalOpen }/>
            <main className='flex h-full min-w-0 grow flex-col'>
                {
                    (!isLoading && IsAccessGranted(company, currentUser) !== 'approved') ?
                        <AccessDenied area='this planner'/>
                    :
                        <>
                            <PlannerHeader company={ company } companySettings={ companySettings } filterDate={ filterDate } dateDidChange={ filterDateChanged } drivers={ drivers } selectedDriverUID={ selectedEmployeeUID } setSelectedDriverUID={ setSelectedEmployeeUID } view={ isShowingMap ? 'map' : 'schedule' } setView={ setView } statusCounts={ statusCounts } tripCount={ trips.length } handleModalOpen={ handleModalOpen } handleToolTipOpen={ handleToolTipOpen }/>

                            <div className='relative min-h-0 grow'>
                                {
                                    (isLoading) ?
                                        (isShowingMap ? <LoadingSpinner label='Loading map…'/> : <ListSkeleton label='Loading trips…'/>)
                                    : (isShowingMap) ?
                                        <MapView companyInfo={ company } mapSettings={ mapSettings } selectedTrip={ selectedTrip } isShowingDropOffLocation={ isShowingDropOffLocation } trips2={ trips } drivers={ drivers }/>
                                    :
                                        <ScheduleContainer companyUID={ companyUID } company={ company } companySettings={ companySettings } trips={ trips } loadMoreData={ loadMoreData } reloadData={ reloadData } popperTrigger={ popperTrigger } popperTriggers={ popperTriggers } selectedData={ selectedData } setSelectedData={ setSelectedData } selectedItem={ selectedItem } sortDirection={ sortDirection } setSortDirection={ setSortDirection } sortSectionUID={ sortSectionUID } setSortSectionUID={ setSortSectionUID } handleModalOpen={ handleModalOpen } clients={ clients } drivers={ drivers } activity={ activity } handleToolTipOpen={ handleToolTipOpen } dbURL={ dbURL }/>
                                }
                            </div>
                        </>
                }
            </main>
        </div>
    )
};


export default Organizer;
