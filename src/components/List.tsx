import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/Button';
import LargeHeading from '@/components/ui/LargeHeading';
import Paragraph from '@/components/ui/Paragraph';
import ListHeader from '@/components/ListHeader';
import ListItem from '@/components/ListItem';
import SortListData from '@/lib/ListSort.js';
import { cn, IsLoadMoreAvailable, HeaderTitles, SubscriptionStatus } from '@/lib/Utils';

import { CalculateSectionWidth } from '@/components/old/ListHeader_A.js';
import { ItemPressed, openPopover } from '@/components/old/List_A.js';



interface Props {
  children: any 
  name: any
  data: any
  loadMoreData: any
  companyInfo: any
  companySettings: any
  allUsers?: any
  allClients?: any
  allEmployees?: any
  onTap?: any
  editButtonPressed?: any
  showHeaders?: any
  reloadData?: any
  popperTrigger?: any
  popperTriggers?: any
  isToolTipOpen?: any
  setIsToolTipOpen?: any
  selectedData?: any
  setSelectedData?: any
  selectedItem?: any
  sortDirection2?: any
  setSortDirection2?: any
  sortSectionUID2?: any
  setSortSectionUID2?: any
  allDrivers?: any
  boardUID?: any
  itemSpecs?: any
  setItemSpecs?: any
  showModal?: any
  handleToolTipOpen: any
  dbURL: string
  handleModalOpen?: any
}

