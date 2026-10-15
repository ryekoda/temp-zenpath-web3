"use client"
import { FC, ReactNode, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { CreditCard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GetPaymentMethod } from '@/helpers/stripe/Stripe';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import { GetPlans } from '@/lib/billing/plans';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';



// Stripe products sold as the Basic plan before plan prices were tracked in GetPlans
const LEGACY_BASIC_PRODUCTS = ['prod_LqdmZoEun67EcL', 'prod_MGXTFMyk9JMFbN']

// Name of the plan a subscription is on, from its Stripe price.
function GetPlanTitle(subscription: any, isLive: boolean) {
    const priceUID = subscription?.plan?.id
    const plan = [...GetPlans(true, isLive), ...GetPlans(false, isLive)].find((p: any) => p.planUID && p.planUID === priceUID)

    if (plan) return plan.title
    if (LEGACY_BASIC_PRODUCTS.includes(subscription?.plan?.product)) return 'Basic'
    return 'Paid'
}

const Card: FC<{ title: string, children: ReactNode }> = ({ title, children }) => (
    <section className='rounded-[var(--radius-card)] border border-line p-5'>
        <h3 className='text-sm font-semibold uppercase tracking-wide text-ink-500'>{ title }</h3>
        <div className='mt-3'>{ children }</div>
    </section>
)

interface Props {
    stripeInfo: any
    company: any
    handleModalOpen: (name: string) => void
}

// The workspace's plan and payment method.
const BillingView: FC<Props> = ({ stripeInfo, company, handleModalOpen }) => {
    const subscription = company?.subscription
    const isActive = subscription && subscription.status === 'active'
    const [card, setCard] = useState<any>()
    const [isLoading, setIsLoading] = useState(Boolean(isActive))

    useEffect(() => {
        if (!isActive) return

        (async () => {
            try {
                const paymentMethod = await GetPaymentMethod(subscription['default_payment_method'], stripeInfo.baseURL)
                setCard(paymentMethod?.card)
            } catch (err) {
                console.log('payment method error: ', err)
            }
            setIsLoading(false)
        })()
    }, [])

    if (isLoading) return <div className='h-48'><LoadingSpinner label='Loading billing…'/></div>

    if (!isActive) {
        return (
            <div className='flex flex-col items-center py-6 text-center'>
                <div className='flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700'>
                    <Sparkles aria-hidden="true" className='h-7 w-7' strokeWidth={1.75}/>
                </div>
                <h3 className='mt-4 text-lg font-semibold text-ink-900'>You’re on the Free plan</h3>
                <p className='mt-1 max-w-sm text-sm text-ink-500'>Upgrade for unlimited trips and workspaces, and room for more of your team.</p>
                <Button variant='primary' onClick={ () => handleModalOpen('pricing') } className='mt-5 h-10 px-5 font-semibold'>
                    View plans
                </Button>
            </div>
        )
    }

    const renewDate = dayjs(subscription.current_period_end * 1000).format('MMMM D, YYYY')
    const seats = subscription.quantity
    const total = (subscription.plan.amount * seats) / 100

    return (
        <div className='space-y-4'>
            <Card title='Plan'>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div>
                        <p className='text-xl font-semibold text-ink-900'>{ GetPlanTitle(subscription, stripeInfo.isLive) } plan</p>
                        <p className='mt-1 text-sm text-ink-700'>
                            <span className='font-semibold'>${ total.toLocaleString() }</span> per { subscription.plan.interval } · { seats } { seats === 1 ? 'seat' : 'seats' }
                        </p>
                        <p className='mt-1 text-sm text-ink-500'>{ subscription.cancel_at_period_end ? 'Ends' : 'Renews' } on { renewDate }</p>
                    </div>
                    {
                        subscription.cancel_at_period_end &&
                            <span className='rounded-full bg-status-warning-soft px-2.5 py-1 text-xs font-medium text-ink-900'>Cancels at period end</span>
                    }
                </div>

                <div className='mt-4 flex flex-wrap gap-2'>
                    <Button variant='secondary' onClick={ () => handleModalOpen('manageSeats') } className='h-10 px-4'>
                        Change seats
                    </Button>
                    {
                        !subscription.cancel_at_period_end &&
                            <Button variant='ghost' onClick={ () => handleModalOpen('deleteSubscription') } className='h-10 rounded-[var(--radius-button)] px-4 text-status-danger hover:bg-status-danger-soft'>
                                Cancel subscription
                            </Button>
                    }
                </div>
            </Card>

            <Card title='Payment method'>
                {
                    card ?
                        <div className='flex items-center gap-3'>
                            <span className='flex h-10 w-14 items-center justify-center rounded-lg border border-line bg-surface-soft text-ink-700'>
                                <CreditCard aria-hidden="true" className='h-5 w-5'/>
                            </span>
                            <div>
                                <p className='text-sm font-semibold text-ink-900'>{ CapitalizeFirstLetterOfEachWord(card.brand) } ending in { card.last4 }</p>
                                <p className='text-sm text-ink-500'>Expires { dayjs().month(card.exp_month - 1).format('MMMM') } { card.exp_year }</p>
                            </div>
                        </div>
                    :
                        <p className='text-sm text-ink-500'>We couldn’t load the card on file. Try again later.</p>
                }
                <p className='mt-4 text-xs text-ink-500'>To remove your payment method, cancel your subscription.</p>
            </Card>
        </div>
    )
}


export default BillingView;
