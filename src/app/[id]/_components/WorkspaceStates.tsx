import { FC, ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/cn';



interface EmptyStateProps {
    icon: ReactNode
    title: string
    description: string
    action?: ReactNode
    tone?: 'brand' | 'danger'
    headingLevel?: 'h1' | 'h2'
}

export const EmptyState: FC<EmptyStateProps> = ({ icon, title, description, action, tone = 'brand', headingLevel: Heading = 'h2' }) => (
    <div className='flex h-full items-center justify-center overflow-auto p-8'>
        <div className='flex max-w-sm flex-col items-center text-center'>
            <div className={ cn('flex h-14 w-14 items-center justify-center rounded-full [&>svg]:h-7 [&>svg]:w-7', tone === 'danger' ? 'bg-status-danger-soft text-status-danger' : 'bg-brand-100 text-brand-700') }>
                { icon }
            </div>
            <Heading className='mt-4 text-lg font-semibold text-ink-900'>{ title }</Heading>
            <p className='mt-1 text-sm text-ink-500'>{ description }</p>
            { action && <div className='mt-5'>{ action }</div> }
        </div>
    </div>
)

export const AccessDenied: FC<{ area: string }> = ({ area }) => (
    <EmptyState
        tone='danger'
        headingLevel='h1'
        icon={ <ShieldAlert aria-hidden="true" strokeWidth={1.75}/> }
        title={ `You don’t have access to ${area}` }
        description='Ask a workspace admin to approve your access, then reload the page.'/>
)
