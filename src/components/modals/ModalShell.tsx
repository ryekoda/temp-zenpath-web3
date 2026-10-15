'use client';

import { FC, ReactNode, useId } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/cn';



interface Props {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    maxWidth?: DialogProps['maxWidth']
    // Shows a back arrow before the title (for views opened from inside a modal)
    onBack?: () => void
    // Pinned under the scrolling content, e.g. a Continue button
    footer?: ReactNode
    children: ReactNode
    contentClassName?: string
}

// Frame for every modal in the app: title bar, scrolling body and optional footer.
const ModalShell: FC<Props> = ({ isOpen, onClose, title, description, maxWidth = 'sm', onBack, footer, children, contentClassName }) => {
    const titleId = useId()
    const descriptionId = useId()

    return (
        <Dialog
            open={ isOpen }
            onClose={ onClose }
            fullWidth
            maxWidth={ maxWidth }
            scroll='paper'
            aria-labelledby={ titleId }
            aria-describedby={ description ? descriptionId : undefined }
            slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(16, 26, 51, 0.45)' } } }}
            PaperProps={{
                elevation: 0,
                sx: {
                    borderRadius: 'var(--radius-panel)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 24px 64px -24px rgba(16, 26, 51, 0.35)',
                    fontFamily: 'inherit',
                    margin: 2,
                    width: 'calc(100% - 32px)',
                },
            }}>
            <header className='flex shrink-0 items-start gap-3 border-b border-line px-6 py-4'>
                {
                    onBack &&
                        <button type='button' onClick={ onBack } aria-label='Back' className='-ml-2 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                            <ChevronLeft aria-hidden="true" className='h-5 w-5'/>
                        </button>
                }
                <div className='min-w-0 grow pt-0.5'>
                    <h2 id={ titleId } className='text-lg font-semibold tracking-tight text-ink-900'>{ title }</h2>
                    { description && <p id={ descriptionId } className='mt-0.5 text-sm text-ink-500'>{ description }</p> }
                </div>
                <button type='button' onClick={ onClose } aria-label='Close' className='-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                    <X aria-hidden="true" className='h-5 w-5'/>
                </button>
            </header>

            <div className={ cn('min-h-0 grow overflow-y-auto px-6 py-5', contentClassName) }>
                { children }
            </div>

            { footer && <footer className='shrink-0 border-t border-line bg-white px-6 py-4'>{ footer }</footer> }
        </Dialog>
    )
};


export default ModalShell;
