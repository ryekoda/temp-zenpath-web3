'use client'

import { FC, useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import Container from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/cn';



// Products and Solutions jump to the matching homepage sections until they have their own pages.
// Resources goes to the sales contact form for now. Point these at real pages once they exist.
const centerLinks = [
    { label: 'Products', href: '/#product' },
    { label: 'Solutions', href: '/#solutions' },
    { label: 'Resources', href: '/sales' },
    { label: 'Pricing', href: '/pricing' },
]

const loginLink = { label: 'Log in', href: '/login' }

const startLink = { label: 'Get Started', href: '/register' }

const linkStyle = 'rounded-md px-3 py-2 text-[15px] font-semibold text-ink-900 transition-colors duration-200 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'

interface Props {}

const MarketingNav: FC<Props> = ({}) => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)



    useEffect(() => {
        const updateScrolled = () => setIsScrolled(window.scrollY > 8)

        updateScrolled()
        window.addEventListener('scroll', updateScrolled, { passive: true })
        return () => window.removeEventListener('scroll', updateScrolled)
    }, [])


    return (
        <header className={cn('h-[72px] w-full border-b transition-[background-color,box-shadow] duration-200', isScrolled ? 'border-line bg-white shadow-[0_4px_18px_rgba(16,26,51,0.12)]' : 'border-transparent bg-transparent')}>
            <Container className='flex h-full items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]'>
                <Link href='/' className='justify-self-start rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                    <Image src="/images/Logo_Full.png" alt="Zenpath" width={2562} height={520} sizes="180px" priority className='h-8 w-auto sm:h-9'/>
                </Link>

                <nav aria-label='Main' className='hidden items-center gap-2 lg:flex xl:gap-6'>
                    {
                        centerLinks.map(link => (
                            <Link key={ link.label } href={ link.href } className={ linkStyle }>
                                { link.label }
                            </Link>
                        ))
                    }
                </nav>

                <div className='hidden items-center gap-3 justify-self-end whitespace-nowrap lg:flex'>
                    <Link href={ loginLink.href } className={ linkStyle }>
                        { loginLink.label }
                    </Link>
                    <Link href={ startLink.href } className={cn(buttonVariants({ variant: 'primary' }), 'h-11 px-5 text-[15px] font-semibold')}>
                        { startLink.label }
                    </Link>
                </div>

                <button type='button' aria-label='Open menu' onClick={ () => setIsDrawerOpen(true) } className='flex h-11 w-11 items-center justify-center rounded-md text-ink-900 hover:bg-surface-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 lg:hidden'>
                    <Menu className='h-6 w-6' strokeWidth={2}/>
                </button>

                <Drawer isOpen={ isDrawerOpen } setIsOpen={ setIsDrawerOpen } direction='right'>
                    <nav aria-label='Mobile' className='flex flex-col gap-1 p-4'>
                        {
                            [...centerLinks, loginLink].map(link => (
                                <Link key={ link.label } href={ link.href } className={cn(linkStyle, 'py-3')}>
                                    { link.label }
                                </Link>
                            ))
                        }
                        <Link href={ startLink.href } className={cn(buttonVariants({ variant: 'primary' }), 'mt-3 h-12 font-semibold')}>
                            { startLink.label }
                        </Link>
                    </nav>
                </Drawer>
            </Container>
        </header>
    )
};

MarketingNav.displayName = 'MarketingNav'


export default MarketingNav;
