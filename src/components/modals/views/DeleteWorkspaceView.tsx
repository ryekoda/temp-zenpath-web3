"use client"
import { FC } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';



interface Props {
    company: any
    onDismiss: (reset: boolean) => void
}

// Deleting a workspace isn't wired to the API yet (the old handler was commented out), so this
// explains that instead of showing a Delete button that does nothing.
const DeleteWorkspaceView: FC<Props> = ({ company, onDismiss }) => {
    return (
        <div>
            <div className='flex gap-3 rounded-[var(--radius-card)] bg-status-warning-soft p-4'>
                <AlertTriangle aria-hidden="true" className='mt-0.5 h-5 w-5 shrink-0 text-status-warning'/>
                <div className='text-sm text-ink-900'>
                    <p className='font-semibold'>Deleting a workspace isn’t available in the app yet.</p>
                    <p className='mt-1 text-ink-700'>
                        <span className='font-medium'>{ company?.title ? CapitalizeFirstLetterOfEachWord(company.title) : 'This workspace' }</span> and its trips, employees and clients will stay as they are.
                    </p>
                </div>
            </div>

            <div className='mt-6 flex justify-end'>
                <Button variant='secondary' onClick={ () => onDismiss(false) } className='h-10 px-4'>Close</Button>
            </div>
        </div>
    )
}


export default DeleteWorkspaceView;
