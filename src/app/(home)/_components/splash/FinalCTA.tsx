import { FC } from "react";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import AccentLine from '@/components/ui/AccentLine';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/cn';



interface Props {}

const FinalCTA: FC<Props> = ({}) => {
    return (
        <section className='pb-20 lg:pb-28'>
            <Container>
                <div className='relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-brand-50 px-6 py-16 text-center sm:px-10 lg:py-20'>
                    {/* Soft corner glows */}
                    <div aria-hidden="true" className='pointer-events-none absolute -left-32 -top-32 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,var(--color-brand-100),transparent)] blur-2xl'/>
                    <div aria-hidden="true" className='pointer-events-none absolute -bottom-36 -right-28 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,var(--color-brand-100),transparent)] blur-2xl'/>

                    <AccentLine className='mx-auto mb-6'/>
                    <h2 className='text-[30px] font-bold leading-[1.08] tracking-[-0.025em] text-ink-900 md:text-[40px]'>
                        Ready to simplify dispatch?
                    </h2>
                    <p className='mx-auto mt-4 max-w-[480px] text-lg leading-relaxed text-ink-700'>
                        Create a free account and start planning rides with your team.
                    </p>
                    <Link href='/register' className={cn(buttonVariants({ variant: 'primary', size: 'xl' }), 'mt-8 gap-2 focus:ring-offset-brand-50')}>
                        Get started free
                        <ArrowRight aria-hidden="true" className='h-[18px] w-[18px]' strokeWidth={2}/>
                    </Link>
                </div>
            </Container>
        </section>
    )
};


export default FinalCTA;
