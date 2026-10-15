"use client"
import { FC, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@/components/ui/Button';
import { cn, CapitalizeFirstLetterOfEachWord } from '@/lib/Utils';
import { DeleteBoard_Container, ManageSeats_Container, CancelSubscription_Container } from './subViews/Modal_Containers';
import Feedback_Container from './subViews/Feedback';
import Invite_Container from './subViews/Invite';
import Billing_Container from './subViews/Billing';
import Pricing_Container from './subViews/Pricing';
import Welcome_Container from './subViews/Welcome';
import { GetTitles } from './Actions';



interface Props {
    children?: React.ReactNode;
    name: string
    type: any
    isOpen: boolean
    handleClose: any
    title?: string
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
    handleModalOpen?: any
    handleToolTipOpen?: any
    isModalOptionsShowing?: any
    handleModalOption?: any
}

const Modal: React.FC<Props> = ({ children, name, type, isOpen, handleClose, title, currentUser, setRefreshUID, company, companyUID, stripeInfo, companySettings, isToolTipOpen, setIsToolTipOpen, setCurrentTooltip, dbURL, handleModalOpen, handleToolTipOpen, isModalOptionsShowing, handleModalOption }) => {
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm');
    const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
    const descriptionElementRef = useRef<HTMLElement>(null);
    const [autoCompleteData, setAutoCompleteData] = useState([])
    const [selectedAutoCompleteValue, setSelectedAutoCompleteValue] = useState('')
    const [isShowingCheckout, setIsShowingCheckout] = useState(false)



    useEffect(() => {
        if (name === 'pricing' || name === 'billing' || name === 'import') {
            setMaxWidth('xl')
        } else if (name === 'feedback') {
            setMaxWidth('lg')
        } else {
            setMaxWidth('sm')
        }
    }, [ name ]);

    useEffect(() => {
      if (isOpen) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }
    }, [isOpen]);


    return (
        <Dialog open={ isOpen } onClose={ handleClose } scroll={scroll} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description" fullWidth={fullWidth}
        maxWidth={maxWidth}>
            <DialogTitle className='flex flex-row justify-between' id="scroll-dialog-title">
                {
                    (isModalOptionsShowing) &&
                        <Button variant='ghost' onClick={ () => handleModalOption('history', false) } className={cn('w-fit', 'className')}>
                            <Image src="/images/ArrowRight.png" alt="back icon" width={15} height={15} className='rotate-180'/>
                        </Button>
                }

                { name === 'create' || name === 'edit' ? CapitalizeFirstLetterOfEachWord(title ? title : '') : CapitalizeFirstLetterOfEachWord(GetTitles(name).title) }
                <Button variant='ghost' onClick={ () => handleClose(true) } className={cn('w-fit ml-auto', 'className')}>
                    <Image src="/images/close.png" alt="close icon" width={15} height={15}/>
                </Button>
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
                    <div>
                        {
                            name === 'feedback' ?
                                <Feedback_Container/>
                            : name === 'invite' ?
                                <Invite_Container userInfo={ currentUser } company={ company } setRefreshUID={ setRefreshUID } dbURL={ dbURL! }/>
                            : name === 'pricing' ?
                                <Pricing_Container userInfo={ currentUser } stripeInfo={ stripeInfo } isShowingCheckout={ isShowingCheckout } setIsShowingCheckout={ setIsShowingCheckout } boardUID={ companyUID } company={ company } onDismiss={ handleClose } dbURL={ dbURL }/>
                            : name === 'billing' ?
                                <Billing_Container userInfo={ currentUser } stripeInfo={ stripeInfo } company={ company } isShowingCheckout={ isShowingCheckout } setIsShowingCheckout={ setIsShowingCheckout } boardUID={ companyUID } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } setCurrentTooltip={ setCurrentTooltip } handleModalOpen={ handleModalOpen } handleToolTipOpen={ handleToolTipOpen }/>
                            : name === 'deleteBoard' ?
                                <DeleteBoard_Container company={ company } onDismiss={ handleClose } history={ history }/>
                            : name === 'import' ?
                            <>
                                {/* <Import_Container companySettings={ companySettings }/> */}
                                </>
                            : name === 'manageSeats' ?
                                <ManageSeats_Container company={ company } stripeInfo={ stripeInfo } onDismiss={ handleClose }/>
                            : name === 'deleteSubscription' ?
                                <CancelSubscription_Container company={ company } stripeInfo={ stripeInfo } onDismiss={ handleClose }/>
                            : name === 'welcome' ?
                                <Welcome_Container handleClose={ handleClose }/>
                            : name === 'announcement' ?
                                <></>
                            :
                                <div>
                                    {
                                        (type === 0) &&
                                            <div>
                                                { children }
                                            </div>
                                    }
                                </div>
                        }
                    </div>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
};


export default Modal;
