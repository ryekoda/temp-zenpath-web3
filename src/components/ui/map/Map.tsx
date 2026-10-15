"use client"

import { FC, useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocations } from '@/hooks/useLocations';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN as string;

import { InitMap, GenerateLocations, GenerateMatchedLocations, GenerateMarkers, GenerateRoute, GenerateDriverCurrentLocationMarker, FilterActiveDrivers } from './Map_A';



interface Props {
    boardUID: string,
    drivers: any[],
    height?: any
    mapSettings?: any
    initialViewState?: any
    selectedTrip?: any
    trips?: any
    isShowingDropOffLocation?: any
}

const MapView: FC<Props> = ({ boardUID, drivers, height, mapSettings, initialViewState, selectedTrip, trips, isShowingDropOffLocation }) => {
    const { dbURL } = useAuth()
    const map = useRef<mapboxgl.Map>();
    const mapContainer = useRef<any>(null);
    const [refreshUID, setRefreshUID] = useState()
    const [activeDrivers, setActiveDrivers]: any[] = useState([])
    const driverLocations: any = useLocations(activeDrivers.map((a: any) => a.userUID).filter((item: any) => item), boardUID, refreshUID)
    const [lng, setLng] = useState(initialViewState.lng);
    const [lat, setLat] = useState(initialViewState.lat);
    const [zoom, setZoom] = useState(initialViewState.zoom);

        
    useEffect(() => {
        InitMap(mapboxgl, map, mapContainer, lng, lat, zoom, setLng, setLat, setZoom)

        const locations = GenerateLocations(selectedTrip, trips, isShowingDropOffLocation, mapSettings)
        GenerateMarkers(locations, selectedTrip, mapboxgl, map) 

        // Route
        const matchedLocations = GenerateMatchedLocations(locations, trips)
        matchedLocations.map((matchedLocation: any, i: number) => {  
            GenerateRoute(mapboxgl, map.current, matchedLocation.start, matchedLocation.end, i)
        })                 
    }, []);

    useEffect(() => {
        if (driverLocations && driverLocations.length > 0) {
            GenerateDriverCurrentLocationMarker(driverLocations[0], activeDrivers, mapboxgl, map)
        }
    }, [ JSON.stringify(driverLocations) ]);  

    useEffect(() => {
        (async () => {  
            const aDrivers = await FilterActiveDrivers(boardUID, drivers, dbURL)
            setActiveDrivers(aDrivers)          
        })();  
    }, [])

    // Mapbox only watches the window; keep the canvas sized when the side menus open or close.
    useEffect(() => {
        if (!mapContainer.current) return
        const observer = new ResizeObserver(() => map.current?.resize())
        observer.observe(mapContainer.current)
        return () => observer.disconnect()
    }, [])


    return (
        <div ref={ mapContainer } className="map-container" style={{ height: height, width: '100%', zIndex: 0 }} />
    )
};


export default MapView;
