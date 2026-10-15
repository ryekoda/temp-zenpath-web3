"use client"
import { FC } from 'react';
import { ExternalLink } from 'lucide-react';



const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfHO2gGKkydTQfYKcfSwy4KrMJ72Ny8sO1WpPFjWIF0R9wOng/viewform'

// Embedded Google Form for product feedback.
const FeedbackView: FC = () => {
    return (
        <div>
            <div className='overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-soft'>
                <iframe src={ `${FORM_URL}?embedded=true` } title='Zenpath feedback form' className='block h-[70vh] min-h-[480px] w-full'>
                    Loading…
                </iframe>
            </div>
            <a href={ FORM_URL } target='_blank' rel='noopener noreferrer' className='mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                Open the form in a new tab
                <ExternalLink aria-hidden="true" className='h-3.5 w-3.5'/>
            </a>
        </div>
    )
}


export default FeedbackView;
