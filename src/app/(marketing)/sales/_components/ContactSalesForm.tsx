'use client'

import { FC, FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { ContactSalesValues, ErrorMessage, SubmitContactSales } from '../_utils/Actions';



const emptyValues: ContactSalesValues = { name: '', email: '', jobTitle: '', phone: '', compName: '', compSize: '', helpDetails: '' }

interface Props {}

const ContactSalesForm: FC<Props> = ({}) => {
    const [values, setValues] = useState(emptyValues)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [sentTo, setSentTo] = useState('')
    const [errorCode, setErrorCode] = useState(0)

    const errorMessage = ErrorMessage(errorCode).message



    function inputChanged(name: keyof ContactSalesValues, value: string) {
        if (errorCode !== 0) setErrorCode(0)
        setValues({ ...values, [name]: value })
    }

    async function submitPressed(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)

        const code = await SubmitContactSales(values)
        setIsSubmitting(false)

        if (code === 0) {
            setSentTo(values.email.trim())
        } else {
            setErrorCode(code)
        }
    }


    if (sentTo) {
        return (
            <div role='status' className='flex flex-col items-center py-10 text-center'>
                <span className='mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700'>
                    <CheckCircle2 aria-hidden="true" className='h-7 w-7' strokeWidth={1.75}/>
                </span>
                <h2 className='text-2xl font-bold tracking-tight text-ink-900'>Thanks, your message is on its way</h2>
                <p className='mt-3 max-w-[360px] text-base leading-relaxed text-ink-500'>
                    Our team will reply to <strong className='font-semibold text-ink-900'>{ sentTo }</strong>.
                </p>
                <Button type='button' variant='secondary' size='xl' className='mt-8' onClick={ () => { setValues(emptyValues); setSentTo('') } }>
                    Send another message
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={ submitPressed } className='grid gap-5 sm:grid-cols-2'>
            <TextField id='sales-name' name='name' label='Full name' placeholder='First and last name' autoComplete='name' required className='sm:col-span-2' value={ values.name } onChange={ (e) => inputChanged('name', e.target.value) }/>
            <TextField id='sales-email' name='email' type='email' label='Work email' placeholder='you@company.com' autoComplete='email' required value={ values.email } onChange={ (e) => inputChanged('email', e.target.value) }/>
            <TextField id='sales-phone' name='phone' type='tel' label='Phone (optional)' placeholder='(555) 123-4567' autoComplete='tel' value={ values.phone } onChange={ (e) => inputChanged('phone', e.target.value) }/>
            <TextField id='sales-company' name='compName' label='Company name' placeholder='Your organization' autoComplete='organization' required value={ values.compName } onChange={ (e) => inputChanged('compName', e.target.value) }/>
            <TextField id='sales-size' name='compSize' type='number' inputMode='numeric' min={ 1 } label='Company size' placeholder='Number of employees' required value={ values.compSize } onChange={ (e) => inputChanged('compSize', e.target.value) }/>
            <TextField id='sales-title' name='jobTitle' label='Job title (optional)' placeholder='e.g. Dispatch manager' autoComplete='organization-title' className='sm:col-span-2' value={ values.jobTitle } onChange={ (e) => inputChanged('jobTitle', e.target.value) }/>

            <div className='sm:col-span-2'>
                <label htmlFor='sales-help' className='mb-2 block text-sm font-medium text-ink-700'>How can we help?</label>
                <textarea
                    id='sales-help'
                    name='helpDetails'
                    required
                    rows={ 4 }
                    placeholder='Tell us about your team and what you need'
                    value={ values.helpDetails }
                    onChange={ (e) => inputChanged('helpDetails', e.target.value) }
                    className='w-full resize-y rounded-[var(--radius-button)] border border-line bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition-colors duration-200 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100'
                />
            </div>

            {
                errorMessage &&
                    <div role='alert' className='flex items-start gap-2.5 rounded-[var(--radius-button)] bg-status-danger-soft px-4 py-3 text-sm text-ink-900 sm:col-span-2'>
                        <AlertCircle aria-hidden="true" className='mt-0.5 h-4 w-4 shrink-0 text-status-danger' strokeWidth={2}/>
                        <span>{ errorMessage }</span>
                    </div>
            }

            <Button type='submit' variant='primary' size='xl' isLoading={ isSubmitting } className='w-full sm:col-span-2'>
                { isSubmitting ? 'Sending…' : 'Send message' }
            </Button>
        </form>
    )
};


export default ContactSalesForm;
