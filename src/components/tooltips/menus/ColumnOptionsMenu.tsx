"use client"
import { FC, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Menu, MenuItem } from './MenuParts';



interface Props {
    columnUID: string
    onPress: (name: string, data?: any) => void
}

// ⋯ menu on a custom column header ('listHeaderOptions'). Deleting takes a second click.
const ColumnOptionsMenu: FC<Props> = ({ columnUID, onPress }) => {
    const [isConfirming, setIsConfirming] = useState(false)

    // Start fresh for each column the menu opens on
    useEffect(() => setIsConfirming(false), [columnUID])

    return (
        <Menu label='Column options' className='w-52'>
            {
                isConfirming ?
                    <>
                        <p className='px-2.5 py-1.5 text-sm text-ink-700'>Delete this column and its data?</p>
                        <MenuItem icon={ <Trash2/> } tone='danger' onClick={ () => onPress('listHeader-delete', columnUID) }>Yes, delete column</MenuItem>
                        <MenuItem onClick={ () => setIsConfirming(false) }>Keep it</MenuItem>
                    </>
                :
                    <MenuItem icon={ <Trash2/> } tone='danger' onClick={ () => setIsConfirming(true) }>Delete column</MenuItem>
            }
        </Menu>
    )
}


export default ColumnOptionsMenu;
