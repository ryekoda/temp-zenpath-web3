import { useState, useEffect } from 'react';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Toronto');
// import { useParams } from "react-router-dom";
import { GetTrips } from '../helpers/database/Trips';
import { ParseTime } from '@/lib/format/dates';



export default function useTrips(companyUID, tripUID, employeeUID, clientUID, filterDate, lastDoc, refreshUID, isGranted, dbBaseURL, isLoading, setIsLoading) {
  const [trips, setTrips] = useState([])
//   const urlParams = useParams();



  useEffect(() => {
    if (isGranted) {
      (async () => {
        // const companyUID = urlParams.org
        // const dbBaseURL = dbInfo.url
        
        const tripsData = await GetTrips(tripUID, companyUID, employeeUID, clientUID, filterDate, lastDoc, dbBaseURL).catch((err) => console.log('trips error: ', err)); 
        // setTrips(lastDoc ? [...oldTrips, ...tripsData] : tripsData);

        // temp
        if (filterDate && tripsData) {
          const theFilterDate = new Date(filterDate)

          // Pickup times as Dates on the viewed day (bare times like '14:30' are stored without a date).
          // Missing or unreadable times become null, never an Invalid Date. Older trips used `pickupTime`.
          tripsData.forEach(trip => {
            trip['97264'] = ParseTime(trip['97264'] || trip.pickupTime, theFilterDate)
          });
        }
        // end

        setTrips(tripsData)
        if (typeof isLoading === 'boolean') setIsLoading(false)
      })();  
    }

  }, [ tripUID, employeeUID, clientUID, filterDate, lastDoc, refreshUID ]);


  return trips
}