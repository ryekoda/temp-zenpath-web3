"use client"
import { FC } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CapitalizeFirstLetter } from '@/lib/format/text';
import { Menu, MenuHeading, MenuItem } from './MenuParts';



interface Props {
    checkboxes: any[]
    setCheckboxes: (items: any[]) => void
    onPress: (name: string, data?: any) => void
}

// Show / hide table columns ('visibleHeaders'). Each toggle saves straight away.
const ColumnVisibilityMenu: FC<Props> = ({ checkboxes, setCheckboxes, onPress }) => {
    function toggle(value: string) {
        setCheckboxes(checkboxes.map((checkbox) => {
            const isToggled = (checkbox.uid || checkbox.title) === value
            const item = { uid: checkbox.uid, title: checkbox.title, isHidden: isToggled ? !checkbox.isHidden : checkbox.isHidden }

            if (isToggled) onPress('visibleHeaders', item)
            return item
        }))
    }

    return (
        <Menu label='Show columns' className='w-60'>
            <MenuHeading>Show columns</MenuHeading>
            <div className='max-h-80 overflow-y-auto'>
                {
                    checkboxes.map((item) => {
                        const isVisible = !item.isHidden

                        return (
                            <MenuItem
                                key={ item.uid || item.title }
                                checked={ isVisible }
                                onClick={ () => toggle(item.uid || item.title) }
                                icon={
                                    <span className={ cn('flex h-4 w-4 items-center justify-center rounded border', isVisible ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-400 bg-white') }>
                                        { isVisible && <Check className='!h-3 !w-3' strokeWidth={3}/> }
                                    </span>
                                }>
                                { CapitalizeFirstLetter(item.title) }
                            </MenuItem>
                        )
                    })
                }
            </div>
        </Menu>
    )
}


export default ColumnVisibilityMenu;
