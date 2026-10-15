"use client"
import { FC } from 'react';
import { Type } from 'lucide-react';
import { Menu, MenuHeading, MenuItem } from './MenuParts';



interface Props {
    onPress: (name: string, data?: any) => void
}

// + button after the last column ('addListColumn'). Text is the only custom column type so far.
const AddColumnMenu: FC<Props> = ({ onPress }) => {
    return (
        <Menu label='Add a column' className='w-52'>
            <MenuHeading>Add a column</MenuHeading>
            <MenuItem icon={ <Type/> } onClick={ () => onPress('listHeader-add', 'text') }>Text</MenuItem>
        </Menu>
    )
}


export default AddColumnMenu;
