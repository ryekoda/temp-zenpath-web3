"use client"
import React, { FC, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import List from '@/components/list/List';
import SortListData from '@/lib/tables/sortRows';
import TripCell from './TripCell';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/app/[id]/_components/WorkspaceStates';
import { HeaderTitles } from '@/lib/tables/columns';
import { GetActivityInfo } from '../_utils/Actions';



interface Props {
  companyUID: any
  company: any
  companySettings: any
  trips: any
  loadMoreData: any
  reloadData: any
  popperTrigger: any
  popperTriggers: any
  selectedData: any
  setSelectedData: any
  selectedItem: any
  sortDirection: any
  setSortDirection: any
  sortSectionUID: any
  setSortSectionUID: any
  handleModalOpen: any
  clients: any
  drivers: any
  activity: any
  handleToolTipOpen?: any
  dbURL: string
}

const ScheduleContainer: FC<Props> = ({ companyUID, company, companySettings, trips, loadMoreData, reloadData, popperTrigger, popperTriggers, selectedData, setSelectedData, selectedItem, sortDirection, setSortDirection, sortSectionUID, setSortSectionUID, handleModalOpen, clients, drivers, activity, handleToolTipOpen, dbURL }) => {
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);
  const [itemSpecs, setItemSpecs] = useState([])

  function cellPressed(item: any, index: number, sectionIndex: number, isUsingModal: boolean) {
    if (isUsingModal) {
      handleModalOpen('edit', item)
    }
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        icon={ <CalendarDays aria-hidden="true" strokeWidth={1.75}/> }
        title='No trips scheduled'
        description='Plan ahead by adding the rides for this day, or pick another date.'
        action={
          <Button variant='primary' onClick={ () => handleModalOpen('create') } className='h-10 gap-2 px-4 font-semibold'>
            <Plus aria-hidden="true" className='h-4 w-4' strokeWidth={2.5}/>
            New trip
          </Button>
        }/>
    )
  }

  return (
    // List pads itself 50px per side; [&>div]:!px-8 lines the table up with the header above it.
    <div className='h-full overflow-auto pt-4 [&>div]:!px-8'>
      <List name='trips' data={ trips } loadMoreData={ loadMoreData } companyInfo={ company } companySettings={ companySettings } showHeaders={ true } reloadData={ reloadData } popperTrigger={ popperTrigger } popperTriggers={ popperTriggers } isToolTipOpen={ isToolTipOpen } setIsToolTipOpen={ setIsToolTipOpen } selectedData={ selectedData } setSelectedData={ setSelectedData } selectedItem={ selectedItem } sortDirection2={ sortDirection } setSortDirection2={ setSortDirection } sortSectionUID2={ sortSectionUID } setSortSectionUID2={ setSortSectionUID } boardUID={ companyUID } itemSpecs={ itemSpecs } setItemSpecs={ setItemSpecs } handleToolTipOpen={ handleToolTipOpen } dbURL={ dbURL }>
        {
          SortListData(trips, sortSectionUID, sortDirection).map((item: any, i: any) => (
            <TripCell key={ item.id } index={ i } name='trips' item={ item } allTrips={ trips } allClients={ clients } allEmployees={ drivers } showHeaders={ true } headerTitles={ HeaderTitles(companySettings, true) } onPress={ cellPressed } allUsers={ clients } itemSpecs={ itemSpecs } activityData={ GetActivityInfo(activity, item.id) }/>
          ))
        }
      </List>
    </div>
  )
};


export default ScheduleContainer;
