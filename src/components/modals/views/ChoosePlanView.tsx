"use client"
import { FC, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { labelClassName, selectClassName } from '@/components/ui/input/fieldStyles';
import { UpdateCompany } from '@/helpers/database/Companies';
import { CreateStripeCustomer, CreateSubscription } from '@/helpers/stripe/Stripe';
import { GetPlans, SubscriptionStatus, GetTeamSizeOptions } from '@/lib/billing/plans';
import { cn } from '@/lib/cn';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';
import CheckoutView from './CheckoutView';



interface Props {
    userInfo: any
    stripeInfo: any
    isShowingCheckout: boolean
    setIsShowingCheckout: (isShowing: boolean) => void
    boardUID: any
    company: any
    onDismiss: (reset: boolean) => void
    dbURL: any
}

// Pick a plan and team size, then pay through Stripe (CheckoutView).
const ChoosePlanView: FC<Props> = ({ userInfo, stripeInfo, isShowingCheckout, setIsShowingCheckout, boardUID, company, onDismiss, dbURL }) => {
    const [isMonthlyPayment, setIsMonthlyPayment] = useState(false)
    const [seats, setSeats] = useState(3)
    const [clientSecret, setClientSecret] = useState<string>()
    const plans = GetPlans(isMonthlyPayment, stripeInfo.isLive)
    const [selectedIndex, setSelectedIndex] = useState<number>((plans.find((plan: any) => plan.isRec) || plans[0]).index)
    const [isStarting, setIsStarting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const hasPaidPlan = SubscriptionStatus(company).isSubscriptionActive || SubscriptionStatus(company).isInGracePeriod
    const selectedPlan = plans.find((plan: any) => plan.index === selectedIndex)
    const isFree = selectedIndex === 0

    async function continuePressed() {
        if (isFree) {
            onDismiss(true)
            return
        }

        setIsStarting(true)
        setErrorMessage('')
        setIsShowingCheckout(true)

        try {
            const secret = await createSubscription(selectedPlan)
            if (secret) {
                setClientSecret(secret)
            } else {
                throw new Error('No client secret')
            }
        } catch (err) {
            console.log('subscription error: ', err)
            setIsShowingCheckout(false)
            setErrorMessage('We couldn’t start checkout. Please try again.')
        }

        setIsStarting(false)
    }

    async function createSubscription(plan: any) {
        let stripeCustomerUID = stripeInfo.isLive ? userInfo['stripeUID'] : userInfo['stripeUID_test']

        if (!stripeCustomerUID) {
            const customer: any = await CreateStripeCustomer(userInfo.id, userInfo.email, stripeInfo.baseURL, dbURL, stripeInfo.isLive)
            stripeCustomerUID = customer?.id
        }
        if (!stripeCustomerUID) return

        const subscriptionData: any = await CreateSubscription(stripeCustomerUID, stripeInfo.baseURL, plan, seats, '')
        if (!subscriptionData) return

        await UpdateCompany(boardUID, stripeInfo.isLive ? 'subscriptionUID' : 'testSubscriptionUID', subscriptionData['id'], dbURL).catch((err: any) => console.log('company error: ', err));
        return subscriptionData['latest_invoice'].payment_intent['client_secret']
    }

    if (isShowingCheckout) {
        return clientSecret ?
            <CheckoutView stripeInfo={ stripeInfo } clientSecret={ clientSecret } plan={ selectedPlan } isMonthlyPayment={ isMonthlyPayment } seats={ seats }/>
        :
            <div className='h-72'><LoadingSpinner label='Preparing checkout…'/></div>
    }

    return (
        <div>
            <div className='flex flex-wrap items-end justify-between gap-4'>
                <div role='radiogroup' aria-label='Billing period' className='inline-flex rounded-full border border-line bg-white p-1'>
                    {
                        [{ label: 'Yearly', isMonthly: false }, { label: 'Monthly', isMonthly: true }].map((option) => {
                            const isSelected = option.isMonthly === isMonthlyPayment

                            return (
                                <button key={ option.label } type='button' role='radio' aria-checked={ isSelected } onClick={ () => setIsMonthlyPayment(option.isMonthly) } className={ cn('h-9 rounded-full px-4 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600', isSelected ? 'bg-brand-600 text-white' : 'text-ink-700 hover:text-ink-900') }>
                                    { option.label }
                                </button>
                            )
                        })
                    }
                </div>

                <div className='w-40'>
                    <label htmlFor='plan-seats' className={ labelClassName }>Team size</label>
                    <select id='plan-seats' value={ seats } onChange={ (e) => setSeats(Number(e.target.value)) } className={ selectClassName }>
                        { GetTeamSizeOptions().map((option: any) => <option key={ option.value } value={ option.value }>{ option.label } seats</option>) }
                    </select>
                </div>
            </div>

            <ul role='radiogroup' aria-label='Plan' className='mt-6 grid gap-4 md:grid-cols-3'>
                {
                    plans.map((plan: any) => {
                        const isSelected = plan.index === selectedIndex

                        return (
                            <li key={ plan.index }>
                                <button
                                    type='button'
                                    role='radio'
                                    aria-checked={ isSelected }
                                    onClick={ () => setSelectedIndex(plan.index) }
                                    className={ cn(
                                        'relative flex h-full w-full flex-col rounded-[var(--radius-card)] border bg-white p-5 text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
                                        isSelected ? 'border-brand-600 ring-1 ring-brand-600' : 'border-line hover:border-ink-400'
                                    ) }>
                                    <div className='flex items-center justify-between gap-2'>
                                        <span className='text-lg font-semibold text-ink-900'>{ plan.title }</span>
                                        <span aria-hidden="true" className={ cn('flex h-5 w-5 items-center justify-center rounded-full border', isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-line') }>
                                            { isSelected && <Check className='h-3 w-3' strokeWidth={3}/> }
                                        </span>
                                    </div>
                                    { plan.isRec && <span className='mt-2 w-fit rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700'>Recommended</span> }
                                    <p className='mt-2 text-sm text-ink-500'>{ plan.note }</p>

                                    <p className='mt-4 flex items-end gap-1.5'>
                                        <span className='text-3xl font-bold tracking-tight text-ink-900'>${ plan.price }</span>
                                        <span className='pb-1 text-xs leading-tight text-ink-500'>per seat<br/>per month</span>
                                    </p>
                                    <p className='mt-1 min-h-[20px] text-sm text-ink-700'>
                                        { plan.price === 0 ? 'Free for up to 2 team members' : <><span className='font-semibold'>${ (plan.price * seats).toLocaleString() }/month</span> for { seats } seats, billed { isMonthlyPayment ? 'monthly' : 'yearly' }</> }
                                    </p>

                                    <ul className='mt-4 space-y-2 border-t border-line pt-4'>
                                        {
                                            plan.perks.map((perk: string) => (
                                                <li key={ perk } className='flex items-start gap-2 text-sm text-ink-700'>
                                                    <Check aria-hidden="true" className='mt-0.5 h-4 w-4 shrink-0 text-brand-600' strokeWidth={2.5}/>
                                                    { perk }
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </button>
                            </li>
                        )
                    })
                }
            </ul>

            { errorMessage && <p role='alert' className='mt-4 rounded-[var(--radius-button)] bg-status-danger-soft px-3 py-2 text-sm text-ink-900'>{ errorMessage }</p> }

            <div className='mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5'>
                { hasPaidPlan && !isFree && <p className='mr-auto text-sm text-ink-500'>This workspace already has a paid plan. Change seats from Billing.</p> }
                <Button variant='primary' onClick={ continuePressed } isLoading={ isStarting } disabled={ isStarting || (hasPaidPlan && !isFree) } className='h-11 px-6 font-semibold'>
                    { isFree ? 'Continue with Free' : `Continue with ${selectedPlan?.title}` }
                </Button>
            </div>
        </div>
    )
}


export default ChoosePlanView;
