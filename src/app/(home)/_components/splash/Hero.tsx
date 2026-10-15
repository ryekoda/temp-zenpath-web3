import { FC } from "react";
import { Bus } from 'lucide-react';
import Container from '@/components/ui/Container';
import EmailSignup from './EmailSignup';
import AppFrame from '@/components/marketing/preview/AppFrame';
import TripsTable from '@/components/marketing/preview/TripsTable';
import RouteCard from '@/components/marketing/preview/RouteCard';



interface Props {}

const Hero: FC<Props> = ({}) => {
    return (
        <section className='relative isolate overflow-x-clip pb-16 pt-[120px] lg:pb-20 lg:pt-[152px]'>
            <Container className='grid items-center gap-14 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-10'>
                <div>
                    <p className='mb-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700'>
                        <Bus aria-hidden="true" className='h-4 w-4' strokeWidth={2}/>
                        Care transit, without the chaos
                    </p>

                    <h1 className='text-[44px] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900 sm:text-[56px] xl:text-[60px] 2xl:text-[68px]'>
                        Dispatch smarter.
                        <br/>
                        Care better.
                    </h1>

                    <p className='mb-9 mt-6 max-w-[440px] text-lg leading-relaxed text-ink-500 sm:text-xl'>
                        Coordinate rides, teams, and schedules in one place with Zenpath.
                    </p>

                    <EmailSignup/>
                </div>

                <div role="img" aria-label="Preview of the Zenpath trips schedule, showing today's rides with their status, and a driver's route on a map" className='pointer-events-none relative select-none md:pb-24'>
                    {/* Soft mint highlight, sized to the preview so it reads as a glow just around it */}
                    <div aria-hidden="true" className='absolute -inset-x-[10%] -inset-y-[14%] -z-10 rounded-full bg-[radial-gradient(closest-side,var(--color-brand-100)_0%,var(--color-brand-100)_72%,var(--color-brand-50)_88%,rgba(240,251,247,0)_100%)] blur-2xl'/>

                    <AppFrame activeView='schedule'>
                        <TripsTable/>
                        {/* Room for the route card to overlap without covering trips */}
                        <div className='hidden h-28 md:block'/>
                    </AppFrame>

                    <RouteCard className='mt-4 shadow-[0_20px_50px_-24px_rgba(16,26,51,0.3)] md:absolute md:bottom-0 md:right-0 md:mt-0 md:w-[60%] xl:right-[-4%]'/>
                </div>
            </Container>
        </section>
    )
};


export default Hero;
