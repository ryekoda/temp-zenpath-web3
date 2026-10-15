import { FC, ReactNode } from "react";
import { cn } from '@/lib/cn';



interface Props {
    children: ReactNode
    className?: string
}

// Centered page container from the design system: max ~1320px, 48–64px outer padding on desktop.
const Container: FC<Props> = ({ children, className }) => {
    return (
        <div className={cn('mx-auto w-full max-w-container px-4 sm:px-6 lg:px-12 xl:px-16', className)}>
            { children }
        </div>
    )
};


export default Container;
