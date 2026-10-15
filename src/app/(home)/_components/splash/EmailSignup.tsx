'use client'

import { FC, FormEvent, useState } from "react";
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';



interface Props {}

// Sends the visitor to /register with their email pre-filled.
const EmailSignup: FC<Props> = ({}) => {
    const router = useRouter()
    const [email, setEmail] = useState('')



    function SubmitPressed(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const trimmedEmail = email.trim()
        router.push(trimmedEmail ? `/register?email=${encodeURIComponent(trimmedEmail)}` : '/register')
    }


    return (
        <form onSubmit={ SubmitPressed } className='w-full max-w-[520px]'>
            <label htmlFor='hero-email' className='mb-2 block text-sm font-medium text-ink-700'>
                Work email
            </label>

            <div className='flex flex-col gap-3 sm:flex-row sm:gap-0'>
                <div className='relative flex-1'>
                    <Mail aria-hidden="true" className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400' strokeWidth={1.75}/>
                    <input
                        id='hero-email'
                        type='email'
                        autoComplete='email'
                        placeholder='Enter your work email'
                        value={ email }
                        onChange={ (e) => setEmail(e.target.value) }
                        className='h-14 w-full rounded-[var(--radius-button)] border border-line bg-white pl-12 pr-4 text-base text-ink-900 placeholder:text-ink-400 transition-colors duration-200 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:rounded-r-none sm:border-r-0'
                    />
                </div>

                <Button type='submit' variant='primary' size='xl' className='h-14 gap-2 sm:rounded-l-none'>
                    Get started free
                    <ArrowRight aria-hidden="true" className='h-[18px] w-[18px]' strokeWidth={2}/>
                </Button>
            </div>

            <p className='mt-3 flex items-center gap-2 text-sm text-ink-500'>
                <ShieldCheck aria-hidden="true" className='h-4 w-4 text-brand-600' strokeWidth={2}/>
                No credit card required
            </p>
        </form>
    )
};


export default EmailSignup;