const List: React.FC<Props> = ({ children, name, data, loadMoreData, companyInfo, companySettings, allUsers, allClients, allEmployees, onTap, editButtonPressed, showHeaders, reloadData, popperTrigger, popperTriggers, isToolTipOpen, setIsToolTipOpen, selectedData, setSelectedData, selectedItem, sortDirection2, setSortDirection2, sortSectionUID2, setSortSectionUID2, allDrivers, boardUID, itemSpecs, setItemSpecs, showModal, handleToolTipOpen, dbURL, handleModalOpen }) => {
  const [sortDirection, setSortDirection] = useState(name === 'history' ? 'down' : 'default')
  const [sortSectionUID, setSortSectionUID] = useState(name === 'history' ? '16538' : '')
  const filteredTitles = ( titles: any ) => { return titles }
  const [currentActiveControlItem, setCurrentActiveControlItem] = useState('')
  const [totalWidth, setTotalWidth] = useState(0)



  useEffect(() => {
    let listWidth = 0

    for (let i = 0; i < filteredTitles(HeaderTitles(companySettings, true)).length; i++) {
      const headerTitle = filteredTitles(HeaderTitles(companySettings, true))[i]
      let width = itemSpecs && itemSpecs.length > 0 ? itemSpecs[i].width : parseFloat(CalculateSectionWidth(headerTitle.uid))
      listWidth = listWidth + width
    }

    setTotalWidth(listWidth)
  }, [ JSON.stringify(data), JSON.stringify(companySettings) ])


  function itemPressed(index: any, selectedData: any) { 
    ItemPressed('name', index, popperTrigger, popperTriggers, selectedData, setSelectedData, isToolTipOpen, setIsToolTipOpen) 
  }
  


  return (
    <div className='mt-0' style={{ padding:  name !== 'activity' ? '0px 50px 0px 50px' : '0px', width: name !== 'reports' && name !== 'activity' ? totalWidth + 'px' : '100%' }}>
      <DndProvider backend={ HTML5Backend }>

        {
          (data.length > 0) ?
            <>
              {
                showHeaders &&
                  <div className='w-full flex flex-row sticky z-[1]'>

                    {
                        filteredTitles(HeaderTitles(companySettings, true)).map((headerTitle: any, index: any) => (
                          <ListHeader key={ headerTitle.uid } uid={ headerTitle.uid } title={ headerTitle.title } i={ index } index={ headerTitle.indexPosition ? headerTitle.indexPosition : null } isHidden={ headerTitle.isHidden } companySettings={ companySettings } sortDirection={ sortDirection2 ? sortDirection2 : sortDirection } setSortDirection={ setSortDirection2 ? setSortDirection2 : setSortDirection } sortSectionUID={ sortSectionUID2 ? sortSectionUID2 : sortSectionUID } setSortSectionUID={ setSortSectionUID2 ? setSortSectionUID2 : setSortSectionUID } width={ CalculateSectionWidth(headerTitle.uid) } itemSpecs={ itemSpecs } setItemSpecs={ setItemSpecs } isDisabled={ false } handleToolTipOpen={ handleToolTipOpen } dbURL={ dbURL } reloadData={ reloadData }/>
                        ))
                    }

                    <div className='w-[100px] absolute' style={{ marginLeft: totalWidth + 'px', display: name !== 'reports' ? 'block' : 'none' }}>
                      <Button variant='ghost' onClick={ (e) => handleToolTipOpen('addListColumn', e) } className={cn('w-fit', 'className')}>
                        <Image src="/images/plus_200.png" width={14} height={14} alt="plus icon"/>
                      </Button>
                    </div>
                  </div>
              }

              <div className='w-full pb-80 block relative'>
                {
                  (companyInfo && companyInfo.id !== 'Mf21IpttifgYXMDz2Sbp') &&
                    <>
                      {
                        (!SubscriptionStatus(companyInfo, 'standard').isFeatureAvailable) &&
                          <div className='w-full h-full z-10 absolute' style={{ display: name === 'reports' ? 'block' : 'none' }}>
                            <div className='h-[150px] bg-gradient-to-t from-slate-500'></div>
                            <div className='h-full bg-white'>
                                <Paragraph className='font-bold pt-8 ml-auto mr-auto'>
                                  Need more trips in report history?
                                </Paragraph>
                                <div className='flex justify-center mt-4'>
                                  <Button onClick={ () => handleModalOpen('pricing') } className={cn('w-fit', 'className')}>
                                    Unlock feature
                                  </Button>
                                </div>
                            </div>
                          </div>
                      }
                    </>
                }

                {
                  children ?
                    <>
                      { children }
                    </>
                  :
                    <>
                      {
                        SortListData(data, sortSectionUID, sortDirection).map((item: any, i: any) => (
                          <ListItem key={ item.id } index={ i } name={ name } item={ item } allUsers={ allUsers } allClients={ allClients } allEmployees={ allEmployees } showHeaders={ showHeaders } headerTitles={ HeaderTitles(companySettings, true) } companyInfo={ companyInfo } onTap={ onTap } editButtonPressed={ editButtonPressed } openPopover={ openPopover } extraData={ data } currentActiveControlItem={ currentActiveControlItem } setCurrentActiveControlItem={ setCurrentActiveControlItem } onPress={ itemPressed } innerRefs={ popperTriggers } />
                        ))
                    }
                  </>
                }

                {
                  (name !== 'trips') &&
                    <div className='flex justify-center py-4'>
                      <Button variant='custom' onClick={ loadMoreData } className={cn('w-fit', 'className')} style={{ display: IsLoadMoreAvailable(data.length) ? 'block' : 'none' }} >
                        Load more
                      </Button>
                    </div>
                }
          
              </div>
            </>
          :
            <>
              {
                name === 'trips' ?
                  <>
                    <div className='flex items-center justify-center mt-32'>
                      <Image src="/images/Calendar2.png" width={76} height={76} alt="calendar icon"/>
                    </div>
                    {/* <LargeHeading size='sm' className='three-d pb-2 pt-4 text-slate-300'>
                      Schedule a trip
                    </LargeHeading> */}
                    <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: '500', color: 'gray', margin: '0px', marginTop: '14px' }}>{ 'Schedule a trip' }</h3>
                    <h4 style={{ textAlign: 'center', fontSize: '14px', fontWeight: '400', color: 'gray', margin: '0px', marginTop: '0px', paddingBottom: '50px' }}>Save time by scheduling ahead.</h4>
                  </>
                :
                  <Paragraph className='font-bold pt-8 ml-auto mr-auto text-slate-400'>
                    { name === 'reports' ? 'Empty Reports' : '' }...
                  </Paragraph>
              }
            </>
        }

      </DndProvider>
    </div>
  )
}


export default List
