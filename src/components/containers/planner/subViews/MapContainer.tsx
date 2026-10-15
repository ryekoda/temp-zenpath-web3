import * as React from 'react';
import { setCookie } from 'cookies-next';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Image from 'next/image';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';

// import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Map from '@/components/ui/map/Map';
import { Button } from '@/components/ui/Button';
import LargeHeading from '@/components/ui/LargeHeading';
import { cn } from '@/lib/Utils';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/Utils';
import { MapFormInnerView } from './Views';



const drawerBleeding = 56;

interface nameProps {
    window?: any
    setIsShowing: any
    isWorkspaceNavOpen: any
    companyInfo: any
    mapSettings: any
    selectedTrip: any 
    isShowingDropOffLocation: any 
    trips2: any 
    setIsShowingMap: any
    modalName: any
    activityField: any
    fields: any
    selectedTripInfo: any
    modalOptions: any
    tripHistory: any
    drivers: any
    isToolTipOpen: any
    currentTooltip: any
    errorCode: any
    saveEntry: any
    deleteEntry: any
    filterDate: any
    dateDidChange: any
    handleModalOpen: any
    isShowingModal: boolean
    reloadData: any
}

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor:
      theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
  }));
  
  const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
  }));
  
  const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
  }));

const MapContainer: React.FC<nameProps> = ({ setIsShowing, window, isWorkspaceNavOpen, companyInfo, mapSettings, selectedTrip, isShowingDropOffLocation, trips2, setIsShowingMap, modalName, activityField, fields, selectedTripInfo, modalOptions, tripHistory, drivers, isToolTipOpen, currentTooltip, errorCode, saveEntry, deleteEntry, filterDate, dateDidChange, handleModalOpen, isShowingModal, reloadData }) => {
    const [open, setOpen] = React.useState(false);

  
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const closeDrawer = (newOpen: boolean) => () => {
      setOpen(false);
      reloadData()
  };

    function GetAdressCoordinates(tripType: any, selectedTrip: any) {
      let destination = { address: '', coordinates: { lat: '', lng: '' } }
  
      if (tripType === 'pickup') {
          if (selectedTrip.data['67300']) {
              destination = { address: selectedTrip.data['67300'].address, coordinates: { lat: selectedTrip.data['67300'].latLng.lat, lng: selectedTrip.data['67300'].latLng.lng } }
          } else {
              if (selectedTrip.client['59737']) {
                  destination = { address: selectedTrip.client['59737'].address, coordinates: { lat: selectedTrip.client['59737'].latLng.lat, lng: selectedTrip.client['59737'].latLng.lng } }
              } else {
                  destination['address'] = selectedTrip.client.address
              }
          }
      } else if (tripType === 'dropoff') {
          destination = { address: selectedTrip.data['32168'].address, coordinates: { lat: selectedTrip.data['32168'].latLng.lat, lng: selectedTrip.data['32168'].latLng.lng } }
      }
  
      return destination
  }
  
  
  function GetMapInitCoordinates(location: any, defaultLocation: any) {
      let coordinates = { lat: defaultLocation.lat, lng: defaultLocation.lng }
  
      if (location && location.data) {
  
          if (location.data['67300']) {
              coordinates = { 
                  lat: location.data['67300'].latLng.lat,
                  lng: location.data['67300'].latLng.lng 
              }
          } else {
              coordinates = { 
                  lat: location.client['59737'].latLng.lat,
                  lng: location.client['59737'].latLng.lng
              }
          }
      } else if (location && location['32168']) {
  
          coordinates = {
              lat: location['32168'].latLng.lat,
              lng: location['32168'].latLng.lng
          }
      }
  
      return coordinates
  }

  function updateDisplayView(isShowingMap: boolean) {
    setIsShowingMap(isShowingMap)
    setCookie('isShowingMapView', isShowingMap.toString())
  }
    
      // This is used only for the example
      const container = window !== undefined ? () => window().document.body : undefined;

  return (
      <div className="absolute w-full">
          <div className="absolute z-10 pt-2 flex w-full justify-between">
            <div className='pl-4'>
              <LargeHeading size='sm' className='three-d dark:text-slate pb-2 bg-white px-4 pt-4 rounded-md drop-shadow-lg'>
                {companyInfo && CapitalizeFirstLetterOfEachWord(companyInfo.title)}
              </LargeHeading>
            </div>

            <div className='flex flex-col'>
              <div className='rounded-l-md bg-white py-2 drop-shadow-lg' style={{ display: 'flex', float: 'right' }}>
                <button className='w-[100px] h-[44px] rounded-lg hover:font-bold' onClick={ () => updateDisplayView(false) }>Schedule</button>
                <button className='w-[100px] h-[44px] ml-4 mr-4 bg-[#26C797] text-white rounded-lg font-bold hover:drop-shadow-lg' onClick={ () => updateDisplayView(true) }>Map</button>
              </div>
              <div className='bg-white w-[175px] rounded-l-md ml-16 drop-shadow-lg'>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={ dayjs(filterDate) } onChange={ (e) => dateDidChange(e) }/>
                  </LocalizationProvider>
                </div>
              </div>
            </div>
          </div>

          {
            (!open && !isShowingModal) &&
              <>
                <div className='absolute mt-9 z-[1500] left-[650px] bottom-6'>
                <Button variant='custom' size='lg' onClick={ () => handleModalOpen('create') } className={cn('w-fit mt-[40px] text-white bg-black hover:bg-slate-500 drop-shadow-2xl shadow-2xl', 'className')}>
                  <Image src="/images/plus_200.png" width={14} height={14} alt="plus icon"/>
                  <div className='ml-2'>
                    Create new trip
                  </div>
                </Button>
                </div>
              {/* <div className={isWorkspaceNavOpen ? 'absolute bottom-3 w-full flex items-center z-[1500] pr-[330px] justify-center' : 'absolute bottom-2 w-full flex items-center z-[1500] pr-[106px] justify-center'}>
                <div className={ isWorkspaceNavOpen ? 'flex w-[70%] ml-[330px]' : 'flex w-[84%] ml-[106px]' }>
                  <div className='flex justify-between w-full'>
                    <div className='w-[120px]'></div>
                    <Button variant='default' size='lg' onClick={ () => handleModalOpen('create') } className={cn('w-fit', 'className')} style={{ marginTop: '40px' }}>
                      Create new trip
                    </Button>
                    <div className='w-[120px]'></div>
                  </div>
                </div>
              </div> */}
              </>
          }

          {/* <Root className="absolute z-10">
            <CssBaseline />
            <Global styles={{ '.MuiDrawer-root > .MuiPaper-root': { height: `calc(90% - ${drawerBleeding}px)`, overflow: 'visible', width: '70%', margin: '0 auto', left: isWorkspaceNavOpen ? '330px' : '106px' }, }}/>
            <SwipeableDrawer container={container} anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} swipeAreaWidth={drawerBleeding} disableSwipeToOpen={false} ModalProps={{ keepMounted: true, }}>
              <StyledBox sx={{ position: 'absolute', top: -drawerBleeding, borderTopLeftRadius: 8, borderTopRightRadius: 8, visibility: 'visible', right: 0, left: 0 }}>
                <Puller/>
                <div className='flex flex-row justify-between'>
                  <Typography sx={{ p: 2, color: 'text.secondary' }}>{ trips2.length + ' Trip(s) Scheduled Today' }</Typography>
                  {
                    (open) &&
                      <div className='p-2'>
                        <Button variant='ghost' onClick={ closeDrawer(false) } className={cn('w-fit', 'className')}>
                          <Image src="/images/close.png" alt="close icon" width={15} height={15}/>
                        </Button>
                      </div>
                  }
                </div>
              </StyledBox>
            <StyledBox sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto', }}>
              <MapFormInnerView modalName={ modalName } activityField={ activityField } fields={ fields } selectedTripInfo={ selectedTripInfo } modalOptions={ modalOptions } tripHistory={ tripHistory } drivers={ drivers } isToolTipOpen={ isToolTipOpen } currentTooltip={ currentTooltip } errorCode={ errorCode } saveEntry={ saveEntry } deleteEntry={ deleteEntry }/>
            </StyledBox>
          </SwipeableDrawer>
      </Root>   */}
      <Map key={ selectedTrip ? GetAdressCoordinates(isShowingDropOffLocation ? 'dropoff' : 'pickup', selectedTrip).coordinates.lng : GetMapInitCoordinates(trips2[0], mapSettings).lng } boardUID={ companyInfo.id } drivers={ drivers } height='100vh' mapSettings={ mapSettings } initialViewState={{ lng: selectedTrip ? GetAdressCoordinates(isShowingDropOffLocation ? 'dropoff' : 'pickup', selectedTrip).coordinates.lng : GetMapInitCoordinates(trips2[0], mapSettings).lng, lat: selectedTrip ? GetAdressCoordinates(isShowingDropOffLocation ? 'dropoff' : 'pickup', selectedTrip).coordinates.lat : GetMapInitCoordinates(trips2[0], mapSettings).lat, zoom: mapSettings.zoom }} selectedTrip={ selectedTrip } trips={ trips2 } isShowingDropOffLocation={ isShowingDropOffLocation }/>
    </div>
  )
};


export default MapContainer;
