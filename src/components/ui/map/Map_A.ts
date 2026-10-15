import { GetActivity } from '@/helpers/database/Activity';
import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';


// Mapbox paint and marker options need plain color strings, so these mirror the design tokens
// (--color-brand-600, --color-brand-700, --color-ink-900) from globals.css.
const BRAND_600 = '#0FA978'
const BRAND_700 = '#087F5B'



export function InitMap(mapboxgl: any, map: any, mapContainer: any, lng: any, lat: any, zoom: any, setLng: any, setLat: any, setZoom: any) {
  if (map.current) return;
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    accessToken: process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [lng, lat],
    zoom: zoom,
  });

  // Zoom controls
  map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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


// Pickup pins for the day's trips (or the one selected trip), in brand green.
export async function GenerateMarkers(locations: any[], selectedTrip: any, mapboxgl: any, map: any) {
  if (!map.current) return

  const pins = selectedTrip ? locations.slice(0, 1) : locations
  pins.forEach((location: any) =>
    new mapboxgl.Marker({ color: BRAND_600 }).setLngLat([location.lng, location.lat]).addTo(map.current)
  );
}


// Round badge with the driver's initials, used as their live-location marker.
function CreateDriverMarkerElement(userUID: string, driverData: any) {
  const element = document.createElement('div');
  element.id = userUID;
  element.className = 'zenpath-driver-marker';
  element.textContent = driverData ? `${(driverData.fName || '').charAt(0)}${(driverData.lName || '').charAt(0)}`.toUpperCase() : '';
  element.setAttribute('aria-label', DriverName(driverData));
  return element
}

function DriverName(driverData: any) {
  return driverData ? CapitalizeFirstLetterOfEachWord(`${driverData.fName || ''} ${driverData.lName || ''}`.trim()) : 'Driver'
}

// Popup content built as DOM (not an HTML string) so names can't inject markup.
function CreateDriverPopup(mapboxgl: any, driverData: any) {
  const content = document.createElement('div');
  const title = document.createElement('p');
  title.className = 'zenpath-popup-title';
  title.textContent = DriverName(driverData);
  const subtitle = document.createElement('p');
  subtitle.className = 'zenpath-popup-subtitle';
  subtitle.textContent = 'On shift · live location';
  content.append(title, subtitle);

  return new mapboxgl.Popup({ offset: 24, closeButton: false }).setDOMContent(content)
}


export async function GenerateDriverCurrentLocationMarker(location: any, activeDrivers: any[], mapboxgl: any, map: any) {
  const userUID = location.userUID
  const driverData = activeDrivers.find((driver) => driver.userUID === userUID);
  
  const coordinates = location.coordinates
  let annotation = document.getElementById(userUID);

  if (annotation) {
    const marker = new mapboxgl.Marker(annotation)
    marker.setPopup(CreateDriverPopup(mapboxgl, driverData))
    marker.setLngLat([coordinates.lng, coordinates.lat])
  } else {
    annotation = CreateDriverMarkerElement(userUID, driverData)
    const marker = new mapboxgl.Marker(annotation)
    marker.setPopup(CreateDriverPopup(mapboxgl, driverData))
    marker.setLngLat([coordinates.lng, coordinates.lat]).addTo(map.current!);
  }
}


// Driving route between a client's two trip legs, drawn as a green line with a white edge.
export async function GenerateRoute(mapboxgl: any, map: any, start: any, end: any, index: number) {
  const query = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson&access_token=${mapboxgl.accessToken}`, { method: 'GET' });
  const json = await query.json().catch(() => null);
  const route = json?.routes?.[0]?.geometry?.coordinates;
  if (!route) return

  const id = `route${index}`
  const geojson = { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: route } };

  const draw = () => {
    if (map.getSource(id)) {
      map.getSource(id).setData(geojson);
      return
    }

    map.addSource(id, { type: 'geojson', data: geojson });
    map.addLayer({ id: `${id}-edge`, type: 'line', source: id, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#FFFFFF', 'line-width': 8, 'line-opacity': 0.9 } });
    map.addLayer({ id, type: 'line', source: id, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': BRAND_700, 'line-width': 4.5, 'line-opacity': 0.9 } });
  }

  // Layers can only be added once the map style has loaded
  if (map.isStyleLoaded()) draw()
  else map.once('load', draw)
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