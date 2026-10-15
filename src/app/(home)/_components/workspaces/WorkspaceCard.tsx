import { FC } from "react";
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/Utils';
import WorkspaceCover from '@/components/workspace/WorkspaceCover';



interface Props {
    company: any
}

const WorkspaceCard: FC<Props> = ({ company }) => {
    const title = CapitalizeFirstLetterOfEachWord(company.title ?? 'Untitled workspace')
    const memberCount = company.allActiveRoles?.length

    return (
        <li>
            <Link
                href={ `/${company.id}/planner` }
                className='group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-ink-400 hover:shadow-[0_18px_40px_-20px_rgba(16,26,51,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0'>
                <WorkspaceCover color={ company.theme?.color } image={ company.theme?.image } className='h-28'>
                    <p className='absolute bottom-3 left-4 right-4 truncate text-lg font-semibold text-white'>{ title }</p>
                </WorkspaceCover>

                <div className='flex items-center justify-between gap-3 px-4 py-3.5'>
                    <span className='flex items-center gap-2 text-sm text-ink-500'>
                        {
                            typeof memberCount === 'number' &&
                                <>
                                    <Users aria-hidden="true" className='h-4 w-4' strokeWidth={1.75}/>
                                    { memberCount } { memberCount === 1 ? 'member' : 'members' }
                                </>
                        }
                    </span>
                    <span className='flex items-center gap-1 text-sm font-semibold text-brand-700'>
                        Open
                        <ArrowRight aria-hidden="true" className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none' strokeWidth={2}/>
                    </span>
                </div>
            </Link>
        </li>
    )
};


export default WorkspaceCard;
