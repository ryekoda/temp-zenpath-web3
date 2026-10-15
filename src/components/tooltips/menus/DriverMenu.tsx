"use client"
import { FC } from 'react';
import { Users } from 'lucide-react';
import InitialsAvatar from '@/components/ui/InitialsAvatar';
import { CapitalizeFirstLetter } from '@/lib/format/text';
import { Menu, MenuDivider, MenuHeading, MenuItem, MenuNote } from './MenuParts';



interface Props {
    drivers: any[]
    onPress: (name: string, data?: any) => void
}

// Driver filter picker ('filterProfiles'), sorted by first name.
const DriverMenu: FC<Props> = ({ drivers, onPress }) => {
    const sorted = [...(drivers || [])].sort((a, b) => (a?.fName || '').toUpperCase().localeCompare((b?.fName || '').toUpperCase()))

    return (
        <Menu label='Filter by driver' className='w-64'>
            <MenuItem icon={ <Users/> } onClick={ () => onPress('filterProfiles', null) }>All drivers</MenuItem>
            <MenuDivider/>
            <MenuHeading>Drivers</MenuHeading>
            {
                sorted.length > 0 ?
                    <div className='max-h-72 overflow-y-auto'>
                        {
                            sorted.map((driver) => (
                                <MenuItem key={ driver.id } icon={ <InitialsAvatar first={ driver.fName } last={ driver.lName } className='h-6 w-6 text-[10px]'/> } onClick={ () => onPress('filterProfiles', driver.id) }>
                                    { CapitalizeFirstLetter(driver.fName) } { CapitalizeFirstLetter(driver.lName) }
                                </MenuItem>
                            ))
                        }
                    </div>
                :
                    <MenuNote>No drivers in this workspace yet.</MenuNote>
            }
        </Menu>
    )
}


export default DriverMenu;
