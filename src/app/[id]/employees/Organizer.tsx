"use client"
import { FC, useState, useRef, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UpdateEmployee } from '@/helpers/database/Employees';
import { UpdateTableSettings } from '@/helpers/database/CompanySettings';
import { useCompany } from '@/hooks/useCompany';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import useEmployees from '@/hooks/useEmployees';
import useClients from '@/hooks/useClients';
import useTrips from '@/hooks/useTrips';
import { useActivity } from '@/hooks/useActivity';
import WorkspaceModal from '@/components/modals/WorkspaceModal';
import Tooltip from '@/components/tooltips/Tooltip';
import WorkspaceNav from '@/app/[id]/_components/WorkspaceNav';
import WorkspacePageHeader, { ColumnsButton } from '@/app/[id]/_components/WorkspacePageHeader';
import { AccessDenied, EmptyState } from '@/app/[id]/_components/WorkspaceStates';
import ListSkeleton from '@/components/ui/loading/ListSkeleton';
import Form from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import List from '@/components/list/List';
import { IsAccessGranted } from '@/lib/workspace/access';
import SortListData from '@/lib/tables/sortRows';
import { HeaderTitles } from '@/lib/tables/columns';

import EmployeeCell from './_components/EmployeeCell';
import LinkAccountMenu from './_components/LinkAccountMenu';
import { FormData, Save, Delete, ErrorMessage, Reload } from './_utils/Actions';



interface Props {
    companyUID: string
}

