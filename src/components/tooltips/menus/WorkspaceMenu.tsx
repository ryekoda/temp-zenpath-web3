"use client"
import { FC } from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { Menu, MenuDivider, MenuItem, MenuNote } from './MenuParts';



interface Props {
    company: any
    currentUser: any
    onPress: (name: string, data?: any) => void
}

// The ⋯ menu in each page header ('boardSettings'). Billing and deleting are admin-only.
const WorkspaceMenu: FC<Props> = ({ company, currentUser, onPress }) => {
    const isAdmin = Boolean(company?.admins?.includes(currentUser?.id))

    if (!isAdmin) {
        return <MenuNote>Only workspace admins can manage billing and workspace settings.</MenuNote>
    }

    return (
        <Menu label='Workspace settings' className='w-56'>
            <MenuItem icon={ <CreditCard/> } onClick={ () => onPress('billing') }>Billing & plans</MenuItem>
            <MenuDivider/>
            <MenuItem icon={ <Trash2/> } tone='danger' onClick={ () => onPress('deleteBoard') }>Delete workspace</MenuItem>
        </Menu>
    )
}


export default WorkspaceMenu;
