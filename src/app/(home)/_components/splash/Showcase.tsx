import { FC } from "react";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import AccentLine from '@/components/ui/AccentLine';
import AppFrame from '@/components/marketing/preview/AppFrame';
import RouteCard from '@/components/marketing/preview/RouteCard';



interface Props {}

const Showcase: FC<Props> = ({}) => {
    return (
        <section id='product' className='scroll-mt-24 pb-20 lg:pb-28'>
            <Container>
                <div className='grid items-center gap-12 rounded-[var(--radius-panel)] bg-brand-50 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14 lg:p-16'>
                    <div>
                        <AccentLine className='mb-6'/>
                        <h2 className='text-[30px] font-bold leading-[1.08] tracking-[-0.025em] text-ink-900 md:text-[40px]'>
                            Your whole operation, at a glance
                        </h2>
                        <p className='mt-5 max-w-[420px] text-lg leading-relaxed text-ink-700'>
                            From trip planning to live tracking, Zenpath gives you the tools to run your care transit service efficiently and confidently.
                        </p>
                        <Link href='/pricing' className='group mt-8 inline-flex items-center gap-2 rounded-md font-semibold text-brand-700 transition-colors duration-200 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-4 focus-visible:ring-offset-brand-50'>
                            See plans and pricing
                            <ArrowRight aria-hidden="true" className='h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none' strokeWidth={2}/>
                        </Link>
                    </div>

                    <div role="img" aria-label="Preview of the Zenpath map view, showing a driver's route with numbered stops" className='pointer-events-none select-none'>
                        <AppFrame activeView='map'>
                            <RouteCard layout='stacked'/>
                        </AppFrame>
                    </div>
                </div>
            </Container>
        </section>
    )
};


export default Showcase;
