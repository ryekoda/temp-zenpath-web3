'use client'

import { FC, FormEvent, useState } from "react";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { ErrorMessage, RegisterFIR } from '../_utils/Actions';



interface Props {}

const RegisterForm: FC<Props> = ({}) => {
    const { stripeInfo, dbURL } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [values, setValues] = useState({ name: '', email: searchParams.get('email') ?? '', password: '' })
    const [isShowingPassword, setIsShowingPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const errorMessage = ErrorMessage(errorCode).message



    function inputChanged(name: keyof typeof values, value: string) {
        if (errorCode !== 0) setErrorCode(0)
        setValues({ ...values, [name]: value })
    }

    async function submitPressed(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // RegisterFIR expects the same { name, value } field list the old form used.
        const fields = Object.entries(values).map(([name, value]) => ({ name, value: value.trim() }))
        await RegisterFIR(fields, dbURL, stripeInfo, setErrorCode, setIsSubmitting, router)
    }


    return (
        <form onSubmit={ submitPressed } className='space-y-5'>
            <TextField
                id='signup-name'
                name='name'
                label='Full name'
                placeholder='First and last name'
                autoComplete='name'
                required
                icon={ <User className='h-5 w-5' strokeWidth={1.75}/> }
                value={ values.name }
                onChange={ (e) => inputChanged('name', e.target.value) }
            />

            <TextField
                id='signup-email'
                name='email'
                type='email'
                label='Work email'
                placeholder='you@company.com'
                autoComplete='email'
                required
                icon={ <Mail className='h-5 w-5' strokeWidth={1.75}/> }
                value={ values.email }
                onChange={ (e) => inputChanged('email', e.target.value) }
            />

            <TextField
                id='signup-password'
                name='password'
                type={ isShowingPassword ? 'text' : 'password' }
                label='Password'
                placeholder='Create a password'
                autoComplete='new-password'
                required
                minLength={ 7 }
                hint='At least 7 characters.'
                icon={ <Lock className='h-5 w-5' strokeWidth={1.75}/> }
                value={ values.password }
                onChange={ (e) => inputChanged('password', e.target.value) }
                trailing={
                    <button
                        type='button'
                        onClick={ () => setIsShowingPassword(!isShowingPassword) }
                        aria-label={ isShowingPassword ? 'Hide password' : 'Show password' }
                        aria-pressed={ isShowingPassword }
                        className='flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-surface-soft hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                        { isShowingPassword ? <EyeOff className='h-5 w-5' strokeWidth={1.75}/> : <Eye className='h-5 w-5' strokeWidth={1.75}/> }
                    </button>
                }
            />

            {
                errorMessage &&
                    <div role='alert' className='flex items-start gap-2.5 rounded-[var(--radius-button)] border border-status-danger-soft bg-status-danger-soft px-4 py-3 text-sm text-ink-900'>
                        <AlertCircle aria-hidden="true" className='mt-0.5 h-4 w-4 shrink-0 text-status-danger' strokeWidth={2}/>
                        <span>
                            { errorMessage }
                            { errorCode === 5 && <> <Link href='/login' className='font-semibold text-brand-700 underline-offset-2 hover:underline'>Log in instead</Link></> }
                        </span>
                    </div>
            }

            <Button type='submit' variant='primary' size='xl' isLoading={ isSubmitting } className='w-full'>
                { isSubmitting ? 'Creating your account…' : 'Create account' }
            </Button>

            <p className='text-center text-sm text-ink-500'>
                Already have an account?{' '}
                <Link href='/login' className='rounded font-semibold text-brand-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                    Log in
                </Link>
            </p>
        </form>
    )
};


export default RegisterForm;
