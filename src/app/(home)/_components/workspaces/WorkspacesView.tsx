"use client"
import { FC, useState } from 'react';
import { LayoutGrid, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCompanies } from '@/hooks/useCompany';
import { Button } from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { CapitalizeFirstLetter } from '@/lib/Utils';
import WorkspaceCard from './WorkspaceCard';
import CreateWorkspaceForm from './CreateWorkspaceForm';



interface Props {}

const WorkspacesView: FC<Props> = ({}) => {
    const { currentUser, dbURL } = useAuth()
    const [refreshUID, setRefreshUID] = useState(0)
    const { companies, isLoading } = useCompanies(currentUser, true, refreshUID, dbURL)
    const [isCreating, setIsCreating] = useState(false)

    const firstName = currentUser?.fName ? CapitalizeFirstLetter(currentUser.fName) : ''



    function workspaceCreated() {
        setIsCreating(false)
        setRefreshUID(Date.now())
    }


    return (
        // Leaves room for the fixed 80px side nav
        <div className='min-h-screen bg-surface-soft md:pl-20'>
            <div className='mx-auto w-full max-w-[1200px] px-6 py-12 lg:px-12 lg:py-16'>
                <header className='mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
                    <div>
                        { firstName && <p className='mb-2 text-base font-medium text-ink-500'>Welcome back, { firstName }</p> }
                        <h1 className='text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-[40px]'>
                            Your workspaces
                        </h1>
                        <p className='mt-3 text-base text-ink-500'>
                            Open a workspace to plan trips, manage your team, and track rides.
                        </p>
                    </div>

                    {
                        !isLoading && companies.length > 0 &&
                            <Button variant='primary' size='xl' onClick={ () => setIsCreating(true) } className='shrink-0 gap-2'>
                                <Plus aria-hidden="true" className='h-5 w-5' strokeWidth={2.25}/>
                                New workspace
                            </Button>
                    }
                </header>

                {
                    isLoading ?
                        <ul aria-busy='true' aria-label='Loading workspaces' className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                            {
                                [0, 1, 2].map(index => (
                                    <li key={ index } className='overflow-hidden rounded-[var(--radius-card)] border border-line bg-white'>
                                        <div className='h-28 animate-pulse bg-line motion-reduce:animate-none'/>
                                        <div className='px-4 py-4'>
                                            <div className='h-3 w-24 animate-pulse rounded-full bg-line motion-reduce:animate-none'/>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    : companies.length === 0 ?
                        <div className='flex flex-col items-center rounded-[var(--radius-panel)] border border-dashed border-line bg-white px-6 py-16 text-center'>
                            <span className='mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700'>
                                <LayoutGrid aria-hidden="true" className='h-6 w-6' strokeWidth={1.75}/>
                            </span>
                            <h2 className='text-2xl font-bold tracking-tight text-ink-900'>Create your first workspace</h2>
                            <p className='mt-2 max-w-[400px] text-base text-ink-500'>
                                A workspace holds your team&apos;s clients, drivers, and trips in one place.
                            </p>
                            <Button variant='primary' size='xl' onClick={ () => setIsCreating(true) } className='mt-8 gap-2'>
                                <Plus aria-hidden="true" className='h-5 w-5' strokeWidth={2.25}/>
                                New workspace
                            </Button>
                        </div>
                    :
                        <ul className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                            {
                                companies.map((company: any) => (
                                    <WorkspaceCard key={ company.id } company={ company }/>
                                ))
                            }

                            <li>
                                <button
                                    type='button'
                                    onClick={ () => setIsCreating(true) }
                                    className='flex h-full min-h-[172px] w-full flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border-2 border-dashed border-line bg-transparent text-ink-500 transition-colors duration-200 hover:border-brand-600 hover:bg-white hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2'>
                                    <span className='flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700'>
                                        <Plus aria-hidden="true" className='h-5 w-5' strokeWidth={2.25}/>
                                    </span>
                                    <span className='text-base font-semibold'>New workspace</span>
                                </button>
                            </li>
                        </ul>
                }
            </div>

            <Dialog
                isOpen={ isCreating }
                onClose={ () => setIsCreating(false) }
                title='Create a workspace'
                description='Give it a name and pick a background. You can invite your team afterwards.'>
                <CreateWorkspaceForm currentUser={ currentUser } dbURL={ dbURL } onCancel={ () => setIsCreating(false) } onCreated={ workspaceCreated }/>
            </Dialog>
        </div>
    )
};


export default WorkspacesView;
