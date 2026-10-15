"use client"
import { FC, FormEvent, useState } from 'react';
import validator from 'validator';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fieldClassName, labelClassName, selectClassName } from '@/components/ui/input/fieldStyles';
import InitialsAvatar from '@/components/ui/InitialsAvatar';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import { Invite, InviteRole, inviteRoles, RemoveInvite } from '../_utils/inviteActions';



interface Props {
    userInfo: any
    company: any
    setRefreshUID: any
    dbURL: string
}

// Invite people to the workspace and manage who's in it.
const InviteView: FC<Props> = ({ userInfo, company, setRefreshUID, dbURL }) => {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<InviteRole>('admin')
    const [errorMessage, setErrorMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [confirmingRemoval, setConfirmingRemoval] = useState<string | null>(null)

    const isValidEmail = validator.isEmail(email)
    const selectedRole = inviteRoles.find((option) => option.value === role)
    const members: any[] = company?.allActiveRoles || []

    async function sendInvite(e: FormEvent) {
        e.preventDefault()
        if (!isValidEmail) return

        setIsSending(true)
        setErrorMessage('')
        await Invite(email, role, company, userInfo, setErrorMessage, dbURL, setEmail, setRefreshUID)
        setIsSending(false)
    }

    function removeMember(member: any) {
        RemoveInvite(member, company, dbURL, setRefreshUID)
        setConfirmingRemoval(null)
    }

    return (
        <div>
            <form onSubmit={ sendInvite }>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
                    <div className='grow'>
                        <label htmlFor='invite-email' className={ labelClassName }>Email address</label>
                        <input
                            id='invite-email'
                            type='email'
                            value={ email }
                            onChange={ (e) => { setEmail(e.target.value); setErrorMessage('') } }
                            placeholder='name@company.com'
                            autoComplete='off'
                            aria-invalid={ Boolean(errorMessage) }
                            aria-describedby={ errorMessage ? 'invite-error' : 'invite-role-help' }
                            className={ fieldClassName }/>
                    </div>
                    <div className='sm:w-36'>
                        <label htmlFor='invite-role' className={ labelClassName }>Role</label>
                        <select id='invite-role' value={ role } onChange={ (e) => setRole(e.target.value as InviteRole) } className={ selectClassName }>
                            { inviteRoles.map((option) => <option key={ option.value } value={ option.value }>{ option.label }</option>) }
                        </select>
                    </div>
                </div>

                <p id='invite-role-help' className='mt-2 text-sm text-ink-500'>
                    <span className='font-medium text-ink-700'>{ selectedRole?.label }:</span> { selectedRole?.description }
                </p>

                { errorMessage && <p id='invite-error' role='alert' className='mt-3 rounded-[var(--radius-button)] bg-status-danger-soft px-3 py-2 text-sm text-ink-900'>{ errorMessage }</p> }

                <Button type='submit' variant='primary' isLoading={ isSending } disabled={ !isValidEmail || isSending } className='mt-4 h-11 w-full gap-2 font-semibold'>
                    { !isSending && <Send aria-hidden="true" className='h-4 w-4'/> }
                    Send invite
                </Button>
            </form>

            <div className='mt-6 border-t border-line pt-5'>
                <h3 className='text-sm font-semibold text-ink-900'>
                    People in this workspace <span className='font-normal text-ink-500'>· { members.length }</span>
                </h3>

                <ul className='mt-3 divide-y divide-line'>
                    {
                        members.map((member: any) => {
                            const key = member.userUID || member.email
                            const isPending = member.status === 'pending'
                            const name = isPending ? member.email : CapitalizeFirstLetterOfEachWord(member.userName || member.email || '')
                            const [first, last] = (member.userName || member.email || '').split(' ')
                            const canRemove = member.role !== 'admin'

                            return (
                                <li key={ key } className='flex items-center gap-3 py-3'>
                                    <InitialsAvatar first={ first } last={ last }/>
                                    <div className='min-w-0 grow'>
                                        <p className='truncate text-sm font-medium text-ink-900'>{ name }</p>
                                        { !isPending && member.email && <p className='truncate text-xs text-ink-500'>{ member.email }</p> }
                                    </div>
                                    { isPending && <span className='rounded-full bg-status-warning-soft px-2 py-0.5 text-xs font-medium text-ink-900'>Invited</span> }
                                    <span className='w-14 text-right text-sm text-ink-700'>{ CapitalizeFirstLetterOfEachWord(member.role || '') }</span>
                                    {
                                        !canRemove ?
                                            <span className='w-8'/>
                                        : confirmingRemoval === key ?
                                            <div className='flex items-center gap-1'>
                                                <Button variant='danger' size='sm' onClick={ () => removeMember(member) } className='h-8 px-3 text-xs font-semibold'>
                                                    { isPending ? 'Cancel invite' : 'Remove' }
                                                </Button>
                                                <Button variant='ghost' size='sm' onClick={ () => setConfirmingRemoval(null) } className='h-8 px-2 text-xs text-ink-700'>
                                                    Keep
                                                </Button>
                                            </div>
                                        :
                                            <button type='button' onClick={ () => setConfirmingRemoval(key) } aria-label={ `Remove ${name}` } className='flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition-colors duration-200 hover:bg-status-danger-soft hover:text-status-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                                                <X aria-hidden="true" className='h-4 w-4'/>
                                            </button>
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}


export default InviteView;
