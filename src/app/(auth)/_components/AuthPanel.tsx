import { FC, ReactNode } from "react";
import { Check } from 'lucide-react';
import AccentLine from '@/components/ui/AccentLine';



interface Props {
    title: string
    // Only use claims the product and pricing pages already make.
    highlights?: string[]
    // Product preview shown at the bottom of the panel.
    preview: ReactNode
    previewLabel: string
}

// Mint side panel shared by the login and sign-up pages.
const AuthPanel: FC<Props> = ({ title, highlights, preview, previewLabel }) => {
    return (
        <div className='relative isolate flex h-full flex-col justify-center overflow-hidden rounded-[var(--radius-panel)] bg-brand-50 p-10 xl:p-14'>
            {/* Soft corner glow, matching the landing page */}
            <div aria-hidden="true" className='pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,var(--color-brand-100),transparent)] blur-2xl'/>

            <AccentLine className='mb-6'/>
            <h2 className='max-w-[380px] text-[30px] font-bold leading-[1.08] tracking-[-0.025em] text-ink-900 xl:text-[36px]'>
                { title }
            </h2>

            {
                highlights &&
                    <ul className='mt-8 space-y-4'>
                        {
                            highlights.map(highlight => (
                                <li key={ highlight } className='flex items-start gap-3 text-base text-ink-700'>
                                    <span className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700'>
                                        <Check aria-hidden="true" className='h-4 w-4' strokeWidth={2.5}/>
                                    </span>
                                    { highlight }
                                </li>
                            ))
                        }
                    </ul>
            }

            <div role="img" aria-label={ previewLabel } className='pointer-events-none mt-12 select-none'>
                { preview }
            </div>
        </div>
    )
};


export default AuthPanel;
