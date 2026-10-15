'use client'

import { FC } from "react";
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import useDelayedShow from './useDelayedShow';



// Full-screen loader while the signed-in user's account loads (first visit, refresh, sign-in).
const LoadingScreen: FC = () => {
    const isShown = useDelayedShow(300)

    return (
        <div role='status' className='flex h-screen w-full items-center justify-center bg-white'>
            <span className='sr-only'>Loading Zenpath</span>
            {
                isShown &&
                    <div aria-hidden="true" className='flex flex-col items-center gap-5'>
                        <Image src='/images/LogoIcon.png' alt='' width={ 56 } height={ 56 } priority className='h-14 w-14'/>
                        <Loader2 className='h-5 w-5 animate-spin text-brand-600 motion-reduce:animate-none'/>
                    </div>
            }
        </div>
    )
};


export default LoadingScreen;
