import { FC } from "react";
import { CalendarDays, MapPin, Users } from 'lucide-react';
import Container from '@/components/ui/Container';
import AccentLine from '@/components/ui/AccentLine';



const benefits = [
    { title: 'Plan every ride', description: 'Keep clients and riders organized.', icon: CalendarDays },
    { title: 'Coordinate your team', description: 'Give dispatchers and drivers a shared view.', icon: Users },
    { title: 'Stay on top of every trip', description: 'Track ride status from pickup to destination.', icon: MapPin },
]

interface Props {}

const Benefits: FC<Props> = ({}) => {
    return (
        <section id='solutions' className='relative scroll-mt-16 pb-20 pt-12 lg:pb-28 lg:pt-16'>
            <Container>
                <div className='mx-auto mb-12 max-w-[760px] text-center lg:mb-14'>
                    <AccentLine className='mx-auto mb-6'/>
                    <h2 className='text-[30px] font-bold leading-[1.08] tracking-[-0.025em] text-ink-900 md:text-[40px]'>
                        Everything your dispatch team needs
                    </h2>
                    <p className='mx-auto mt-5 max-w-[600px] text-lg leading-relaxed text-ink-500'>
                        Manage care transit, communicate with your team, and keep every trip on track, all in one place.
                    </p>
                </div>

                <ul className='grid gap-5 md:grid-cols-3 lg:gap-6'>
                    {
                        benefits.map(({ title, description, icon: Icon }) => (
                            <li key={ title } className='rounded-[var(--radius-card)] border border-line bg-white p-7 lg:p-8'>
                                <span className='mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700'>
                                    <Icon aria-hidden="true" className='h-6 w-6' strokeWidth={1.75}/>
                                </span>
                                <h3 className='text-xl font-semibold tracking-tight text-ink-900 lg:text-[22px]'>{ title }</h3>
                                <p className='mt-2 text-base leading-relaxed text-ink-500'>{ description }</p>
                            </li>
                        ))
                    }
                </ul>
            </Container>
        </section>
    )
};


export default Benefits;
