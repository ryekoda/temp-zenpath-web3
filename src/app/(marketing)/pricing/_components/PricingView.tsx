"use client"
import { FC, useState } from "react";
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Container from '@/components/ui/Container';
import AccentLine from '@/components/ui/AccentLine';
import { GetPlans, GetTeamSizeOptions } from '@/lib/GlobalFunctions';
import { cn } from '@/lib/Utils';
import PlanCard, { Plan } from './PlanCard';



// Largest discount yearly billing gives on any paid plan, worked out from the real prices.
function GetYearlySavingsPercent(isLive: boolean) {
    const monthly: Plan[] = GetPlans(true, isLive)
    const yearly: Plan[] = GetPlans(false, isLive)

    const savings = monthly
        .filter(plan => plan.price > 0)
        .map(plan => {
            const yearlyPlan = yearly.find(p => p.index === plan.index)
            return yearlyPlan ? (plan.price - yearlyPlan.price) / plan.price : 0
        })

    return Math.floor(Math.max(0, ...savings) * 100)
}

interface Props {}

const PricingView: FC<Props> = ({}) => {
    const { stripeInfo } = useAuth()
    const [isMonthlyPayment, setIsMonthlyPayment] = useState(false)
    const [seats, setSeats] = useState(3)

    const plans: Plan[] = GetPlans(isMonthlyPayment, stripeInfo.isLive)
    const savingsPercent = GetYearlySavingsPercent(stripeInfo.isLive)
    const billingOptions = [
        { label: 'Yearly', isMonthly: false },
        { label: 'Monthly', isMonthly: true },
    ]


    return (
        <section className='relative isolate overflow-x-clip pb-20 pt-[120px] lg:pb-28 lg:pt-[152px]'>
            {/* Soft glow behind the plans, matching the landing page */}
            <div aria-hidden="true" className='pointer-events-none absolute left-1/2 top-[30%] -z-10 h-[520px] w-[90%] max-w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--color-brand-100),var(--color-brand-50)_60%,rgba(240,251,247,0))] blur-2xl'/>

            <Container>
                <div className='mx-auto max-w-[760px] text-center'>
                    <AccentLine className='mx-auto mb-6'/>
                    <h1 className='text-[40px] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink-900 sm:text-[52px]'>
                        Simple pricing for every team
                    </h1>
                    <p className='mt-5 text-lg leading-relaxed text-ink-500'>
                        Start free and upgrade as your team grows. No credit card required.
                    </p>
                </div>

                <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6'>
                    <div role='radiogroup' aria-label='Billing period' className='inline-flex rounded-full border border-line bg-white p-1'>
                        {
                            billingOptions.map(option => {
                                const isSelected = option.isMonthly === isMonthlyPayment

                                return (
                                    <button
                                        key={ option.label }
                                        type='button'
                                        role='radio'
                                        aria-checked={ isSelected }
                                        onClick={ () => setIsMonthlyPayment(option.isMonthly) }
                                        className={cn('flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600', isSelected ? 'bg-brand-600 text-white' : 'text-ink-700 hover:text-ink-900')}>
                                        { option.label }
                                        {
                                            !option.isMonthly && savingsPercent > 0 &&
                                                <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', isSelected ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700')}>
                                                    Save up to { savingsPercent }%
                                                </span>
                                        }
                                    </button>
                                )
                            })
                        }
                    </div>

                    <label className='flex items-center gap-3 text-sm font-medium text-ink-700'>
                        Team size
                        <span className='relative'>
                            <select
                                value={ seats }
                                onChange={ (e) => setSeats(Number(e.target.value)) }
                                className='h-11 appearance-none rounded-[var(--radius-button)] border border-line bg-white pl-4 pr-10 text-sm font-semibold text-ink-900 transition-colors duration-200 hover:border-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100'>
                                {
                                    GetTeamSizeOptions().map((option: { label: string, value: number }) => (
                                        <option key={ option.value } value={ option.value }>{ option.label } seats</option>
                                    ))
                                }
                            </select>
                            <ChevronDown aria-hidden="true" className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500' strokeWidth={2}/>
                        </span>
                    </label>
                </div>

                <ul className='mx-auto mt-14 grid max-w-[1120px] gap-6 md:grid-cols-3'>
                    {
                        plans.map(plan => (
                            <PlanCard key={ plan.title } plan={ plan } seats={ seats } isMonthlyPayment={ isMonthlyPayment }/>
                        ))
                    }
                </ul>

                <p className='mt-12 text-center text-base text-ink-500'>
                    Have a larger team or questions about plans?{' '}
                    <Link href='/sales' className='rounded font-semibold text-brand-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                        Contact sales
                    </Link>
                </p>
            </Container>
        </section>
    )
};


export default PricingView;
