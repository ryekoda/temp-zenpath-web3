'use client'

import { FC, ReactNode, useId } from "react";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { X } from 'lucide-react';



interface Props {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: ReactNode
}

// Design-system dialog. MUI's Modal handles focus trapping, Escape to close and scroll locking.
const Dialog: FC<Props> = ({ isOpen, onClose, title, description, children }) => {
    const titleId = useId()
    const descriptionId = useId()

    return (
        <Modal
            open={ isOpen }
            onClose={ onClose }
            aria-labelledby={ titleId }
            aria-describedby={ description ? descriptionId : undefined }
            closeAfterTransition
            slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(16, 26, 51, 0.45)', backdropFilter: 'blur(2px)' } } }}>
            <Fade in={ isOpen } timeout={ 200 }>
                <div className='absolute left-1/2 top-1/2 max-h-[calc(100vh-32px)] w-[min(560px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius-panel)] bg-white p-6 shadow-[0_30px_80px_-20px_rgba(16,26,51,0.45)] outline-none sm:p-8'>
                    <div className='mb-6 flex items-start justify-between gap-4'>
                        <div>
                            <h2 id={ titleId } className='text-2xl font-bold tracking-tight text-ink-900'>{ title }</h2>
                            { description && <p id={ descriptionId } className='mt-1.5 text-base text-ink-500'>{ description }</p> }
                        </div>
                        <button
                            type='button'
                            onClick={ onClose }
                            aria-label='Close'
                            className='-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                            <X className='h-5 w-5' strokeWidth={2}/>
                        </button>
                    </div>

                    { children }
                </div>
            </Fade>
        </Modal>
    )
};


export default Dialog;
