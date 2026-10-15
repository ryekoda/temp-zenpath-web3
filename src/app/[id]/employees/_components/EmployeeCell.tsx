import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { MessageSquare, UserCheck, UserPlus } from 'lucide-react';
import { cn } from '@/lib/cn';
import ListRow from '@/app/[id]/_components/ListRow';
import InitialsAvatar from '@/components/ui/InitialsAvatar';
import { tooltipAnchor } from '@/app/[id]/_components/WorkspacePageHeader';

import { GetData } from '@/lib/data/getData';



// Column uid of the employee's name in the employee table settings
const NAME_COLUMN = '34057'

interface Props {
    index: number
    name: string
    item: any
    allUsers: any
    allClients: any
    allEmployees: any
    showHeaders: any
    headerTitles: any
    itemSpecs: any
    onPress: any
}

const EmployeeCell: FC<Props> = ({ index, name, item, allUsers, allClients, allEmployees, showHeaders, headerTitles, itemSpecs, onPress }) => {
    const data: any = GetData(name, item, headerTitles, showHeaders && headerTitles ? allUsers : allClients, allEmployees)
    const [{isDragging}, drag] = useDrag(() => ({ type: "Cell", collect: monitor => ({ isDragging: !!monitor.isDragging(), }), }))
    const isLinked = Boolean(data['userUID'])

    return (
        <ListRow
            columns={ headerTitles }
            itemSpecs={ itemSpecs }
            primaryColumn={ NAME_COLUMN }
            getValue={ (header) => data[header.type !== 'ref' ? header.uid : header.options.ref[0].value] }
            onOpen={ () => onPress(null, 'edit', item, index, 0, true) }
            openLabel={ `Edit ${data[NAME_COLUMN] || 'employee'}` }
            leading={ <InitialsAvatar first={ item.fName } last={ item.lName }/> }
            trailing={
                <div className='ml-auto flex shrink-0 items-center gap-3'>
                    { data['comments'] && <MessageSquare role='img' aria-label='Has comments' className='h-4 w-4 text-ink-400'/> }
                    <button
                        type='button'
                        onClick={ (e) => { e.stopPropagation(); onPress(tooltipAnchor(e), 'linkAccount', item, index, 0, false) } }
                        title={ isLinked ? 'Linked to a workspace member. Click to change.' : 'Link this employee to a workspace member' }
                        className={ cn(
                            'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600',
                            isLinked ? 'border-transparent bg-brand-50 text-brand-700 hover:bg-brand-100' : 'border-line bg-white text-ink-500 hover:bg-surface-soft hover:text-ink-900'
                        ) }>
                        { isLinked ? <UserCheck aria-hidden="true" className='h-3.5 w-3.5'/> : <UserPlus aria-hidden="true" className='h-3.5 w-3.5'/> }
                        { isLinked ? 'Linked' : 'Link account' }
                    </button>
                </div>
            }
            dragRef={ drag }
            isDragging={ isDragging }/>
    )
}


export default EmployeeCell;
