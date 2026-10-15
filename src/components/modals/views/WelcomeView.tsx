"use client"
import { FC } from 'react';
import Image from 'next/image';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/Button';



interface Props {
    handleClose: (reset: boolean) => void
}

// First-visit welcome. There's no product guide yet, so the only action is to get started.
const WelcomeView: FC<Props> = ({ handleClose }) => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    return (
        <div className='relative flex flex-col items-center py-4 text-center'>
            { !prefersReducedMotion && <Confetti width={ 600 } height={ 400 } numberOfPieces={ 400 } recycle={ false } className='!absolute inset-0'/> }
            <Image src='/images/Team2.png' alt='' width={ 112 } height={ 112 } className='h-28 w-28'/>
            <h3 className='mt-5 text-2xl font-semibold tracking-tight text-ink-900'>
                Welcome to <span className='text-brand-700'>Zenpath</span>
            </h3>
            <p className='mt-2 max-w-sm text-[15px] text-ink-500'>
                Schedule rides, coordinate your drivers and keep track of every trip, all in one place.
            </p>
            <Button variant='primary' onClick={ () => handleClose(false) } className='mt-6 h-11 px-6 font-semibold'>
                Get started
            </Button>
        </div>
    )
}


export default WelcomeView;
