"use client"
import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import useDelayedShow from './useDelayedShow';



// Small spinner with a label, centered in its container (map view, billing, checkout).
const LoadingSpinner: FC<{ label: string }> = ({ label }) => {
    const isShown = useDelayedShow()

    return (
        <div role='status' className='flex h-full items-center justify-center gap-3 text-sm text-ink-500'>
            {
                isShown ?
                    <>
                        <Loader2 aria-hidden="true" className='h-5 w-5 animate-spin text-brand-600 motion-reduce:animate-none'/>
                        { label }
                    </>
                :
                    <span className='sr-only'>{ label }</span>
            }
        </div>
    )
}


export default LoadingSpinner;
