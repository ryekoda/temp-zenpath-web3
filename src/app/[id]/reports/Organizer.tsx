"use client"
import { FC, useState } from 'react';
import dayjs from 'dayjs';
import { FileText, Lock, Printer } from 'lucide-react';
import { UpdateTableSettings } from '@/helpers/database/CompanySettings';
import WorkspaceNav from '@/app/[id]/_components/WorkspaceNav';
import WorkspacePageHeader, { ColumnsButton } from '@/app/[id]/_components/WorkspacePageHeader';
import { DateNavigator, DriverFilter, ToolbarDivider } from '@/app/[id]/_components/WorkspaceFilters';
import { AccessDenied, EmptyState } from '@/app/[id]/_components/WorkspaceStates';
import ListSkeleton from '@/components/ui/loading/ListSkeleton';
import Tooltip from '@/components/tooltips/Tooltip';
import WorkspaceModal from '@/components/modals/WorkspaceModal';
import { Button } from '@/components/ui/Button';
import { IsAccessGranted } from '@/lib/workspace/access';
import { SubscriptionStatus } from '@/lib/billing/plans';
import { useReportOrganizerData } from './_hooks/useReportOrganizerData';
import ReportRow from './_components/ReportRow';
import ReportPrintHeader from './_components/ReportPrintHeader';
import { NAME_COLUMN, ReportColumnStyle } from './_utils/reportColumns';
import { SortByPickupTime } from './_utils/sortByPickupTime';



// This workspace has reports without a Standard plan.
const REPORTS_ALWAYS_ON_COMPANY_UID = 'Mf21IpttifgYXMDz2Sbp'

interface Props {
    companyUID: string
}

