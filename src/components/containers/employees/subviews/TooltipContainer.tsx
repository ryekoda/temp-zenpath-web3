import { FC } from "react";
import Image from 'next/image';
import Paragraph from '@/components/ui/Paragraph';
import { Button } from '@/components/ui/Button';
import { CapitalizeFirstLetter, CapitalizeFirstLetterOfEachWord } from '@/lib/GlobalFunctions';
import { cn } from '@/lib/Utils';



interface Props {
    name: string
    data: any
    supportingData: any
    onPress: any
}

const TooltipContainer: FC<Props> = ({ name, data, supportingData, onPress }) => {

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

    
    return (
        <div className="w-64">
            {
                (name === 'linkAccount' && GetActiveMembers(supportingData.items, supportingData.allItems).used) &&
                    <div className="flex flex-row pb-2 relative">
                        <div className="bg-[#D93F67] h-[34px] aspect-square ml-[1px] mt-[1px] rounded-full overflow-hidden">
                            <Paragraph className="text-white font-bold mt-[5px]" size='sm'>
                                { CapitalizeFirstLetter(GetActiveMembers(supportingData.items, supportingData.allItems).used.userName.charAt(0)) }
                            </Paragraph>
                        </div>
                        <Paragraph className="whitespace-nowrap truncate mt-[6px] max-w-36 text-left px-2" size='sm'>
                            { CapitalizeFirstLetterOfEachWord(GetActiveMembers(supportingData.items, supportingData.allItems).used.userName) }
                        </Paragraph>
                        <Button variant='ghost' onClick={ () => onPress('linkAccount-remove', GetActiveMembers(supportingData.items, supportingData.allItems).used) } className={cn('className')}>
                            <Image src="/images/close.png" alt="close icon" width={12} height={12}/>
                        </Button>
                    </div>
            }

            <Paragraph className='w-full text-left font-bold mt-3' size='xs'>
                Assign Profile
            </Paragraph>

            {
                GetActiveMembers(supportingData.items, supportingData.allItems).unUsed.map((item: any) => (
                    <div key={ item.userUID } className="mt-1">
                        <Button variant='ghost' onClick={ () => onPress('linkAccount-add', item) } className={cn('className', 'w-full flex justify-start py-[25px]')}>
                            <div className="bg-[#D93F67] h-[34px] aspect-square ml-[1px] mt-[1px] rounded-full overflow-hidden">
                                <Paragraph className="text-white font-bold mt-[5px]" size='sm'>
                                    { CapitalizeFirstLetter(item.fName ? item.fName.charAt(0) : '') }{ CapitalizeFirstLetter(item.userName ? item.userName.charAt(0) : '') }
                                </Paragraph>
                            </div>
                            <Paragraph size='sm' style={{ marginLeft: '10px', marginTop: '8px' }}>
                                { CapitalizeFirstLetterOfEachWord(item.userName) }
                            </Paragraph>
                        </Button>
                    </div>
                ))
            }

            {
                (GetActiveMembers(supportingData.items, supportingData.allItems).unUsed.length === 0) &&
                    <Paragraph className="text-left mt-[8px] pb-[20px]" size='xs'>
                        *All members are currently assigned*
                    </Paragraph>
            }
        </div>
    )
};


export default TooltipContainer;
