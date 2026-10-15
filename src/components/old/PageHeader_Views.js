"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';
import { CapitalizeFirstLetter, HeaderTitles } from '@/lib/GlobalFunctions';



export const TooltipContainer = ( props ) => {
    const { name, company, userInfo, showModal, companySettings, onTap, employees, setIsToolTipOpen, onPress } = props
    const { admins } = company
    const [checkboxes, setCheckboxes] = useState([]);
  
  
  
    useEffect(() => {
      if (companySettings) {
        var items = []
  
        for (let i = 0; i < HeaderTitles(companySettings, false).length; i++) {
          const header = HeaderTitles(companySettings, false)[i]
  
          if (header.title !== 'name' && header.title !== 'client') {
            items.push(header)
          }
        }
  
        setCheckboxes(items)
      }
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
  
  
    const handleChange = (event, value) => { 
      HandleCheckboxChange(event, value, checkboxes, setCheckboxes, onTap)
    }
  
    function filterProfileTapped(name, id) {
      setIsToolTipOpen(false)
      onTap("trips_Table", id)
    }
  
    function itemPressed(name) {
      onPress(name, null)
    }
  
  
    return (
      <>
        {
          name === 'more' ?
            <div style={{ width: '220px' }}>
              {
                admins.includes(userInfo.id) &&
                  <>
                    <div className='ndXxB' onClick={ () => onPress('billing') }>
                      {/* <div className="puH6q"> */}
                        {/* <img src={ invoiceIcon } alt="invoiceIcon" style={{ maxWidth: "100%"}} /> */}
                      {/* </div> */}
                      <Image src="/images/Invoice.svg" alt="invoice icon" width={16} height={16}/>
                      <p style={{ margin: '0px', fontSize: '14px', padding: '4px 10px 4px 10px' }}>Billing & plans</p>
                    </div>
                    {/* <Divider width={ '100%' } height={ '1px' } color={ 'lightGray' } /> */}
                    <div className='ndXxB' onClick={ () => onPress('deleteBoard') }>
                      {/* <div className="puH6q"> */}
                      <Image src="/images/Trash.svg" alt="trash icon" width={16} height={16}/>
                        {/* <img src={ trashIcon } alt="trashIcon" style={{ maxWidth: "100%"}} /> */}
                      {/* </div> */}
                      <p style={{ margin: '0px', fontSize: '14px', padding: '4px 10px 4px 10px' }}>Delete Board</p>
                    </div>
                  </>
              }
            </div>
          : name === 'newItemMore' ?
              <div>
                <div className='ndXxB' onClick={ () => onPress('import') }>
                  {/* <div className="puH6q">
                    <img src={ invoiceIcon } alt="invoiceIcon" style={{ maxWidth: "100%"}} />
                  </div> */}
                         <Image src="/images/Invoice.svg" alt="invoice icon" width={16} height={16}/>
                  <p style={{ margin: '0px', fontSize: '14px', padding: '4px 10px 4px 10px' }}>Import Items</p>
                </div>
              </div>
          : name === 'filterProfiles' ?
            <div style={{ width: '250px' }}>
              {
                companySettings &&
                  <div>
                    <p style={{ width: '100%', fontWeight: 'bold' }}>{ 'Employees' }</p>
                    {
                      GetSortedDrivers(employees).map(item => (
                        <div className='CZkFK' key={ item.id } onClick={ () => filterProfileTapped("trips_Table", item.id) }>
                          <div style={{ width: '18%' }}>
                            <div className='aKhzs'>
                              <img src={ userImage } alt="user" style={{ maxHeight: "100%"}} />
                            </div>
                          </div>
                          <p style={{ width: '82%', margin: '0px', marginTop: '4px', fontSize: '15px' }}>{ CapitalizeFirstLetter(item.fName) } { CapitalizeFirstLetter(item.lName) }</p>
                        </div>
                      ))
                    }
                  </div>
              }
            </div>
          : name === 'visibleHeaders' ?
            <div style={{ width: '250px' }}>
              {
                companySettings &&
                  checkboxes.map(item => (
                    <div key={ item['uid'] ? item.uid : item.title } style={{ display: 'flex' }}>
                      <p style={{ width: '85%' }}>{ item.title }</p>
                      <div style={{ width: '15%' }}>
                        <Checkbox name={ item.title } checked={ !item.isHidden } onChange={ (e) => handleChange(e, item['uid'] ? item.uid : item.title) } color="default" sx={{ color: '#717FF6', '&.Mui-checked': { color: '#717FF6' } }} />
                      </div>
                    </div>
                  ))
              }
            </div>
          :
          <></>
        }
      </>
    )
  }