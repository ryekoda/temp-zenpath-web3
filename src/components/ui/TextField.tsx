import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from '@/lib/Utils';



interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    hint?: string
    icon?: ReactNode
    // Rendered inside the right edge of the input (e.g. a show-password button).
    trailing?: ReactNode
}

// Labelled text input from the design system: persistent label, 52px+ height, visible focus state.
const TextField = forwardRef<HTMLInputElement, Props>(({ label, hint, icon, trailing, id, className, ...props }, ref) => {
    const hintId = hint ? `${id}-hint` : undefined

    return (
        <div className={ className }>
            <label htmlFor={ id } className='mb-2 block text-sm font-medium text-ink-700'>
                { label }
            </label>

            <div className='relative'>
                {
                    icon &&
                        <span aria-hidden="true" className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400'>
                            { icon }
                        </span>
                }
                <input
                    ref={ ref }
                    id={ id }
                    aria-describedby={ hintId }
                    className={cn(
                        'h-[52px] w-full rounded-[var(--radius-button)] border border-line bg-white text-base text-ink-900 placeholder:text-ink-400 transition-colors duration-200 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100',
                        icon ? 'pl-11' : 'pl-4',
                        trailing ? 'pr-12' : 'pr-4'
                    )}
                    { ...props }
                />
                {
                    trailing &&
                        <span className='absolute right-1.5 top-1/2 -translate-y-1/2'>
                            { trailing }
                        </span>
                }
            </div>

            { hint && <p id={ hintId } className='mt-1.5 text-sm text-ink-500'>{ hint }</p> }
        </div>
    )
});

TextField.displayName = 'TextField'


export default TextField;
