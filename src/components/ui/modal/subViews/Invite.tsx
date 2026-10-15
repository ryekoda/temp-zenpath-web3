"use client"
import { FC, useState } from 'react';
import Image from 'next/image';
import validator from 'validator';
import Input from '@/components/ui/input/Input';
import Paragraph from '@/components/ui/Paragraph';
import { Button } from '@/components/ui/Button';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/GlobalFunctions';
import { cn } from '@/lib/Utils';
import { HandleEmailInviteChange, Invite, RemoveInvite, ChangeInviteType } from '../Actions';



interface Props {
    userInfo: any
    company: any
    setRefreshUID: any
    dbURL: string
}

const Invite_Container: React.FC<Props> = ({ userInfo, company, setRefreshUID, dbURL }) => {
    const [value, setValue] = useState('');
    const [type, setType] = useState('admin');
    const [errorMessage, setErrorMessage] = useState('')



    async function InvitePressed() {        
        await Invite(value, type, company, userInfo, setErrorMessage, dbURL, setValue, setRefreshUID)
    }

    function RemoveInvitePressed(data: any) {        
        RemoveInvite(data, company, dbURL, setRefreshUID)    
    }


    return (
        <div className='relative'>
            <div className='flex flex-row'>
                <div className='w-4/5 pr-[10px]'>
                    <Input name='email' frameType='text' type='email' inputValue={ value } placeholder='Enter email' onChange={ (e: any) => HandleEmailInviteChange(e, setValue, setErrorMessage) }/>
                </div>
    
                <div className='w-1/5 h-full'>
                    <Input name={ type } frameType='dropDown' inputValue={ type } options={ ['admin', 'member', 'driver'] } onChange={ (e: any) => ChangeInviteType(e, setType) }/>
                </div>
            </div>

            <Paragraph size='xs' className='text-slate-500 text-left py-2'>
                { type === 'admin' ? 'Admins - have access to account and billing settings + Dispatch & Driver functions' : type === 'member' ? 'Members - have access to Dispatch & Driver functions only' : 'Drivers - Access to driver functions only'  }
            </Paragraph> 
            <Button variant='custom' style={{ display: value ? 'block' : 'none', color: (validator.isEmail(value)) ? 'white' : 'black', backgroundColor: (validator.isEmail(value)) ? '#26C797' : 'lightGray' }} onClick={ () => InvitePressed() } className={cn('w-full', 'className')} disabled={ (validator.isEmail(value)) ? false : true }>
                Send Invite
            </Button>
            <Paragraph size='xs' className='text-red-700 text-left py-2'>
                { errorMessage }
            </Paragraph> 
    
            <div className='py-[14px]'>
                {
                    company && company.allActiveRoles.map((member: any) => (
                        <div key={ member.userUID ? member.userUID : member.email } className='flex flex-row py-3'>
                            <div className='w-[30px] h-30px border border-slate-500 rounded-full flex items-center justify-center relative'>
                                <Image src="/images/Profile.svg" alt="profile icon" width={25} height={25}/>
                            </div>
        
                            <div>
                                <Paragraph size='xs' className='E8SjM'>
                                    { member['status'] && member['status'] === 'pending' ? member.email : CapitalizeFirstLetterOfEachWord(member['userName'] ? member['userName'] : member.userName) }
                                </Paragraph> 
                                <Paragraph size='xs' className='Mbief' style={{ marginLeft: '16px', marginTop: '0px', position: 'absolute' }}>
                                    { member['email'] && '(' + member.email + ')'}
                                </Paragraph> 
                            </div>
                                
                            <div style={{ marginLeft: 'auto', display: 'flex' }}>
                                <Paragraph size='xs' style={{ margin: '0px', marginTop: '6px' }}>
                                    { member['status'] ? '(' + member['status'] + ')' : '' }
                                </Paragraph> 
                                <Paragraph size='xs' style={{ margin: '0px', marginTop: '6px', paddingLeft: '10px', width: '50px' }}>
                                    { CapitalizeFirstLetterOfEachWord(member.role) }
                                </Paragraph> 
                            </div>
                            <div className='pl-4'>
                                <Button variant='custom' className={cn('h-fit w-fit p-2 hover:bg-slate-300', 'className')} onClick={ () => RemoveInvitePressed(member) }>
                                    <Image src="/images/close.png" alt="close icon" width={12} height={12}/>
                                </Button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


export default Invite_Container;