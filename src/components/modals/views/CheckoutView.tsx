"use client"
import { FC, FormEvent, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';



interface OrderProps {
    plan: any
    isMonthlyPayment: boolean
    seats: number
}

// Stripe payment form plus the order summary.
const CheckoutForm: FC<OrderProps> = ({ plan, isMonthlyPayment, seats }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [isPaying, setIsPaying] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const perMonth = plan.price * seats
    const total = perMonth * (isMonthlyPayment ? 1 : 12)

    async function submit(event: FormEvent) {
        event.preventDefault()
        if (!stripe || !elements) return

        setIsPaying(true)
        setErrorMessage(null)

        // On success Stripe redirects to return_url; we only get here if something went wrong.
        const { error } = await stripe.confirmPayment({ elements, confirmParams: { return_url: 'https://www.usezenpath.com/' } })
        if (error) setErrorMessage(error.message || 'Payment failed. Please check your details and try again.')

        setIsPaying(false)
    }

    return (
        <form onSubmit={ submit } className='grid gap-6 md:grid-cols-[1fr_300px]'>
            <div>
                <PaymentElement/>
            </div>

            <aside className='h-fit rounded-[var(--radius-card)] border border-line bg-surface-soft p-5'>
                <h3 className='text-sm font-semibold uppercase tracking-wide text-ink-500'>Order summary</h3>
                <dl className='mt-3 space-y-2 text-sm'>
                    <div className='flex justify-between gap-3'>
                        <dt className='text-ink-700'>{ plan.title } plan · { seats } { seats === 1 ? 'seat' : 'seats' }</dt>
                        <dd className='tabular-nums text-ink-900'>${ perMonth.toLocaleString() }/mo</dd>
                    </div>
                    {
                        !isMonthlyPayment &&
                            <div className='flex justify-between gap-3'>
                                <dt className='text-ink-700'>Billed yearly</dt>
                                <dd className='tabular-nums text-ink-900'>× 12 months</dd>
                            </div>
                    }
                    <div className='flex justify-between gap-3 border-t border-line pt-2 text-base font-semibold'>
                        <dt className='text-ink-900'>Total today</dt>
                        <dd className='tabular-nums text-ink-900'>${ total.toLocaleString() }</dd>
                    </div>
                </dl>

                <Button type='submit' variant='primary' isLoading={ isPaying } disabled={ !stripe || isPaying } className='mt-5 h-11 w-full font-semibold'>
                    Subscribe
                </Button>
                { errorMessage && <p role='alert' className='mt-3 text-sm text-status-danger'>{ errorMessage }</p> }

                <p className='mt-4 flex items-center gap-2 text-xs text-ink-500'>
                    <ShieldCheck aria-hidden="true" className='h-4 w-4 shrink-0 text-brand-700'/>
                    Prorated money-back guarantee
                </p>
            </aside>
        </form>
    )
}

interface Props extends OrderProps {
    stripeInfo: any
    clientSecret: string
}

// No way back to the plan list from here: the Stripe subscription already exists at this point,
// and continuing again would create another one.
const CheckoutView: FC<Props> = ({ stripeInfo, clientSecret, plan, isMonthlyPayment, seats }) => {
    const stripePromise = useMemo(() => loadStripe(stripeInfo.pubKey), [stripeInfo.pubKey])
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
            variables: { colorPrimary: '#0FA978', colorText: '#101A33', colorDanger: '#D94667', borderRadius: '10px', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' },
        },
    }

    return (
        <Elements stripe={ stripePromise } options={ options }>
            <CheckoutForm plan={ plan } isMonthlyPayment={ isMonthlyPayment } seats={ seats }/>
        </Elements>
    )
}


export default CheckoutView;
