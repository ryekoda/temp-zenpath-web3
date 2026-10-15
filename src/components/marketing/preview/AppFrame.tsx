import { FC, ReactNode } from "react";
import Image from 'next/image';
import { CalendarDays, ChevronDown, FileText, Home, User, Users } from 'lucide-react';
import { cn } from '@/lib/cn';



const navItems = [
    { label: 'Trips', icon: Home },
    { label: 'Employees', icon: Users },
    { label: 'Clients', icon: User },
    { label: 'Reports', icon: FileText },
]

interface Props {
    activeView: 'schedule' | 'map'
    children: ReactNode
    className?: string
}

// A static, non-interactive replica of the Zenpath app shell used in marketing previews.
const AppFrame: FC<Props> = ({ activeView, children, className }) => {
    return (
        <div className={cn('flex overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[0_24px_60px_-28px_rgba(16,26,51,0.28)]', className)}>
            <div className='hidden w-[168px] shrink-0 flex-col border-r border-line px-3 py-5 md:flex'>
                <div className='mb-6 flex items-center gap-2 px-2'>
                    <Image src="/images/LogoIcon.png" alt="" width={22} height={22}/>
                    <span className='text-[17px] font-bold tracking-tight text-ink-900'>Zenpath</span>
                </div>
                {
                    navItems.map(({ label, icon: Icon }) => (
                        <div key={ label } className={cn('mb-1 flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium', label === 'Trips' ? 'bg-brand-50 text-brand-700' : 'text-ink-700')}>
                            <Icon className='h-4 w-4' strokeWidth={1.75}/>
                            { label }
                        </div>
                    ))
                }
            </div>

            <div className='min-w-0 flex-1 p-4 sm:p-5'>
                <div className='mb-4 flex flex-wrap items-start justify-between gap-3'>
                    <div>
                        <p className='text-xl font-bold tracking-tight text-ink-900'>Trips</p>
                        <p className='text-xs text-ink-500'>Care Transit</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='hidden items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink-700 sm:inline-flex'>
                            <CalendarDays className='h-3.5 w-3.5' strokeWidth={1.75}/>
                            Today
                            <ChevronDown className='h-3.5 w-3.5 text-ink-400' strokeWidth={1.75}/>
                        </span>
                        <span className='inline-flex rounded-lg border border-line p-0.5 text-xs font-semibold'>
                            <span className={cn('rounded-md px-3 py-1', activeView === 'schedule' ? 'bg-brand-600 text-white' : 'text-ink-700')}>Schedule</span>
                            <span className={cn('rounded-md px-3 py-1', activeView === 'map' ? 'bg-brand-600 text-white' : 'text-ink-700')}>Map</span>
                        </span>
                    </div>
                </div>

                { children }
            </div>
        </div>
    )
};


export default AppFrame;
