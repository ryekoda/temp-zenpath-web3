"use client"
import React from 'react';
import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';
import Paragraph from '@/components/ui/Paragraph';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/Utils';
import { CapitalizeFirstLetter, CapitalizeFirstLetterOfEachWord } from '@/lib/GlobalFunctions';



export const InnerToolTipContainer = ( props ) => {
    const { name, data, currentUser, company, checkboxes, setCheckboxes, profiles, onPress } = props


    function GetSortedProfiles(sortedProfiles) {
        sortedProfiles.sort(function(a, b) {
            var textA = a && a['fName'] ? a.fName.toUpperCase() : '';
            var textB = b && b['fName'] ? b.fName.toUpperCase() : '';
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
      
        return sortedProfiles
    }

    function HandleCheckboxChange(event, value) {
        const target = event.target
        var allItems = []
      
        checkboxes.map(function (checkbox) {
          const headerUID = checkbox.uid
          const headerTitle = checkbox.title
          const headerIsHidden = checkbox.isHidden
          var newBox = null
      
          if (headerUID === value) {
            newBox = { uid: headerUID, title: headerTitle, isHidden: !headerIsHidden }
            onPress('visibleHeaders', newBox)
          } else {
            newBox = { uid: headerUID, title: headerTitle, isHidden: headerIsHidden }
          }
      
          allItems.push(newBox)
        });
      
        setCheckboxes(allItems)
    };

    
    return (
        <div>
            {
                (name === 'boardSettings') ?
                    <div>
                        {
                            company && company.admins.includes(currentUser.id) &&
                            <div>
                                <div className='mt-2'>
                                    <Button variant='ghost' onClick={ () => onPress('billing') } className={cn('w-fit', 'className', 'w-[180px] flex justify-start')}>
                                        <Image src="/images/Invoice.svg" alt="invoice icon" width={16} height={16}/>
                                        <Paragraph size='sm' style={{ marginLeft: '10px', marginTop: '8px' }}>
                                            Billing & Plans
                                        </Paragraph>
                                    </Button>
                                </div>
                                <div className='mt-2'>
                                    <Button variant='ghost' onClick={ () => onPress('deleteBoard') } className={cn('w-fit', 'className', 'w-[180px] flex justify-start')}>
                                        <Image src="/images/Trash.svg" alt="trash icon" width={16} height={16}/>
                                        <Paragraph size='sm' style={{ marginLeft: '10px', marginTop: '8px' }}>
                                            Delete Board
                                        </Paragraph>
                                    </Button>
                                </div>
                            </div>
                        }
                    </div>
                : (name === 'filterProfiles') ?
                    <div className='px-3'>
                        <Paragraph size='sm' style={{ textAlign: 'left', fontWeight: 'bold', paddingBottom: '4px' }}>
                            Employees
                        </Paragraph>

                        {
                            GetSortedProfiles(profiles).map(item => (
                                <div key={ item.id } className='mt-2'>
                                    <Button variant='ghost' onClick={ () => onPress('filterProfiles', item.id) } className={cn('w-fit', 'className', 'w-[180px] flex justify-start')}>
                                        <Image src="/images/user.png" alt="user icon" width={16} height={16}/>
                                        <Paragraph size='sm' style={{ marginLeft: '10px', marginTop: '8px' }}>
                                            { CapitalizeFirstLetter(item.fName) } { CapitalizeFirstLetter(item.lName) }
                                        </Paragraph>
                                    </Button>
                                </div>
                            ))
                        }
                    </div>
                : (name === 'visibleHeaders') ?
                    <div className='px-3'>
                        <Paragraph size='sm' style={{ textAlign: 'left', fontWeight: 'bold', paddingBottom: '4px' }}>
                            Hide Columns
                        </Paragraph>

                        {
                            checkboxes.map(item => (
                                <div key={ item['uid'] ? item.uid : item.title } className='flex flex-row'>
                                    <Paragraph size='sm' style={{ width: '85%', marginTop: '8px', textAlign: 'left' }}>
                                        { item.title }
                                    </Paragraph>
                                    <div style={{ width: '15%' }}>
                                        <Checkbox name={ item.title } checked={ !item.isHidden } onChange={ (e) => HandleCheckboxChange(e, item['uid'] ? item.uid : item.title) } color="default" sx={{ color: '#717FF6', '&.Mui-checked': { color: '#717FF6' } }} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                : (name === 'form-autocomplete') ?
                    <div style={{ width: '480px' }} className='Tf5Xm'>
                        {
                            (data && data.length > 0) &&
                                <>
                                    {
                                        data.map((item, i) => (
                                            <div className='zM8QF' key={ i } style={{ width: '480px', height: '50px' }}>
                                                <div key={ i } className='vYmQZ' style={{ width: '480px' }} onClick={ () => onPress('form-autocomplete', item.id) }>
                                                <p className='JQPy7'>{ CapitalizeFirstLetterOfEachWord(item.fName + ' ' + item.lName) }</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
                        }
                    </div>
                : (name === 'listHeaderOptions') ?
                    <div>
                        <Button variant='destructive' onClick={ () => onPress('listHeader-delete', data) } className={cn('className', 'w-[180px] text-black hover:bg-slate-200')}>
                            Delete
                        </Button>
                    </div>
                : (name === 'addListColumn') ?
                    <div>
                        <Paragraph size='sm' className='font-medium pb-2'>
                            Essentials
                        </Paragraph>
                        <Button variant='outline' onClick={ () => onPress('listHeader-add', 'text') } className={cn('className', 'w-[180px] text-black hover:bg-slate-200')}>
                            Text
                        </Button>
                    </div>
                : (name === 'billingOptions') ?
                    <div style={{ width: '200px' }}>
                        <button className='WGi5g' onClick={ () => onPress('manageSeats') }>{ 'Manage seats' }</button>
                        {
                            (!company.subscription.cancel_at_period_end) &&
                                <button className='WGi5g' onClick={ () => onPress('deleteSubscription') }>{ 'Cancel subscription' }</button>
                        }
                    </div>
                :
                    <></>
                }
        </div>
    )
}