import { FC } from 'react';
import { cn } from '@/lib/cn';



// Two-letter initials badge for people (employees, clients, workspace members).
const InitialsAvatar: FC<{ first?: string, last?: string, className?: string }> = ({ first, last, className }) => (
    <span aria-hidden="true" className={ cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold uppercase text-brand-700', className) }>
        { (first?.charAt(0) || '') + (last?.charAt(0) || '') || '?' }
    </span>
)


export default InitialsAvatar;
