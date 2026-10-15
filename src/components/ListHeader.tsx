"use client"
import React, { FC, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { UpdateTableSettings } from '@/helpers/database/CompanySettings';
import { Button } from '@/components/ui/Button';
import useDrag from '@/hooks/useDrag';
import { cn, CapitalizeFirstLetterOfEachWord } from '@/lib/Utils';

import { CalculateSectionWidth, IsSectionSortable } from '@/components/old/ListHeader_A.js';
import '@/components/old/ListHeader.css';



interface Props {
  uid: any
  title: any
  i: any
  index: any
  isHidden: any
  companySettings: any
  sortDirection: any
  setSortDirection: any
  sortSectionUID: any
  setSortSectionUID: any
  width: any
  itemSpecs: any
  setItemSpecs: any
  isDisabled: any
  handleToolTipOpen: any
  dbURL: string
  reloadData: any
}

const ListHeader: React.FC<Props> = ({ uid, title, i, index, isHidden, companySettings, sortDirection, setSortDirection, sortSectionUID, setSortSectionUID, width, itemSpecs, setItemSpecs, isDisabled, handleToolTipOpen, dbURL, reloadData }) => {
  const [value, setValue] = useState(uid === '34057' || uid === '10990' || uid === '71130' ? CapitalizeFirstLetterOfEachWord(title) : title)
  const [timer, setTimer] = useState(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [lastDownX, setLastDownX] = useState(0)
  const [newWidth, setNewWidth] = useState<any>({})
  const [bindTrigger] = useDrag(isResizing, setIsResizing, setLastDownX, index, itemSpecs.length > 0 ? (itemSpecs[index ? index : 0] && itemSpecs[index ? index : 0]['width'] ? itemSpecs[index ? index : 0].width : '16') : null, itemSpecs, setItemSpecs, setNewWidth);
  const descRef = useRef<any>();
  // itemSpecs[index ? index : 0].width
  

  
  function handleKeyDown(event: any) {
    if (event.key === 'Enter') {
      descRef.current.blur();
    }
  }

  const sortColumnChanged = (headerUID: any, setSortSectionUID: any, sortDirection: any, setSortDirection: any, isDisabled: any) => {
    if (!isDisabled) {
      let newSortDirection;
  
      if (sortDirection === 'down') {
        newSortDirection = 'up'
      } else if (sortDirection === 'up') {
        newSortDirection = 'default'
      } else if (sortDirection === 'default') {
        newSortDirection = 'down';
      }
  
      setSortDirection(newSortDirection)
      setSortSectionUID(headerUID)
    }
  }

  function InputChanged(e: any, headerUID: any, headerIsHidden: any, companySettings: any, timer: any, setTimer: any) {
    e.stopPropagation();
  
    const target = e.target
    const headerTitle = target.value
    clearTimeout(timer)
  
    if (headerUID === '23800') {
      let isnum = /^\d+$/.test(target.value);
      if (isnum || target.value === "") { setValue(target.value) }
    } else {
      setValue(target.value)
    }
  
    const newTimer = setTimeout(() => {
  
      if (companySettings) {
        const tableSettingsUID = companySettings.id
        const headers = companySettings.headers

        for (let i = 0; i < headers.length; i++) {
          const header = headers[i]
      
          if (header.uid === headerUID) {
            header.title = headerTitle
            header.isHidden = headerIsHidden
          }
        }
        
        UpdateTableSettings(companySettings.id, dbURL, null, null, null, null, headers)
        reloadData()
      }
    }, 1000)
  
    setTimer(newTimer)
  }
  
  
  return (
    <div className='AFgih' style={{ width: Object.keys(newWidth).length > 0 ? newWidth.width + 'px' : (width.includes('%') ? CalculateSectionWidth(uid) : itemSpecs.length > 0 ? (itemSpecs[index ? index : 0] && itemSpecs[index ? index : 0]['width'] ? itemSpecs[index ? index : 0].width : '16') : width + 'px') }}>
      {
        (IsSectionSortable(uid)) &&
          <div className='hU4kO' style={{ display: (sortSectionUID === uid && sortDirection !== "default") ? 'block' : '' }} onClick={ () => sortColumnChanged(uid, setSortSectionUID, sortDirection, setSortDirection, isDisabled) }>
            <Image className='apple2' src={ sortSectionUID === uid ? sortDirection === "up" ? '/images/sort_up.png' : sortDirection === "down" ? '/images/sort_down.png' : '/images/sort_default.png' : '/images/sort_default.png' } alt="sort arrow icon" width={26} height={26}/>
          </div>
      }

        <div className='w-full overflow-hidden'>
          <div className='flex flex-row py-0 px-[6px]'>
            <input className={ uid === '34057' || uid === '10990' || uid === '71130' || uid === '55410' ? 'eM3Pg' : 'umyUh' } ref={ descRef } name={ title } type='text' value={ value } onChange={ (e) => InputChanged(e, uid, isHidden, companySettings, timer, setTimer) } disabled={ uid === '34057' || uid === '10990' || uid === '71130' || uid === '55410' ? true : false } onFocus={ () => setIsInputFocused(true) } onBlur={ () => setIsInputFocused(false) } onKeyDown={ handleKeyDown } />

            {
              (!isInputFocused && uid !== '34057' && uid !== '10990' && uid !== '71130' && uid !== '55410' && uid !== '72260' && uid !== '59737' && uid !== '95242' && uid !== '67300' && uid !== '97264' && uid !== '32168' && uid !== '16538' && uid !== '46783' && uid !== '61895' && uid !== '37498' && uid !== '70600' && uid !== '65474' && uid !== '14787' && uid !== '75606' && uid !== '38543' && uid !== '94583') &&
                <div className='GWOxc'>
                  <Button variant='custom' onClick={ (e) => handleToolTipOpen('listHeaderOptions', e, uid) } className={cn('w-[15px] h-[15px] p-0 hover:bg-slate-300', 'className')}>
                    <Image src="/images/More.svg" alt="more icon" width={15} height={15}/>
                  </Button>
                </div>
            }
          </div>
        </div>

        <div className='JwYBs' {...bindTrigger} style={{ opacity: isResizing ? '1.0' : '0.0' }}/>
    </div>
  )
}


export default ListHeader
