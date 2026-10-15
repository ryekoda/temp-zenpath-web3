'use client'

import { FC, FormEvent, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { ErrorMessage, LoginFIR, SendPasswordReset } from '../_utils/Actions';



interface Props {}

const LoginForm: FC<Props> = ({}) => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isShowingPassword, setIsShowingPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSendingReset, setIsSendingReset] = useState(false)
    const [resetSentTo, setResetSentTo] = useState('')
    const [errorCode, setErrorCode] = useState(0)

    const errorMessage = ErrorMessage(errorCode).message



    function clearMessages() {
        if (errorCode !== 0) setErrorCode(0)
        if (resetSentTo) setResetSentTo('')
    }

    async function submitPressed(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        clearMessages()

        await LoginFIR(email, password, setErrorCode, setIsSubmitting, router)
    }

    async function forgotPasswordPressed() {
        clearMessages()
        setIsSendingReset(true)

        const code = await SendPasswordReset(email)
        setIsSendingReset(false)

        if (code === 0) {
            setResetSentTo(email.trim())
        } else {
            setErrorCode(code)
        }
    }


    return (
        <form onSubmit={ submitPressed } className='space-y-5'>
            <TextField
                id='login-email'
                name='email'
                type='email'
                label='Email'
                placeholder='you@company.com'
                autoComplete='email'
                required
                icon={ <Mail className='h-5 w-5' strokeWidth={1.75}/> }
                value={ email }
                onChange={ (e) => { clearMessages(); setEmail(e.target.value) } }
            />

            <div>
                <TextField
                    id='login-password'
                    name='password'
                    type={ isShowingPassword ? 'text' : 'password' }
                    label='Password'
                    placeholder='Enter your password'
                    autoComplete='current-password'
                    required
                    icon={ <Lock className='h-5 w-5' strokeWidth={1.75}/> }
                    value={ password }
                    onChange={ (e) => { clearMessages(); setPassword(e.target.value) } }
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

                <div className='mt-2 flex justify-end'>
                    <button
                        type='button'
                        onClick={ forgotPasswordPressed }
                        disabled={ isSendingReset }
                        className='rounded text-sm font-semibold text-brand-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:opacity-60'>
                        { isSendingReset ? 'Sending reset email…' : 'Forgot password?' }
                    </button>
                </div>
            </div>

            {
                errorMessage &&
                    <div role='alert' className='flex items-start gap-2.5 rounded-[var(--radius-button)] bg-status-danger-soft px-4 py-3 text-sm text-ink-900'>
                        <AlertCircle aria-hidden="true" className='mt-0.5 h-4 w-4 shrink-0 text-status-danger' strokeWidth={2}/>
                        <span>{ errorMessage }</span>
                    </div>
            }

            {
                resetSentTo &&
                    <div role='status' className='flex items-start gap-2.5 rounded-[var(--radius-button)] bg-status-success-soft px-4 py-3 text-sm text-ink-900'>
                        <CheckCircle2 aria-hidden="true" className='mt-0.5 h-4 w-4 shrink-0 text-status-success' strokeWidth={2}/>
                        <span>If there&apos;s an account for <strong className='font-semibold'>{ resetSentTo }</strong>, we&apos;ve sent a link to reset your password.</span>
                    </div>
            }

            <Button type='submit' variant='primary' size='xl' isLoading={ isSubmitting } className='w-full'>
                { isSubmitting ? 'Logging in…' : 'Log in' }
            </Button>

            <p className='text-center text-sm text-ink-500'>
                New to Zenpath?{' '}
                <Link href='/register' className='rounded font-semibold text-brand-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                    Create an account
                </Link>
            </p>
        </form>
    )
};


export default LoginForm;
