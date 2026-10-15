import { FC, ReactNode } from "react";
import { cn } from '@/lib/Utils';



// Workspaces created before the redesign were saved with plain CSS color names.
// Show them with the closest design-system color instead (display only; saved data is unchanged).
const legacyColors: Record<string, string> = {
    'blue': '#2798D8',
    'red': '#C2385A',
    'green': '#0FA978',
    'purple': '#263B5A',
    'orange': '#B7800E',
    '#f2f2f2': '#607895',
}

interface Props {
    color?: string | null
    image?: string | null
    className?: string
    children?: ReactNode
}

// A workspace's background (photo or solid color) with a soft dark fade so white text stays readable.
const WorkspaceCover: FC<Props> = ({ color, image, className, children }) => {
    const backgroundColor = color ? (legacyColors[color.toLowerCase()] ?? color) : 'var(--color-brand-600)'

    return (
        <div
            className={cn('relative overflow-hidden bg-cover bg-center', className)}
            style={{ backgroundColor, backgroundImage: image ? `url(${image})` : undefined }}>
            <div aria-hidden="true" className='absolute inset-0 bg-gradient-to-t from-[rgba(16,26,51,0.55)] via-[rgba(16,26,51,0.1)] to-transparent'/>
            <div className='relative h-full'>{ children }</div>
        </div>
    )
};


export default WorkspaceCover;