const Organizer: FC<Props> = ({ companyUID }) => {
    const { state, actions } = useReportOrganizerData(companyUID)
    const { company, currentUser, companySettings, drivers, clients, filterDate, selectedDriverUID, activeHeaders } = state
    const trips = state.trips || []
    const dbURL = state.dbURL || ''

    const [isWorkspaceNavOpen, setIsWorkspaceNavOpen] = useState(true)
    const [isToolTipOpen, setIsToolTipOpen] = useState(false)
    const [currentTooltip, setCurrentTooltip] = useState('')
    const [toolTipPosition, setToolTipPosition] = useState('bottom')
    const [toolTipTrigger, setToolTipTrigger] = useState<any>()
    const [toolTipName, setToolTipName] = useState('boardSettings')
    const [modalName, setModalName] = useState('create')
    const [isShowingModal, setIsShowingModal] = useState(false)

    const isLocked = company && company.id !== REPORTS_ALWAYS_ON_COMPANY_UID && !SubscriptionStatus(company, 'standard').isFeatureAvailable
    const columns = activeHeaders.filter((header: any) => !header.isHidden)

    function reloadData() {
        actions.setRefreshUID(Date.now())
    }

    const handleModalOpen = (name: string) => {
        setModalName(name)
        setIsShowingModal(true)
        setIsToolTipOpen(false)
    }

    const handleModalClose = (reset: boolean) => {
        setIsShowingModal(false)
        if (reset) reloadData()
    }

    const handleToolTipOpen = (name: string, e: any) => {
        setToolTipName(name)
        setToolTipTrigger(e.target)
        setIsToolTipOpen(true)
        setToolTipPosition(name === 'boardSettings' ? 'bottom-end' : 'bottom')
    }

    const handleToolTipClose = () => {
        setToolTipTrigger(null)
        setIsToolTipOpen(false)
    }

    const handleToolTipItemPressed = (name: string, data: any) => {
        if (name === 'filterProfiles') {
            actions.setSelectedDriverUID(data)
            handleToolTipClose()
        } else if (name === 'visibleHeaders') {
            if (companySettings) updateVisibleHeaders(data)
        } else {
            handleModalOpen(name)
        }
    }

    async function updateVisibleHeaders(header: any) {
        await UpdateTableSettings(companySettings.id, dbURL, header.uid, header.title, header.isHidden, companySettings.headers, null)
            .catch((err) => console.error('table settings error: ', err))
        reloadData()
    }

    function dateDidChange(newDate: Date) {
        actions.setFilterDate(newDate)
        reloadData()
    }

    return (
        <div className='w-[calc(100%-80px)] ml-20 h-full bg-surface-soft flex flex-row relative print:ml-0 print:w-full print:bg-white'>
            <WorkspaceModal name={ modalName } type={ 0 } isOpen={ isShowingModal } handleClose={ handleModalClose } currentUser={ currentUser } setRefreshUID={ actions.setRefreshUID } company={ company } companyUID={ companyUID } stripeInfo={ state.stripeInfo } companySettings={ companySettings } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } setCurrentTooltip={ setCurrentTooltip } dbURL={ dbURL } handleModalOpen={ handleModalOpen } handleToolTipOpen={ handleToolTipOpen }/>

            <Tooltip name={ toolTipName } currentUser={ currentUser } company={ company } companySettings={ companySettings } profiles={ drivers } isOpen={ isToolTipOpen } trigger={ toolTipTrigger } position={ toolTipPosition } onItemPress={ handleToolTipItemPressed } handleClose={ handleToolTipClose } autoCompleteData={ [] } data={ null }>
                <></>
            </Tooltip>

            <WorkspaceNav currentTab='reports' companyUID={ companyUID } isOpen={ isWorkspaceNavOpen } setIsOpen={ setIsWorkspaceNavOpen } companyInfo={ company } handleModalOpen={ handleModalOpen }/>

            <main className='flex h-full min-w-0 grow flex-col print:h-auto'>
                {
                    (!state.isLoading && IsAccessGranted(company, currentUser) !== 'approved') ?
                        <AccessDenied area='reports'/>
                    :
                        <>
                            <WorkspacePageHeader
                                title='Reports'
                                subtitle={ `Driver manifest for ${dayjs(filterDate).format('dddd, MMMM D, YYYY')}` }
                                primaryLabel='Print manifest'
                                primaryIcon={ <Printer aria-hidden="true" className='h-4 w-4'/> }
                                primaryVariant='secondary'
                                onPrimary={ () => window.print() }
                                memberCount={ company?.allActiveRoles?.length ?? 0 }
                                handleModalOpen={ handleModalOpen }
                                handleToolTipOpen={ handleToolTipOpen }
                                footer={
                                    !state.isLoading && !isLocked &&
                                        <span className='text-sm font-medium text-ink-900' aria-live='polite'>
                                            { trips.length } { trips.length === 1 ? 'trip' : 'trips' } on this manifest
                                        </span>
                                }>
                                <DateNavigator date={ filterDate } onChange={ dateDidChange }/>
                                <ToolbarDivider/>
                                <DriverFilter drivers={ drivers } selectedDriverUID={ selectedDriverUID } setSelectedDriverUID={ actions.setSelectedDriverUID } handleToolTipOpen={ handleToolTipOpen }/>
                                <ColumnsButton companySettings={ companySettings } handleToolTipOpen={ handleToolTipOpen }/>
                            </WorkspacePageHeader>

                            <div className='relative min-h-0 grow overflow-auto px-8 py-4 print:overflow-visible print:p-0'>
                                <ReportPrintHeader company={ company } drivers={ drivers } selectedDriverUID={ selectedDriverUID } filterDate={ filterDate }/>

                                {
                                    (state.isLoading) ?
                                        <ListSkeleton label='Loading manifest…' className='px-0 pt-0'/>
                                    : (isLocked) ?
                                        <EmptyState
                                            icon={ <Lock aria-hidden="true" strokeWidth={1.75}/> }
                                            title='Reports are on the Standard plan'
                                            description='Upgrade this workspace to view and print daily driver manifests.'
                                            action={
                                                <Button variant='primary' onClick={ () => handleModalOpen('pricing') } className='h-10 px-4 font-semibold'>
                                                    View plans
                                                </Button>
                                            }/>
                                    : (trips.length === 0) ?
                                        <EmptyState
                                            icon={ <FileText aria-hidden="true" strokeWidth={1.75}/> }
                                            title='No trips on this manifest'
                                            description={ selectedDriverUID ? 'This driver has no trips on this day. Try another date or driver.' : 'No trips are scheduled for this day. Try another date.' }/>
                                    :
                                        <div className='min-w-[720px]'>
                                            <div className='flex pb-1 text-xs font-semibold uppercase tracking-wide text-ink-500 print:border-b print:border-ink-400 print:text-ink-900'>
                                                {
                                                    columns.map((header: any) => (
                                                        <div key={ header.uid } className={ header.uid === NAME_COLUMN ? 'truncate pl-4 pr-3' : 'truncate px-3 text-center' } style={ ReportColumnStyle(header) }>
                                                            { header.title }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            {
                                                SortByPickupTime(trips).map((item: any, i: number) => (
                                                    <ReportRow key={ item.id || i } item={ item } columns={ columns } clients={ clients } drivers={ drivers }/>
                                                ))
                                            }
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
