import * as React from 'react';
import Map from '@/components/ui/map/Map';



interface nameProps {
    companyInfo: any
    mapSettings: any
    selectedTrip: any
    isShowingDropOffLocation: any
    trips2: any
    drivers: any
}

const MapContainer: React.FC<nameProps> = ({ companyInfo, mapSettings, selectedTrip, isShowingDropOffLocation, trips2, drivers }) => {

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

  const center = selectedTrip ? GetAdressCoordinates(isShowingDropOffLocation ? 'dropoff' : 'pickup', selectedTrip).coordinates : GetMapInitCoordinates(trips2[0], mapSettings)

  return (
      <div className="absolute inset-0">
        <Map key={ center.lng } boardUID={ companyInfo.id } drivers={ drivers } height='100%' mapSettings={ mapSettings } initialViewState={{ lng: center.lng, lat: center.lat, zoom: mapSettings.zoom }} selectedTrip={ selectedTrip } trips={ trips2 } isShowingDropOffLocation={ isShowingDropOffLocation }/>
      </div>
  )
};


export default MapContainer;