const Organizer: FC<Props> = ({ companyUID }) => {
    const { currentUser, stripeInfo, dbURL } = useAuth()
    const [isWorkspaceNavOpen, setIsWorkspaceNavOpen] = useState(true)
    const [refreshUID, setRefreshUID] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [lastDoc, setLastDoc] = useState()
    const [selectedEmployeeUID, setSelectedEmployeeUID] = useState<any>()
    const employees = useEmployees(companyUID, null, lastDoc, refreshUID, true, dbURL, isLoading, setIsLoading)
    const trips = useTrips(companyUID, null, selectedEmployeeUID, null, null, null, refreshUID, true, dbURL, isLoading, setIsLoading)
    const activity = useActivity(trips.map(a => a['id']), null, null, null, refreshUID, true, dbURL, isLoading, setIsLoading)
    const clients = useClients(companyUID, trips.map(a => a['71130']), null, refreshUID, true, dbURL, isLoading, setIsLoading, true)
    const [selectedEmployeeInfo, setSelectedEmployeeInfo] = useState(null)
    
    const company: any = useCompany(companyUID, stripeInfo, true, refreshUID, dbURL)
    const companySettings: any = useCompanySettings(companyUID, 'employees', refreshUID, true, dbURL)
    const popperTrigger = useRef();
    const popperTriggers = useRef([]);
    const [fields, setFields] = useState<any[]>([])
    const [isToolTipOpen, setIsToolTipOpen] = useState(false);
    const [currentTooltip, setCurrentTooltip] = useState('');
    const [toolTipPosition, setToolTipPosition] = useState('bottom')
    const [toolTipName, setToolTipName] = useState('boardSettings')
    const [toolTipData, setToolTipData] = useState()
    const [toolTipTrigger, setToolTipTrigger] = useState<any>()
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
    const [errorCode, setErrorCode] = useState(0)



    useEffect(() => {
        setFields(FormData(modalName, null, companySettings).employee)
    }, [ JSON.stringify(companySettings), refreshUID ])


    const handleModalOpen = (name: string, data?: any) => {
        setModalName(name)
   
        if (data) {
            setFields(FormData(name, data, companySettings).employee)
            setSelectedEmployeeUID(data.id)
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
        } else if (name === 'linkAccount-add') {
            updateAssignedUsers('add', data)
        } else if (name === 'linkAccount-remove') {
            updateAssignedUsers('remove', data)
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

    async function updateAssignedUsers(type: string, data: any) {
        let newValue = ''

        if (type === 'add') {
            newValue = data.userUID
        }
        
        await UpdateEmployee(data.employeeUID, dbURL, 'userUID', newValue)
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
        Delete(itemUID, handleModalClose, dbURL)
    }

    function cellPressed(e: any, name: string, item: any, columnIndex: number, rowIndex: number, isUsingModal: boolean) {
        if (isUsingModal) {
          handleModalOpen(name, item)
        } else {
          handleToolTipOpen(name, e, item)
        }
    }

    function loadMoreData() { 
        // LoadMoreItems(employees, setLastDoc)
    }

    function reloadData() { 
        setModalName('create')
        setSelectedEmployeeUID(null)
        setFields(FormData('create', null, companySettings).employee)
        Reload(setRefreshUID) 
    }
    
    return (
        <div className='w-[calc(100%-80px)] ml-20 h-full bg-surface-soft flex flex-row relative'>
            <WorkspaceModal name={ modalName } type={ 0 } isOpen={ isShowingModal } handleClose={ handleModalClose } title={ modalName === 'create' ? 'create employee' : 'edit employee' } currentUser={ currentUser } setRefreshUID={ setRefreshUID } company={ company } companyUID={ companyUID } stripeInfo={ stripeInfo } companySettings={ companySettings } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } setCurrentTooltip={ setCurrentTooltip } dbURL={ dbURL } handleModalOpen={ handleModalOpen } handleToolTipOpen={ handleToolTipOpen }>
                <div>
                    <Form name={ modalName } fields={ fields } setFields={ setFields } selectedData={ selectedEmployeeInfo } options={ modalOptions } tripHistory={ [] } autoCompleteData={ autoCompleteData } isToolTipOpen={ isToolTipOpen } currentTooltip={ currentTooltip } errorMessage={ ErrorMessage(errorCode).message } submitButtonTitle='Save' onSubmit={ saveEntry } onDelete={ deleteEntry }/>
                </div>
            </WorkspaceModal>

            <Tooltip name={ toolTipName } currentUser={ currentUser } company={ company } companySettings={ companySettings } profiles={ [] } isOpen={ isToolTipOpen } trigger={ toolTipTrigger } position={ toolTipPosition } onItemPress={ handleToolTipItemPressed } handleClose={ handleToolTipClose } autoCompleteData={ autoCompleteData } data={ toolTipData }>
                <LinkAccountMenu name={ toolTipName } data={ toolTipData } supportingData={ { items: company ? company.allActiveRoles : [], allItems: employees } } onPress={ handleToolTipItemPressed }/>
            </Tooltip>

            <WorkspaceNav currentTab='employees' companyUID={ companyUID } isOpen={ isWorkspaceNavOpen } setIsOpen={ setIsWorkspaceNavOpen } companyInfo={ company } handleModalOpen={ handleModalOpen }/>

            <main className='flex h-full min-w-0 grow flex-col'>
                {
                    (!isLoading && IsAccessGranted(company, currentUser) === 'rejected') ?
                        <AccessDenied area='this workspace’s employees'/>
                    :
                        <>
                            <WorkspacePageHeader
                                title='Employees'
                                subtitle={ isLoading ? 'Your team of drivers and staff' : `${employees.length} ${employees.length === 1 ? 'employee' : 'employees'}` }
                                primaryLabel='New employee'
                                onPrimary={ () => handleModalOpen('create') }
                                memberCount={ company?.allActiveRoles?.length ?? 0 }
                                handleModalOpen={ handleModalOpen }
                                handleToolTipOpen={ handleToolTipOpen }>
                                <ColumnsButton companySettings={ companySettings } handleToolTipOpen={ handleToolTipOpen }/>
                            </WorkspacePageHeader>

                            <div className='relative min-h-0 grow'>
                                {
                                    (isLoading) ?
                                        <ListSkeleton label='Loading employees…' showAvatar/>
                                    : (IsAccessGranted(company, currentUser) !== 'approved') ?
                                        <></>
                                    : (employees.length === 0) ?
                                        <EmptyState
                                            icon={ <Users aria-hidden="true" strokeWidth={1.75}/> }
                                            title='No employees yet'
                                            description='Add your drivers and staff so you can assign them to trips.'
                                            action={
                                                <Button variant='primary' onClick={ () => handleModalOpen('create') } className='h-10 px-4 font-semibold'>
                                                    New employee
                                                </Button>
                                            }/>
                                    :
                                        // List pads itself 50px per side; [&>div]:!px-8 lines the table up with the header above it.
                                        <div className='h-full overflow-auto pt-4 [&>div]:!px-8'>
                                            <List name='employees' data={ employees } loadMoreData={ loadMoreData } companyInfo={ company } companySettings={ companySettings } showHeaders={ true } reloadData={ reloadData } popperTrigger={ popperTrigger } popperTriggers={ popperTriggers } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } selectedData={ selectedData } setSelectedData={ setSelectedData } selectedItem={ selectedItem } sortDirection2={ sortDirection } setSortDirection2={ setSortDirection } sortSectionUID2={ sortSectionUID } setSortSectionUID2={ setSortSectionUID } boardUID={ companyUID } itemSpecs={ itemSpecs } setItemSpecs={ setItemSpecs } handleToolTipOpen={ handleToolTipOpen } dbURL={ dbURL }>
                                                {
                                                    SortListData(employees, sortSectionUID, sortDirection).map((item: any, i: any) => (
                                                        <EmployeeCell key={ item.id } index={ i } name='employees' item={ item } allClients={ clients } allEmployees={ employees } showHeaders={ true } headerTitles={ HeaderTitles(companySettings, true) } allUsers={ clients } itemSpecs={ itemSpecs } onPress={ cellPressed }/>
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
