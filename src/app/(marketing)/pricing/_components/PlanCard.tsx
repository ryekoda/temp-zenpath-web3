import { FC } from "react";
import Link from 'next/link';
import { Check } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/Utils';



export interface Plan {
    index: number
    title: string
    price: number
    note: string
    details: string
    perks: string[]
    isRec: boolean
}

interface Props {
    plan: Plan
    seats: number
    isMonthlyPayment: boolean
}

const PlanCard: FC<Props> = ({ plan, seats, isMonthlyPayment }) => {
    const isFree = plan.price === 0
    const monthlyTotal = plan.price * seats

    return (
        <li className={cn(
            'relative flex flex-col rounded-[var(--radius-card)] border bg-white p-7 lg:p-8',
            plan.isRec ? 'border-brand-600 shadow-[0_24px_60px_-30px_rgba(15,169,120,0.45)] ring-1 ring-brand-600' : 'border-line'
        )}>
            {
                plan.isRec &&
                    <span className='absolute -top-3 left-7 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white'>
                        Recommended
                    </span>
            }

            <h2 className='text-xl font-semibold tracking-tight text-ink-900'>{ plan.title }</h2>
            <p className='mt-1.5 min-h-[52px] text-base leading-relaxed text-ink-500'>{ plan.note }</p>

            <div className='mt-6 flex items-end gap-2'>
                <span className='text-[44px] font-extrabold leading-none tracking-[-0.03em] text-ink-900'>${ plan.price }</span>
                <span className='pb-1 text-sm leading-tight text-ink-500'>per seat<br/>per month</span>
            </div>

            <p className='mt-3 min-h-[40px] text-sm text-ink-700'>
                {
                    isFree ?
                        'Free for up to 2 team members.'
                    :
                        <>
                            <span className='font-semibold'>${ monthlyTotal.toLocaleString() }/month</span> for { seats } seats, billed { isMonthlyPayment ? 'monthly' : 'annually' }.
                        </>
                }
            </p>

            <Link href='/register' className={cn(buttonVariants({ variant: plan.isRec ? 'primary' : 'secondary', size: 'xl' }), 'mt-6 w-full')}>
                Get started
            </Link>

            <div className='mt-8 border-t border-line pt-6'>
                {
                    plan.index !== 0 &&
                        <p className='mb-4 text-sm font-semibold text-ink-900'>{ plan.details.replace('FREE', 'Free') }</p>
                }
                <ul className='space-y-3'>
                    {
                        plan.perks.map(perk => (
                            <li key={ perk } className='flex items-start gap-3 text-[15px] text-ink-700'>
                                <span className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700'>
                                    <Check aria-hidden="true" className='h-3.5 w-3.5' strokeWidth={2.5}/>
                                </span>
                                { perk }
                            </li>
                        ))
                    }
                </ul>
            </div>
        </li>
    )
};


export default PlanCard;
