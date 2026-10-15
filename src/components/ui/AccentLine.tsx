import { FC } from "react";
import { cn } from '@/lib/cn';



interface Props {
    className?: string
}

// Small green rule placed above section headings.
const AccentLine: FC<Props> = ({ className }) => {
    return <span aria-hidden="true" className={cn('block h-1 w-10 rounded-full bg-brand-500', className)}/>
};


export default AccentLine;
