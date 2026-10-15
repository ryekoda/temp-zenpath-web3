"use client"
import React, { FC, useState } from 'react';
import { setCookie } from 'cookies-next';
import PageHeader from '@/components/PageHeader';
import List from '@/components/List';
import SortListData from '@/lib/ListSort.js';
import Cell from './Cell';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/Utils';
import { HeaderTitles } from '@/lib/GlobalFunctions';
import { GetActivityInfo } from '../Actions';



interface Props {
  currentUser: any
  companyUID: any
  company: any
  companySettings: any
  trips: any
  loadMoreData: any
  reloadData: any
  popperTrigger: any
  popperTriggers: any
  popperHeaderTriggers: any
  selectedData: any
  setSelectedData: any
  selectedItem: any
  sortDirection: any
  setSortDirection: any
  sortSectionUID: any
  setSortSectionUID: any
  setIsShowingMap: any
  handleModalOpen: any
  clients: any
  drivers: any
  currentActiveControlItem: any
  setCurrentActiveControlItem: any
  activity: any
  filterDate: any
  dateDidChange: any
  handleToolTipOpen?: any
  selectedDriverUID?: any
  setSelectedDriverUID?: any
  dbURL: string
}

const ScheduleContainer: FC<Props> = ({ currentUser, companyUID, company, companySettings, trips, loadMoreData, reloadData, popperTrigger, popperTriggers, popperHeaderTriggers, selectedData, setSelectedData, selectedItem, sortDirection, setSortDirection, sortSectionUID, setSortSectionUID, setIsShowingMap, handleModalOpen, clients, drivers, currentActiveControlItem, setCurrentActiveControlItem, activity, filterDate, dateDidChange, handleToolTipOpen, selectedDriverUID, setSelectedDriverUID, dbURL }) => {
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState('');
  const [itemSpecs, setItemSpecs] = useState([])



  function cellPressed(item: any, index: number, sectionIndex: number, isUsingModal: boolean) {
    if (isUsingModal) {
      handleModalOpen('edit', item)
    } else {
      // open tooltip
    }
  }

  function updateDisplayView(isShowingMap: boolean) {
    setIsShowingMap(isShowingMap)
    setCookie('isShowingMapView', isShowingMap.toString())
  }

  
  return (
      <div className='bg-white h-full absolute w-full overflow-scroll'>
        <div style={{ width: '100%', left: '0', position: 'sticky', zIndex: '10' }}>
          <div style={{ width: '100%', margin: '0 auto', padding: '0px 50px 0px 50px', boxSizing: 'border-box' }}>
            <PageHeader title={ 'planner' } userInfo={ currentUser } companyInfo={ company } members={ company.allActiveRoles } companySettings={ companySettings }  setIsShowingMap={ setIsShowingMap } handleModalOpen={ handleModalOpen } filterDate={ filterDate } dateDidChange={ dateDidChange } handleToolTipOpen={ handleToolTipOpen } selectedDriverUID={ selectedDriverUID } setSelectedDriverUID={ setSelectedDriverUID } employees={ drivers } updateDisplayView={ updateDisplayView }/>
          </div>
        </div>
        
        <List name='trips' data={ trips } loadMoreData={ loadMoreData } companyInfo={ company } companySettings={ companySettings } showHeaders={ true } reloadData={ reloadData } popperTrigger={ popperTrigger } popperTriggers={ popperTriggers } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } selectedData={ selectedData } setSelectedData={ setSelectedData } selectedItem={ selectedItem } sortDirection2={ sortDirection } setSortDirection2={ setSortDirection } sortSectionUID2={ sortSectionUID } setSortSectionUID2={ setSortSectionUID } boardUID={ companyUID } itemSpecs={ itemSpecs } setItemSpecs={ setItemSpecs } handleToolTipOpen={ handleToolTipOpen } dbURL={ dbURL }>
          {
            SortListData(trips, sortSectionUID, sortDirection).map((item: any, i: any) => (
              <Cell key={ item.id } index={ i } name='trips' item={ item } allTrips={ trips } allClients={ clients } allEmployees={ drivers } showHeaders={ true } headerTitles={ HeaderTitles(companySettings, true) } onPress={ cellPressed } allUsers={ clients } itemSpecs={ itemSpecs } activityData={ GetActivityInfo(activity, item.id) }/>
            ))
          }
        </List>
         
        <div className='w-full bg-white flex flex-row sticky' style={{ width: '100%', left: '0', margin: '0 auto', padding: '20px 0px 20px 0px', bottom: '0' }}>
          <div className='w-full box-border' style={{ margin: '0 auto', padding: '0px 50px 0px 50px' }}>
            <Button variant='default' onClick={ () => handleModalOpen('create') } className={cn('w-fit', 'className')}>
              Add new trip
            </Button>
          </div>
        </div>
      </div>
  )
};


export default ScheduleContainer;
