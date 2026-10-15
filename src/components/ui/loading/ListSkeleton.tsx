"use client"
import { FC } from 'react';
import { cn } from '@/lib/cn';
import useDelayedShow from './useDelayedShow';



// Gray placeholder rows shaped like the workspace lists (avatar/name, then a few columns),
// shown while a page's records load so the page keeps its layout.
const ListSkeleton: FC<{ label: string, rows?: number, showAvatar?: boolean, className?: string }> = ({ label, rows = 6, showAvatar = false, className }) => {
    const isShown = useDelayedShow()

    return (
        <div role='status' className={ cn('h-full overflow-hidden px-8 pt-4', className) }>
            <span className='sr-only'>{ label }</span>
            {
                isShown &&
                    <div aria-hidden="true" className='animate-pulse motion-reduce:animate-none'>
                        {/* Column headers */}
                        <div className='flex gap-6 px-4 pb-3 pt-1'>
                            <div className='h-3 w-24 rounded-full bg-line'/>
                            <div className='ml-auto h-3 w-16 rounded-full bg-line'/>
                            <div className='h-3 w-16 rounded-full bg-line'/>
                            <div className='hidden h-3 w-20 rounded-full bg-line lg:block'/>
                        </div>

                        {
                            Array.from({ length: rows }).map((_, i) => (
                                <div key={ i } className='mt-2 flex items-center gap-6 rounded-[var(--radius-card)] border border-line bg-white px-4 py-3.5' style={{ opacity: 1 - i * 0.12 }}>
                                    <div className='flex min-w-0 grow items-center gap-3'>
                                        { showAvatar && <div className='h-8 w-8 shrink-0 rounded-full bg-line'/> }
                                        <div className='h-3.5 rounded-full bg-line' style={{ width: `${[38, 28, 44, 32, 40, 26][i % 6]}%` }}/>
                                    </div>
                                    <div className='h-3 w-20 rounded-full bg-surface-soft'/>
                                    <div className='h-3 w-24 rounded-full bg-surface-soft'/>
                                    <div className='hidden h-3 w-20 rounded-full bg-surface-soft lg:block'/>
                                </div>
                            ))
                        }
                    </div>
            }
        </div>
    )
}


export default ListSkeleton;
