"use client"
import { FC, useState } from "react";
import { LogOut, Smartphone } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Logout } from '@/helpers/firebase/FirebaseAuth';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import { cn } from '@/lib/cn';



// Same store links used in the in-app modals.
const appLinks = [
  { label: 'App Store', href: 'https://apps.apple.com/us/app/zenpath-fleet-management/id6443650553' },
  { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.zenpath.app' },
]

interface Props {
  currentUser: any
}

const ProfilePanel: FC<Props> = ({ currentUser }) => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const fullName = CapitalizeFirstLetterOfEachWord(`${currentUser?.fName ?? ''} ${currentUser?.lName ?? ''}`.trim())
  const initials = `${currentUser?.fName?.charAt(0) ?? ''}${currentUser?.lName?.charAt(0) ?? ''}`.toUpperCase()



  async function signOutPressed() {
    setIsSigningOut(true)
    await Logout()
    // Full page load to the home page, so the app starts fresh as a signed-out visitor
    window.location.assign('/')
  }


  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-4'>
        <span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700'>
          { initials }
        </span>
        <div className='min-w-0'>
          <p className='truncate text-lg font-semibold text-ink-900'>{ fullName }</p>
          { currentUser?.email && <p className='truncate text-sm text-ink-500'>{ currentUser.email }</p> }
        </div>
      </div>

      <section className='rounded-[var(--radius-card)] border border-line p-5'>
        <div className='flex items-start gap-3'>
          <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700'>
            <Smartphone aria-hidden="true" className='h-[18px] w-[18px]' strokeWidth={1.75}/>
          </span>
          <div>
            <h3 className='text-base font-semibold text-ink-900'>Get the mobile app</h3>
            <p className='mt-1 text-sm text-ink-500'>Use Zenpath on your phone with the iOS and Android apps.</p>
          </div>
        </div>
        <div className='mt-4 grid grid-cols-2 gap-2'>
          {
            appLinks.map(link => (
              <a key={ link.label } href={ link.href } target='_blank' rel='noopener noreferrer' className={cn(buttonVariants({ variant: 'secondary' }), 'h-10 text-sm font-semibold')}>
                { link.label }
              </a>
            ))
          }
        </div>
      </section>

      <Button type='button' variant='secondary' size='xl' isLoading={ isSigningOut } onClick={ signOutPressed } className='w-full gap-2 text-status-danger hover:bg-status-danger-soft'>
        { !isSigningOut && <LogOut aria-hidden="true" className='h-5 w-5' strokeWidth={2}/> }
        { isSigningOut ? 'Signing out…' : 'Sign out' }
      </Button>
    </div>
  )
}


export default ProfilePanel
