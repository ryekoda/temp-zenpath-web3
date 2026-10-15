import { GetActivity } from '@/helpers/database/Activity';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/Utils';



export function InitMap(mapboxgl: any, map: any, mapContainer: any, lng: any, lat: any, zoom: any, setLng: any, setLat: any, setZoom: any) {
  if (map.current) return;
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    accessToken: process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: zoom,
  });

  // Zoom controls
  var nav = new mapboxgl.NavigationControl();
  map.current.addControl(nav, 'bottom-left');
  map.current.addControl(new mapboxgl.NavigationControl());

  // Map Focus Position
  if (!map.current) return;
  map.current.on('move', () => {
    if (map.current) {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    }
  });

  map.current.addControl(
    new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
    })
  );
}


function GetCoordinatesFromTripData(trip: any, defaultLocation: any) {
  let coordinates = { lat: defaultLocation.lat, lng: defaultLocation.lng }

  if (trip && trip.data) {
      if (trip.data['67300']) {
          coordinates = { 
              lat: trip.data['67300'].latLng.lat,
              lng: trip.data['67300'].latLng.lng 
          }
      } else {
          coordinates = { 
              lat: trip.client['59737'].latLng.lat,
              lng: trip.client['59737'].latLng.lng
          }
      }
  } else if (trip && trip['32168']) {
      coordinates = {
          lat: trip['32168'].latLng.lat,
          lng: trip['32168'].latLng.lng
      }
  }

  return coordinates
}


function GetAdressCoordinates(tripType: any, selectedTrip: any) {
  let destination: any = { address: '', coordinates: { lat: '', lng: '' } }

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


export function GenerateLocations(selectedTrip: any, trips: any[], isShowingDropOffLocation?: boolean, mapSettings?: any) {
  let locations: any = []

  if (selectedTrip) {
    const location = {
      id: selectedTrip.id,
      lng: GetAdressCoordinates(isShowingDropOffLocation ? 'dropoff' : 'pickup', selectedTrip).coordinates.lng,
      lat: GetAdressCoordinates(isShowingDropOffLocation ? 'dropoff' : 'pickup', selectedTrip).coordinates.lat
    }

    locations.push(location)
  } else {
    trips.map((trip: any) => {      
      const location = {
        id: trip.id,
        lng: GetCoordinatesFromTripData(trip, mapSettings).lng,
        lat: GetCoordinatesFromTripData(trip, mapSettings).lat
      }

      locations.push(location)
    })
  }

  return locations
}


export function GenerateMatchedLocations(locations: any[], trips: any) {
  let matchedLocations: any[] = []

  const clients = trips.map((a: any) => a['71130']);
  const uniqueClients = clients.filter((item: any, index: number) => clients.indexOf(item) === index); 

  uniqueClients.map((uniqueClient: string) => {      
    const clientTrips = trips.filter((obj: any) => obj['71130'] === uniqueClient)
    const clientTripUIDs = clientTrips.map((a: any) => a.id); // order later

    if (clientTripUIDs.length >= 2) {
      const tripA = locations.find((element) => element.id === clientTripUIDs[0])
      const tripB = locations.find((element) => element.id === clientTripUIDs[1])

      const location = {
        start: [tripA.lng, tripA.lat],
        end: [tripB.lng, tripB.lat]
      }
      
      matchedLocations.push(location)
    }
  })

  return matchedLocations
}


export async function GenerateMarkers(locations: any[], selectedTrip: any, mapboxgl: any, map: any) {
  if (selectedTrip) {
    new mapboxgl.Marker().setLngLat([locations[0].lng, locations[0].lat]).addTo(map.current)
  } else {
    if (map.current) {
      locations.map((location: any) =>
        new mapboxgl.Marker().setLngLat([location.lng, location.lat]).addTo(map.current!)
      );
    }
  }
}


export async function GenerateDriverCurrentLocationMarker(location: any, activeDrivers: any[], mapboxgl: any, map: any) {
  const userUID = location.userUID
  const driverData = activeDrivers.find(({ userUID }) => userUID === userUID);
  
  const coordinates = location.coordinates
  let annotation = document.getElementById(userUID);

  if (annotation) {
    // console.log('HERE');
    const marker = new mapboxgl.Marker(annotation)
    marker.setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h3>${ driverData ? CapitalizeFirstLetterOfEachWord(driverData.fName + ' ' + driverData.lName) : 'Driver'}</h3>`
      )
    )
    marker.setLngLat([coordinates.lng, coordinates.lat])
  } else {
    // console.log('Not HERE');
    annotation = document.createElement('div');
    annotation.className = 'marker';
    annotation.id = userUID;
    annotation.style.backgroundImage = `url(https://cdn-icons-png.flaticon.com/512/11536/11536524.png)`;
    const width = 40
    const height = 40
    annotation.style.width = `${width}px`;
    annotation.style.height = `${height}px`;
    annotation.style.backgroundSize = '100%';
    const marker = new mapboxgl.Marker(annotation)
    marker.setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
      `<h3>${ driverData ? CapitalizeFirstLetterOfEachWord(driverData.fName + ' ' + driverData.lName) : 'Driver'}</h3>`
      )
    )
    marker.setLngLat([coordinates.lng, coordinates.lat]).addTo(map.current!);
  }
}


export async function GenerateRoute(mapboxgl: any, map: any, start: any, end: any, index: number) {
  const query = await fetch(`https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`, { method: 'GET' });

  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };

  if (map.getSource('route')) {
    map.getSource(`route${index}`).setData(geojson);
  } else {
    map.addLayer({
      id: `route${index}`,
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
}


export async function FilterActiveDrivers(companyUID: string, drivers: any[], dbURL: string) {
  var activeDrivers: any[] = await Promise.all(drivers.map(async (driver): Promise<any | undefined> => {
    if (driver && driver.userUID) {
      const userUID = driver.userUID
      const activityData = await GetActivity(null, null, userUID, companyUID, null, null, null, dbURL).catch((err) => console.log('activity error: ', err)); 
      const shiftsData = activityData.filter((a: any) => a.type === "changedShiftStatus")
      const shiftData = shiftsData ? shiftsData[shiftsData.length - 1] : null

      if (shiftData && shiftData['info'].value === 'started') { 
        return driver
      } else {
        return
      }  
    } else {
      return
    }
  }));
  
  return activeDrivers.filter(item => item)
}