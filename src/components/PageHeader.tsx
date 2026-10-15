import React, { useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import Checkbox from '@mui/material/Checkbox';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Input from '@/components/ui/input/Input';
// import closeIcon from '../../assets/images/close.png';
// import profile2Icon from '../../assets/images/Profile2.svg';
// import profile3Icon from '../../assets/images/Profile3Fill.svg';
// import userImage from '../../assets/user.png';
// import magnifyingGlassIcon from '../../assets/images/MagnifyingGlass.png';
// import userAddIcon from '../../assets/images/UserAdd2.png';
// import moreIcon from '../../assets/images/More.svg';
// import heartIcon from '../../assets/images/Heart.png';
// import invoiceIcon from '../../assets/images/Invoice.svg';
// import trashIcon from '../../assets/images/Trash.svg';
// import ArrowIcon from '../../assets/images/ArrowDown2.png';
import Paragraph from '@/components/ui/Paragraph';
import { Button } from '@/components/ui/Button';
import LargeHeading from '@/components/ui/LargeHeading';
// import SearchBar from '../../components/searchBar/SearchBar';
import { cn } from '@/lib/Utils';
import { CapitalizeFirstLetter, CapitalizeFirstLetterOfEachWord, FormatPhoneNumber, InputOptionsConvert, GetDriverNameFromUID } from '@/lib/GlobalFunctions';

import { SearchButtonPressed, NumberOfHiddenHeaders, PrintButtonPressed } from './old/PageHeader_A.js'
import './old/PageHeader.css';



interface Props {
  title?: string
  userInfo?: any
  companyInfo?: any
  members?: any
  companySettings?: any
  allData?: any
  filterDate?: any
  dateDidChange?: any
  driverDidChange?: any
  isShowingMap?: any
  setIsShowingMap?: any
  selectedDriverUID?: any
  setSelectedDriverUID?: any
  employees?: any
  handleModalOpen?: any
  handleToolTipOpen?: any
  updateDisplayView?: any
}

const PageHeader: React.FC<Props> = ({ title, userInfo, companyInfo, members, companySettings, allData, filterDate, dateDidChange, driverDidChange, isShowingMap, setIsShowingMap, selectedDriverUID, setSelectedDriverUID, employees, handleModalOpen, handleToolTipOpen, updateDisplayView }) => {

  // function inputChanged(type: any, name: any, e: any, setValue: any) { 
  //   // driverDidChange(type, name, e, setValue) 
  // }

  const handleChange = (event: any) => {
    setSelectedDriverUID(event.target.value)
  };

  return (
    <div>
      <div>
        <div className='flex flex-row print:hidden'>
          <div>
            <LargeHeading size='sm' className='three-d dark:text-slate pb-2 bg-white pt-4'>
                { title ? CapitalizeFirstLetterOfEachWord(title) : '' }
            </LargeHeading>
            <Paragraph className='font-semibold text-left'>
              { companyInfo ? CapitalizeFirstLetterOfEachWord(companyInfo.title) : '' }
            </Paragraph>
          </div>

          <div className='ml-auto mt-[30px]'>
            <div className='flex justify-center'>
              <Button variant='ghost' onClick={ () => handleModalOpen('feedback') } className={cn('w-fit', 'className')}>
                <Image src="/images/Heart.png" width={20} height={20} alt="more icon"/>
                <Paragraph size='sm' className='ml-[6px] mt-[6px]'>
                  Give feedback
                </Paragraph>
              </Button>

              <Button variant='ghost' onClick={ () => handleModalOpen('invite') } className={cn('w-fit', 'className', 'ml-[12px]')}>
                <Image src="/images/UserAdd2.png" width={20} height={20} alt="more icon"/>
                <Paragraph size='sm' className='ml-[6px] mt-[6px]'>
                  { 'Invite / ' + members.length }
                </Paragraph>
              </Button>
    
              <Button variant='ghost' onClick={ (e) => handleToolTipOpen('boardSettings', e) } className={cn('w-fit', 'className', 'ml-[12px]')}>
                <Image src="/images/More.svg" width={24} height={24} alt="more icon"/>
              </Button>
            </div>

            {
              (title && title.toLowerCase() === 'planner') &&
              <div className='h-[44px] flex flex-row mt-[10px] float-right'>
                <button className='Q5vuD' id={ isShowingMap ? 'PgpOf' : 'jYL6I' } onClick={ () => updateDisplayView(false) }>Schedule</button>
                <button className='Q5vuD' id={ isShowingMap ? 'TiY3y' : 'XMVgK' } onClick={ () => updateDisplayView(true) }>Map</button>
              </div>
            }
          </div>
        </div>

        <div className='flex flex-row w-full relative print:hidden' style={{ padding: '20px 0px 20px 0px', zIndex: '10' }}>
          <div style={{ width: '90%' }}>
            <ul style={{ listStyleType: 'none', padding: '0px', marginTop: '2px' }}>

              {
                title !== 'reports' &&
                  <li className='float-left pr-[20px]'>
                    <div className='flex flex-row'>
                      <Button variant='custom' onClick={ () => handleModalOpen('create') } className={cn('w-fit bg-[#26C797] hover:bg-[#41b794] text-white rounded-e-none', 'className')}>
                        New { title && title.toLowerCase() === 'planner' ? 'Trip' : 'Item' }
                      </Button>
                      {/* <div className="bxQRG">
                          <img src={ ArrowIcon } alt="arrowIcon" style={{ maxHeight: "100%" }} />
                        </div>
                      </button> */}
                    </div>
                  </li>
              }

              {
                title === 'planner' &&
                  <li style={{ float: 'left', paddingRight: '20px' }}>
                    {
                      selectedDriverUID ?
                        <div className='bW2WX' style={{ display: 'flex' }}>
                          <span className="MdtRC">{ 'Filter by person' }</span>
                          <Button variant='ghost' onClick={ (e) => handleToolTipOpen('filterProfiles', e) } className={cn('w-fit', 'className')} style={{ marginLeft: '12px' }}>
                            <Image src="/images/Profile3Fill.svg" width={24} height={24} alt="person icon"/>
                            <Paragraph size='sm' style={{ marginLeft: '6px', marginTop: '8px' }}>
                              { CapitalizeFirstLetterOfEachWord(GetDriverNameFromUID(selectedDriverUID, employees)) }
                            </Paragraph>
                          </Button>
                          <div className='IV5dT' onClick={ () => setSelectedDriverUID(null) }>
                            <Image src="/images/close.png" width={10} height={10} alt="close icon"/>
                          </div>
                        </div>
                      :
                        <div className='bW2WX'>
                          <span className="MdtRC">{ 'Filter by person' }</span>
                          <Button variant='ghost' onClick={ (e) => handleToolTipOpen('filterProfiles', e) } className={cn('w-fit', 'className')} style={{ marginLeft: '12px' }}>
                            <Image src="/images/Profile2.svg" width={24} height={24} alt="person2 icon"/>
                            <Paragraph size='sm' style={{ marginLeft: '6px', marginTop: '8px' }}>
                              Person
                            </Paragraph>
                          </Button>
                        </div>
                    }
                  </li>
              }

              {/*         
              <li style={{ float: 'left', paddingRight: '20px' }}>
                {
                  currentActiveControlItem === 'search' ?
                    <SearchBar placeholder={ 'Search' } />
                  :
                    <Button imageLeading={ magnifyingGlassIcon } title={ 'Search' } alignment={ 'left' } buttonWasPressed={ (e) => SearchButtonPressed(e, setCurrentActiveControlItem) } />
                }
              </li>
              */}

              <li className='float-left'>
                <div className='Dynib'>
                  <span className="wm2Bf">{ 'Hidden columns' }</span>
                  <Button variant='ghost' onClick={ (e) => handleToolTipOpen('visibleHeaders', e) } className={cn('w-fit', 'className')} style={{ marginLeft: '12px' }}>
                    <Image src="/images/hiddenEye.png" width={24} height={24} alt="person2 icon"/>
                    <Paragraph size='sm' style={{ marginLeft: '6px', marginTop: '6px' }}>
                      { NumberOfHiddenHeaders(companySettings) === 0 ? 'Hide' : 'Hide' + ' / ' + NumberOfHiddenHeaders(companySettings) }
                    </Paragraph>
                  </Button>
                </div>
              </li>
            </ul>


          </div>

          {
            (title === 'reports') &&
              <div className='flex flex-row pr-[24px] items-center'>
                {/* <p style={{ margin: '0px', marginTop: '12px', paddingRight: '12px' }}>Driver</p> */}
                <Paragraph size='sm' className='px-4 mt-2'>
                  Driver
                </Paragraph>
                <div className='w-[200px]'>
                  {
                    InputOptionsConvert(allData) &&
                      <Input name='driver' frameType='dropDown' inputValue={ selectedDriverUID } options={ InputOptionsConvert(allData) } onChange={ (e: any) => handleChange(e) }/>
                  }
                </div>
              </div>
          }


          {
            (title === 'planner' || title === 'reports') ?
              <div className='z-10'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={ dayjs(filterDate) } onChange={ (e: any) => dateDidChange(e.toDate()) }/>
                </LocalizationProvider>
              </div>
            :
            <></>
          }

          {
            (title && title.toLowerCase() === 'reports') &&
              <Button variant='outline' onClick={ PrintButtonPressed } className={cn('w-fit print:hidden', 'className', 'h-[54px] ml-6')}>
                Print
              </Button>
          }
        </div>
      </div>

      {
        (title === 'reports') &&
          <div className='hidden print:block'>
            <div className='flex flex-row justify-between'>
              <div className='flex items-center'>
                <div>
                  <LargeHeading className='text-bold text-left'>
                    { companyInfo ? CapitalizeFirstLetterOfEachWord(companyInfo.title) : '' }
                  </LargeHeading>
                  <Paragraph className='text-left'>
                    { CapitalizeFirstLetterOfEachWord(GetDriverNameFromUID(selectedDriverUID, allData)) }
                  </Paragraph>
                  {/* <h2 className="kv0Yy">{ date ? date.toLocaleDateString('en-US') : "" }</h2> */}
                </div>
              </div>

              <div className='print:w-[350px] mr-[30px] p-6 rounded-md' style={{ border: companyInfo.id === 'Mf21IpttifgYXMDz2Sbp' ? '1px dashed gray' : 'none' }}>
                
                {
                  (companyInfo.id === 'Mf21IpttifgYXMDz2Sbp') &&
                  <>
                    {/* <h4 style={{ margin: "0px" }}>Driver's Contact Info</h4> */}
                    {
                      [...allData].sort((a, b) => a.fName > b.fName ? 1 : -1).map(driverInfo => (
                        <div key={ driverInfo.id } className='flex flex-row mt-[2px] relative'>
                          <p style={{ margin: "0px" }}>{ CapitalizeFirstLetter(driverInfo.fName) } { CapitalizeFirstLetter(driverInfo.lName) }</p>
                          <p style={{ margin: "0px", position: "absolute", right: "0" }}>{ FormatPhoneNumber(driverInfo.phone) }</p>
                        </div>
                      ))
                    }
                  </>
                }
              </div>
            </div>
          </div>
      }
    </div>
  )
}


export default PageHeader
