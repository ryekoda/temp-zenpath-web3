import Link from 'next/link';
import { Check } from 'lucide-react';
import Container from '@/components/ui/Container';
import AccentLine from '@/components/ui/AccentLine';
import ContactSalesForm from './_components/ContactSalesForm';



export const metadata = {
    title: 'Contact sales · Zenpath',
}

const reasons = [
    'See how Zenpath fits your dispatch workflow',
    'Get help choosing the right plan for your team size',
    'Ask about setting up your clients, drivers, and trips',
]

export default function ContactSalesPage() {
    return (
        <section className='relative isolate overflow-x-clip pb-20 pt-[120px] lg:pb-28 lg:pt-[152px]'>
            <Container className='grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16'>
                <div className='lg:sticky lg:top-[120px]'>
                    <AccentLine className='mb-6'/>
                    <h1 className='text-[40px] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink-900 sm:text-[52px]'>
                        Talk to our team
                    </h1>
                    <p className='mt-5 max-w-[440px] text-lg leading-relaxed text-ink-500'>
                        Tell us about your care-transit operation and we&apos;ll get back to you by email.
                    </p>

                    <ul className='mt-8 space-y-4'>
                        {
                            reasons.map(reason => (
                                <li key={ reason } className='flex items-start gap-3 text-base text-ink-700'>
                                    <span className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700'>
                                        <Check aria-hidden="true" className='h-4 w-4' strokeWidth={2.5}/>
                                    </span>
                                    { reason }
                                </li>
                            ))
                        }
                    </ul>

                    <p className='mt-10 text-base text-ink-500'>
                        Ready to try it yourself?{' '}
                        <Link href='/register' className='rounded font-semibold text-brand-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                            Start for free
                        </Link>
                    </p>
                </div>

                <div className='relative'>
                    {/* Soft highlight behind the form card, matching the landing page */}
                    <div aria-hidden="true" className='pointer-events-none absolute -inset-x-[8%] -inset-y-[10%] -z-10 rounded-full bg-[radial-gradient(closest-side,var(--color-brand-100)_0%,var(--color-brand-100)_60%,var(--color-brand-50)_82%,rgba(240,251,247,0)_100%)] blur-2xl'/>

                    <div className='rounded-[var(--radius-panel)] border border-line bg-white p-6 shadow-[0_24px_60px_-28px_rgba(16,26,51,0.28)] sm:p-10'>
                        <ContactSalesForm/>
                    </div>
                </div>
            </Container>
        </section>
    )
}
