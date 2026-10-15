import { FC, useState } from "react";
import Link from 'next/link';
import { ArrowRight, Inbox, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import { FormatDate } from '@/lib/format/dates';
import { SavePendingInviteResponse } from './_utils/Actions';



type Response = 'accepted' | 'declined' | 'error'

interface Props {
    notifications?: any[]
    currentUser: any
    dbURL: string
}

const NotificationsPanel: FC<Props> = ({ notifications, currentUser, dbURL }) => {
    const [respondingTo, setRespondingTo] = useState('')
    const [responses, setResponses] = useState<Record<string, Response>>({})

    // Newest first (copied so the shared list isn't reordered in place)
    const sortedNotifications = [...(notifications ?? [])].sort((a, b) => b.createdAt - a.createdAt)



    async function respondPressed(notification: any, isApproved: boolean) {
        setRespondingTo(notification.id)

        const isSaved = await SavePendingInviteResponse(notification.id, notification.boardUID, currentUser, isApproved, dbURL)
        setResponses({ ...responses, [notification.id]: isSaved ? (isApproved ? 'accepted' : 'declined') : 'error' })
        setRespondingTo('')
    }


    if (sortedNotifications.length === 0) {
        return (
            <div className='flex flex-col items-center px-4 py-16 text-center'>
                <span className='mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700'>
                    <Inbox aria-hidden="true" className='h-6 w-6' strokeWidth={1.75}/>
                </span>
                <h3 className='text-lg font-semibold text-ink-900'>You&apos;re all caught up</h3>
                <p className='mt-1.5 text-sm text-ink-500'>Workspace invites will show up here.</p>
            </div>
        )
    }

    return (
        <ul className='space-y-3'>
            {
                sortedNotifications.map(notification => {
                    const title = CapitalizeFirstLetterOfEachWord(notification.boardTitle ?? 'A workspace')
                    const response = responses[notification.id]
                    const isAnswered = notification.isResponded || response === 'accepted' || response === 'declined'
                    const isResponding = respondingTo === notification.id

                    return (
                        <li key={ notification.id } className='rounded-[var(--radius-card)] border border-line p-4'>
                            <div className='flex gap-3'>
                                <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700'>
                                    <UserPlus aria-hidden="true" className='h-[18px] w-[18px]' strokeWidth={1.75}/>
                                </span>
                                <div className='min-w-0 flex-1'>
                                    <p className='text-sm text-ink-700'>
                                        <strong className='font-semibold text-ink-900'>{ title }</strong> invited you to join their workspace.
                                    </p>
                                    {
                                        notification.createdAt?.toDate &&
                                            <p className='mt-1 text-xs text-ink-500'>{ FormatDate(notification.createdAt.toDate()) }</p>
                                    }
                                </div>
                            </div>

                            {
                                response === 'accepted' ?
                                    <div className='mt-3 flex items-center justify-between rounded-lg bg-status-success-soft px-3 py-2 text-sm'>
                                        <span className='font-medium text-ink-900'>You joined { title }</span>
                                        <Link href={ `/${notification.boardUID}/planner` } className='flex items-center gap-1 font-semibold text-brand-700 hover:underline'>
                                            Open <ArrowRight aria-hidden="true" className='h-4 w-4' strokeWidth={2}/>
                                        </Link>
                                    </div>
                                : isAnswered ?
                                    <p className='mt-3 text-sm text-ink-500'>{ response === 'declined' ? 'Invite declined' : 'You responded to this invite' }</p>
                                :
                                    <>
                                        { response === 'error' && <p role='alert' className='mt-3 text-sm text-status-danger'>Something went wrong. Please try again.</p> }
                                        <div className='mt-3 flex gap-2 pl-12'>
                                            <Button variant='primary' size='sm' isLoading={ isResponding } disabled={ Boolean(respondingTo) } onClick={ () => respondPressed(notification, true) } className='h-9 px-4 font-semibold'>
                                                Accept
                                            </Button>
                                            <Button variant='secondary' size='sm' disabled={ Boolean(respondingTo) } onClick={ () => respondPressed(notification, false) } className='h-9 px-4 font-semibold'>
                                                Decline
                                            </Button>
                                        </div>
                                    </>
                            }
                        </li>
                    )
                })
            }
        </ul>
    )
};


export default NotificationsPanel;
