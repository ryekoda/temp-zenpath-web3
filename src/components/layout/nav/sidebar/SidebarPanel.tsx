import { FC, ReactNode, useId } from "react";
import { X } from 'lucide-react';
import { cn } from '@/lib/Utils';



interface Props {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

// Panel that slides out from behind the sidebar. Clicking outside it or pressing Escape closes it.
const SidebarPanel: FC<Props> = ({ isOpen, onClose, title, children }) => {
    const titleId = useId()

    return (
        <>
            {/* Click-away area covering the rest of the page */}
            <div aria-hidden="true" onClick={ onClose } className={cn('fixed inset-0 left-20 bg-[rgba(16,26,51,0.12)] transition-opacity duration-200', isOpen ? 'opacity-100' : 'pointer-events-none opacity-0')}/>

            <section
                role='dialog'
                aria-labelledby={ titleId }
                aria-hidden={ !isOpen }
                className={cn(
                    'fixed left-20 top-0 flex h-screen w-[400px] max-w-[calc(100vw-80px)] flex-col border-r border-line bg-white shadow-[12px_0_40px_-20px_rgba(16,26,51,0.3)] transition-[transform,visibility] duration-200 ease-out motion-reduce:transition-none',
                    isOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
                )}>
                <header className='flex items-center justify-between border-b border-line px-6 py-5'>
                    <h2 id={ titleId } className='text-xl font-bold tracking-tight text-ink-900'>{ title }</h2>
                    <button
                        type='button'
                        onClick={ onClose }
                        aria-label='Close panel'
                        className='-mr-2 flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                        <X className='h-5 w-5' strokeWidth={2}/>
                    </button>
                </header>

                <div className='flex-1 overflow-y-auto px-6 py-6'>
                    { children }
                </div>
            </section>
        </>
    )
};


export default SidebarPanel;
