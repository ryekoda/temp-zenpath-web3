'use client'

import { FC, ReactNode, useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell, HelpCircle, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/cn';
import SidebarPanel from './SidebarPanel';
import NotificationsPanel from './NotificationsPanel';
import HelpPanel from './HelpPanel';
import ProfilePanel from './ProfilePanel';



type PanelName = 'notifications' | 'help' | 'profile'

const panelTitles: Record<PanelName, string> = {
    notifications: 'Notifications',
    help: 'Help center',
    profile: 'Your profile',
}

const itemStyle = 'group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'

// Label that appears to the right of an icon on hover or keyboard focus.
const Tooltip: FC<{ children: ReactNode }> = ({ children }) => (
    <span aria-hidden="true" className='pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100'>
        { children }
    </span>
)

function GetInitials(user: any) {
    return `${user?.fName?.charAt(0) ?? ''}${user?.lName?.charAt(0) ?? ''}`.toUpperCase()
}

interface Props {}

// The 80px icon bar shown on every page once the user is signed in.
const AppSidebar: FC<Props> = ({}) => {
    const { currentUser, dbURL } = useAuth()
    const notifications = useNotifications(currentUser, dbURL) as any[] | undefined
    const pathname = usePathname()
    const [openPanel, setOpenPanel] = useState<PanelName | null>(null)

    const pendingInviteCount = (notifications ?? []).filter(notification => !notification.isResponded).length



    // Close the panel when navigating, and on Escape
    useEffect(() => { setOpenPanel(null) }, [pathname])
    useEffect(() => {
        const closeOnEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenPanel(null) }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [])

    function togglePanel(name: PanelName) {
        setOpenPanel(openPanel === name ? null : name)
    }

    function panelButtonStyle(name: PanelName) {
        return cn(itemStyle, openPanel === name ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-surface-soft hover:text-ink-900')
    }


    return (
        <div className='hidden md:block'>
            <nav aria-label='App' className='relative z-10 flex h-screen w-20 flex-col items-center border-r border-line bg-white py-5'>
                <Link href='/' className='mb-6 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                    <Image src="/images/LogoIcon.png" alt="Zenpath home" width={32} height={32} priority/>
                </Link>

                <ul className='flex flex-col items-center gap-2'>
                    <li>
                        <Link
                            href='/'
                            aria-current={ pathname === '/' && !openPanel ? 'page' : undefined }
                            onClick={ () => setOpenPanel(null) }
                            className={cn(itemStyle, pathname === '/' && !openPanel ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-surface-soft hover:text-ink-900')}>
                            <LayoutGrid aria-hidden="true" className='h-[22px] w-[22px]' strokeWidth={1.75}/>
                            <span className='sr-only'>Workspaces</span>
                            <Tooltip>Workspaces</Tooltip>
                        </Link>
                    </li>
                    <li>
                        <button type='button' onClick={ () => togglePanel('notifications') } aria-expanded={ openPanel === 'notifications' } className={ panelButtonStyle('notifications') }>
                            <Bell aria-hidden="true" className='h-[22px] w-[22px]' strokeWidth={1.75}/>
                            {
                                pendingInviteCount > 0 &&
                                    <span aria-hidden="true" className='absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-status-danger px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white'>
                                        { pendingInviteCount > 9 ? '9+' : pendingInviteCount }
                                    </span>
                            }
                            <span className='sr-only'>Notifications{ pendingInviteCount > 0 ? `, ${pendingInviteCount} pending` : '' }</span>
                            <Tooltip>Notifications</Tooltip>
                        </button>
                    </li>
                </ul>

                <div className='mt-auto flex flex-col items-center gap-4'>
                    <button type='button' onClick={ () => togglePanel('help') } aria-expanded={ openPanel === 'help' } className={ panelButtonStyle('help') }>
                        <HelpCircle aria-hidden="true" className='h-[22px] w-[22px]' strokeWidth={1.75}/>
                        <span className='sr-only'>Help center</span>
                        <Tooltip>Help center</Tooltip>
                    </button>

                    <span aria-hidden="true" className='h-px w-10 bg-line'/>

                    <button type='button' onClick={ () => togglePanel('profile') } aria-expanded={ openPanel === 'profile' } className='group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2'>
                        <span className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 ring-2 transition-shadow duration-200', openPanel === 'profile' ? 'ring-brand-600' : 'ring-transparent group-hover:ring-brand-100')}>
                            { GetInitials(currentUser) }
                        </span>
                        <span className='sr-only'>Your profile</span>
                        <Tooltip>Your profile</Tooltip>
                    </button>
                </div>
            </nav>

            <SidebarPanel isOpen={ openPanel !== null } onClose={ () => setOpenPanel(null) } title={ openPanel ? panelTitles[openPanel] : '' }>
                { openPanel === 'notifications' && <NotificationsPanel notifications={ notifications } currentUser={ currentUser } dbURL={ dbURL }/> }
                { openPanel === 'help' && <HelpPanel userInfo={ currentUser }/> }
                { openPanel === 'profile' && <ProfilePanel currentUser={ currentUser }/> }
            </SidebarPanel>
        </div>
    )
};

AppSidebar.displayName = 'AppSidebar'


export default AppSidebar;
