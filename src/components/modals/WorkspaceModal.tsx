"use client"
import { FC, ReactNode, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { CapitalizeFirstLetter } from '@/lib/format/text';
import ModalShell from './ModalShell';
import FeedbackView from './views/FeedbackView';
import InviteView from './views/InviteView';
import BillingView from './views/BillingView';
import ChoosePlanView from './views/ChoosePlanView';
import ManageSeatsView from './views/ManageSeatsView';
import CancelSubscriptionView from './views/CancelSubscriptionView';
import DeleteWorkspaceView from './views/DeleteWorkspaceView';
import WelcomeView from './views/WelcomeView';



// Title, description and width of each modal the workspace pages open by name.
// 'create' and 'edit' show the page's own form (children) under the title the page passes in.
const modals: Record<string, { title: string, description?: string, maxWidth: DialogProps['maxWidth'] }> = {
    feedback: { title: 'Give feedback', description: 'Tell us what’s working and what isn’t.', maxWidth: 'md' },
    invite: { title: 'Workspace members', description: 'Invite people and choose what they can do.', maxWidth: 'sm' },
    pricing: { title: 'Choose a plan', description: 'Pick a plan and team size. You can change seats later.', maxWidth: 'lg' },
    billing: { title: 'Billing', description: 'Your plan and payment method.', maxWidth: 'sm' },
    manageSeats: { title: 'Change seats', maxWidth: 'xs' },
    deleteSubscription: { title: 'Cancel subscription', maxWidth: 'xs' },
    deleteBoard: { title: 'Delete workspace', maxWidth: 'xs' },
    welcome: { title: 'Welcome', maxWidth: 'sm' },
}

interface Props {
    children?: ReactNode
    name: string
    type?: any
    isOpen: boolean
    handleClose: (reset: boolean) => void
    // Title for the 'create' / 'edit' form modals
    title?: string
    // Width for the 'create' / 'edit' form modals (default 'sm')
    maxWidth?: DialogProps['maxWidth']
    currentUser?: any
    setRefreshUID?: any
    company?: any
    companyUID?: any
    stripeInfo?: any
    companySettings?: any
    isToolTipOpen?: any
    setIsToolTipOpen?: any
    setCurrentTooltip?: any
    dbURL?: string
    // Lets one modal open another (e.g. Billing → Choose a plan)
    handleModalOpen: (name: string, data?: any) => void
    handleToolTipOpen?: any
    // Clients only: the trip history view inside the edit modal
    isModalOptionsShowing?: boolean
    handleModalOption?: (name: string, isShowing: boolean) => void
}

// The one modal each workspace page renders; `name` picks what it shows.
const WorkspaceModal: FC<Props> = ({ children, name, isOpen, handleClose, title, maxWidth, currentUser, setRefreshUID, company, companyUID, stripeInfo, dbURL, handleModalOpen, isModalOptionsShowing, handleModalOption }) => {
    const [isShowingCheckout, setIsShowingCheckout] = useState(false)

    const isForm = !modals[name]
    const config = modals[name] || { title: CapitalizeFirstLetter(title || ''), maxWidth: maxWidth || 'sm' }
    const formTitle = isModalOptionsShowing ? 'Trip history' : config.title

    function close(reset: boolean) {
        setIsShowingCheckout(false)
        handleClose(reset)
    }

    return (
        <ModalShell
            isOpen={ isOpen }
            // Closing reloads the page's data, as it always has (saves inside the modal rely on it).
            onClose={ () => close(true) }
            title={ isForm ? formTitle : name === 'pricing' && isShowingCheckout ? 'Checkout' : config.title }
            description={ isForm || (name === 'pricing' && isShowingCheckout) ? undefined : config.description }
            maxWidth={ isModalOptionsShowing ? 'lg' : config.maxWidth }
            onBack={ isModalOptionsShowing && handleModalOption ? () => handleModalOption('history', false) : undefined }>
            {
                name === 'feedback' ?
                    <FeedbackView/>
                : name === 'invite' ?
                    <InviteView userInfo={ currentUser } company={ company } setRefreshUID={ setRefreshUID } dbURL={ dbURL! }/>
                : name === 'pricing' ?
                    <ChoosePlanView userInfo={ currentUser } stripeInfo={ stripeInfo } isShowingCheckout={ isShowingCheckout } setIsShowingCheckout={ setIsShowingCheckout } boardUID={ companyUID } company={ company } onDismiss={ close } dbURL={ dbURL }/>
                : name === 'billing' ?
                    <BillingView stripeInfo={ stripeInfo } company={ company } handleModalOpen={ handleModalOpen }/>
                : name === 'manageSeats' ?
                    <ManageSeatsView company={ company } stripeInfo={ stripeInfo } onDismiss={ close }/>
                : name === 'deleteSubscription' ?
                    <CancelSubscriptionView company={ company } stripeInfo={ stripeInfo } onDismiss={ close }/>
                : name === 'deleteBoard' ?
                    <DeleteWorkspaceView company={ company } onDismiss={ close }/>
                : name === 'welcome' ?
                    <WelcomeView handleClose={ close }/>
                :
                    children
            }
        </ModalShell>
    )
};


export default WorkspaceModal;
