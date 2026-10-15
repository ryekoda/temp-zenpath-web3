"use client"
import { FC, useState } from "react";
import { Mail } from 'lucide-react';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/GlobalFunctions';
import { cn } from '@/lib/Utils';



const walkthroughs = [
    { label: 'Scheduling', title: 'Scheduling walkthrough', videoURL: 'https://www.youtube.com/embed/ewdJtD1o3VE' },
    { label: 'Drivers', title: 'Driver walkthrough', videoURL: 'https://www.youtube.com/embed/1R9ce5NPK_I' },
]

// Large local clips: they only load when played, so opening the panel stays fast.
const tips = [
    { title: 'Use columns to customize your boards', videoURL: '/videos/ColumnDemo.mp4' },
    { title: 'Invite your team and assign members to profiles', videoURL: '/videos/InviteDemo.mp4' },
]

const supportEmail = 'Support@teamtriply.com'

interface Props {
  userInfo: any
}

const HelpPanel: FC<Props> = ({ userInfo }) => {
  const [currentWalkthrough, setCurrentWalkthrough] = useState(0)
  const walkthrough = walkthroughs[currentWalkthrough]

  return (
    <div className='space-y-10'>
      <section>
        <p className='text-base text-ink-700'>
          { userInfo?.fName ? `Hi ${CapitalizeFirstLetterOfEachWord(userInfo.fName)}, w` : 'W' }atch these short videos to learn how Zenpath works.
        </p>

        <div role='tablist' aria-label='Walkthroughs' className='mt-5 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface-soft p-1'>
          {
            walkthroughs.map((item, index) => (
              <button
                key={ item.label }
                type='button'
                role='tab'
                aria-selected={ currentWalkthrough === index }
                onClick={ () => setCurrentWalkthrough(index) }
                className={cn('rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600', currentWalkthrough === index ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-900')}>
                Step { index + 1 }: { item.label }
              </button>
            ))
          }
        </div>

        <div className='mt-4 aspect-video overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-900'>
          <iframe
            key={ walkthrough.videoURL }
            className='h-full w-full'
            src={ walkthrough.videoURL }
            title={ walkthrough.title }
            loading='lazy'
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className='mt-2 text-sm font-medium text-ink-700'>{ walkthrough.title }</p>
      </section>

      <section>
        <h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500'>Quick tips</h3>
        <ul className='space-y-6'>
          {
            tips.map(tip => (
              <li key={ tip.videoURL }>
                <p className='mb-2 text-sm font-medium text-ink-900'>{ tip.title }</p>
                <video className='aspect-video w-full rounded-[var(--radius-card)] border border-line bg-surface-soft' controls muted playsInline preload='metadata'>
                  <source src={ tip.videoURL } type="video/mp4"/>
                </video>
              </li>
            ))
          }
        </ul>
      </section>

      <section className='rounded-[var(--radius-card)] bg-surface-soft p-5'>
        <h3 className='text-base font-semibold text-ink-900'>Found a bug?</h3>
        <p className='mt-1 text-sm text-ink-500'>Email us and we&apos;ll take a look.</p>
        <a href={ `mailto:${supportEmail}` } className='mt-3 inline-flex items-center gap-2 rounded text-sm font-semibold text-brand-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
          <Mail aria-hidden="true" className='h-4 w-4' strokeWidth={2}/>
          { supportEmail }
        </a>
      </section>
    </div>
  )
}


export default HelpPanel
