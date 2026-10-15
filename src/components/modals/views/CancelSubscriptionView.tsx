"use client"
import { FC, useState } from 'react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/Button';
import { UpdateSubscription } from '@/helpers/stripe/Stripe';



interface Props {
    company: any
    stripeInfo: any
    onDismiss: (reset: boolean) => void
}

// Confirm cancelling the workspace's subscription (it stops renewing at the end of the period).
const CancelSubscriptionView: FC<Props> = ({ company, stripeInfo, onDismiss }) => {
    const subscription = company?.subscription
    const [isCancelling, setIsCancelling] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    async function cancelSubscription() {
        setIsCancelling(true)
        setErrorMessage('')

        try {
            // The cancel call has always sent a null subscription item
            await UpdateSubscription(subscription.id, null as any, 'cancel', true, stripeInfo.baseURL)
            onDismiss(true)
        } catch (err) {
            console.log('subscription error: ', err)
            setErrorMessage('We couldn’t cancel your subscription. Please try again.')
            setIsCancelling(false)
        }
    }

    return (
        <div>
            <p className='text-[15px] text-ink-700'>
                Are you sure you want to cancel this workspace’s subscription?
                { subscription?.current_period_end && <> It stays active until <span className='font-semibold text-ink-900'>{ dayjs(subscription.current_period_end * 1000).format('MMMM D, YYYY') }</span> and won’t renew after that.</> }
            </p>

            { errorMessage && <p role='alert' className='mt-4 rounded-[var(--radius-button)] bg-status-danger-soft px-3 py-2 text-sm text-ink-900'>{ errorMessage }</p> }

            <div className='mt-6 flex justify-end gap-2'>
                <Button variant='secondary' onClick={ () => onDismiss(false) } className='h-10 px-4'>Keep subscription</Button>
                <Button variant='danger' onClick={ cancelSubscription } isLoading={ isCancelling } disabled={ isCancelling || !subscription } className='h-10 px-5 font-semibold'>
                    Cancel subscription
                </Button>
            </div>
        </div>
    )
}


export default CancelSubscriptionView;
