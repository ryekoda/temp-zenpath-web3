import { FC } from "react";
import { X } from 'lucide-react';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';
import InitialsAvatar from '@/components/ui/InitialsAvatar';
import { Menu, MenuDivider, MenuHeading, MenuItem, MenuNote } from '@/components/tooltips/menus/MenuParts';



interface Props {
    name: string
    data: any
    supportingData: any
    onPress: any
}

// Link an employee to a workspace member's account ('linkAccount' tooltip on the employees page).
const LinkAccountMenu: FC<Props> = ({ name, data, supportingData, onPress }) => {

    function GetActiveMembers(members: any, allEmployees: any[]) {
        let unusedMembers = []
        let usedMember = null

        for (let i = 0; i < members.length; i++) {
          const member = members[i]
          const memberUID = member.userUID

          if (allEmployees.filter(function(e) { return e['userUID'] === memberUID; }).length > 0) {

            if (data && data['userUID'] === memberUID) {
                usedMember = member
                usedMember['employeeUID'] = data.id
            }
          } else {
            if (unusedMembers.filter(function(e) { return e['userUID'] === memberUID; }).length > 0) {

            } else {
              if (member['userUID']) {
                let theMember = member
                theMember['employeeUID'] = data.id
                unusedMembers.push(theMember)
              }
            }
          }
        }

        return { used: usedMember, unUsed: unusedMembers }
    }

    if (name !== 'linkAccount' || !data) return null

    const { used, unUsed } = GetActiveMembers(supportingData.items, supportingData.allItems)
    const nameParts = (userName?: string) => (userName || '').split(' ')

    return (
        <Menu label='Link a workspace account' className='w-64'>
            {
                used &&
                    <>
                        <MenuHeading>Linked account</MenuHeading>
                        <div className="flex items-center gap-2.5 rounded-[var(--radius-button)] bg-brand-50 px-2.5 py-1.5">
                            <InitialsAvatar first={ nameParts(used.userName)[0] } last={ nameParts(used.userName)[1] } className='h-6 w-6 text-[10px]'/>
                            <span className="min-w-0 grow truncate text-sm font-medium text-ink-900">{ CapitalizeFirstLetterOfEachWord(used.userName) }</span>
                            <button type='button' role='menuitem' onClick={ () => onPress('linkAccount-remove', used) } aria-label={ `Unlink ${CapitalizeFirstLetterOfEachWord(used.userName)}` } className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors duration-200 hover:bg-white hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'>
                                <X aria-hidden="true" className='h-4 w-4'/>
                            </button>
                        </div>
                        <MenuDivider/>
                    </>
            }

            <MenuHeading>{ used ? 'Switch to' : 'Link a workspace member' }</MenuHeading>
            {
                unUsed.length > 0 ?
                    unUsed.map((item: any) => (
                        <MenuItem key={ item.userUID } icon={ <InitialsAvatar first={ nameParts(item.userName)[0] } last={ nameParts(item.userName)[1] } className='h-6 w-6 text-[10px]'/> } onClick={ () => onPress('linkAccount-add', item) }>
                            { CapitalizeFirstLetterOfEachWord(item.userName) }
                        </MenuItem>
                    ))
                :
                    <MenuNote>Every workspace member is already linked to an employee.</MenuNote>
            }
        </Menu>
    )
};


export default LinkAccountMenu;
