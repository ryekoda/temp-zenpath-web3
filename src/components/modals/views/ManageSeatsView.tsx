"use client"
import { FC, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { labelClassName, selectClassName } from '@/components/ui/input/fieldStyles';
import { UpdateSubscription } from '@/helpers/stripe/Stripe';
import { GetTeamSizeOptions } from '@/lib/billing/plans';



interface Props {
    company: any
    stripeInfo: any
    onDismiss: (reset: boolean) => void
}

// Change how many seats the workspace pays for.
const ManageSeatsView: FC<Props> = ({ company, stripeInfo, onDismiss }) => {
    const subscription = company?.subscription
    const [seats, setSeats] = useState<number>(subscription?.quantity ?? 3)
    const [isSaving, setIsSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    if (!subscription) {
        return <p className='text-sm text-ink-500'>This workspace doesn’t have a paid plan, so there are no seats to change.</p>
    }

    const pricePerSeat = subscription.plan.amount / 100
    const options = GetTeamSizeOptions()
    const hasCurrentSize = options.some((option: any) => option.value === subscription.quantity)

    async function save() {
        setIsSaving(true)
        setErrorMessage('')

        try {
            await UpdateSubscription(subscription.id, subscription.items.data[0].id, 'seats', seats, stripeInfo.baseURL)
            onDismiss(true)
        } catch (err) {
            console.log('subscription error: ', err)
            setErrorMessage('We couldn’t update your seats. Please try again.')
            setIsSaving(false)
        }
    }

    return (
        <div>
            <p className='text-sm text-ink-700'>You’re paying for <span className='font-semibold'>{ subscription.quantity } seats</span>. Each person you invite uses one seat.</p>

            <div className='mt-5'>
                <label htmlFor='seat-count' className={ labelClassName }>Team size</label>
                <select id='seat-count' value={ seats } onChange={ (e) => setSeats(Number(e.target.value)) } className={ selectClassName }>
                    { !hasCurrentSize && <option value={ subscription.quantity }>{ subscription.quantity } seats</option> }
                    { options.map((option: any) => <option key={ option.value } value={ option.value }>{ option.label } seats</option>) }
                </select>
                <p className='mt-2 text-sm text-ink-500'>
                    New total: <span className='font-semibold text-ink-900'>${ (pricePerSeat * seats).toLocaleString() }</span> per { subscription.plan.interval }
                </p>
            </div>

            { errorMessage && <p role='alert' className='mt-4 rounded-[var(--radius-button)] bg-status-danger-soft px-3 py-2 text-sm text-ink-900'>{ errorMessage }</p> }

            <div className='mt-6 flex justify-end gap-2'>
                <Button variant='secondary' onClick={ () => onDismiss(false) } className='h-10 px-4'>Cancel</Button>
                <Button variant='primary' onClick={ save } isLoading={ isSaving } disabled={ isSaving || seats === subscription.quantity } className='h-10 px-5 font-semibold'>
                    Save seats
                </Button>
            </div>
        </div>
    )
}


export default ManageSeatsView;
