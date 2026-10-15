import { useState, useEffect } from 'react';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Toronto');
// import { useParams } from "react-router-dom";
import { GetTrips } from '../helpers/database/Trips';



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
        if (filterDate) {
          const theFilterDate = new Date(filterDate)
          const year = theFilterDate.getFullYear()
          const month = theFilterDate.getMonth() + 1
          const day = theFilterDate.getDate()

          tripsData.map(trip => {
            if (trip['97264'] && trip['97264'].length < 15) {
              const tempTime = trip['97264']
              const updatedDate = dayjs(`${year}-${month}-${day} ${tempTime}`).toDate()
              trip['97264'] = updatedDate
            } else {
              const updatedDate = dayjs(trip['97264']).toDate()
              trip['97264'] = updatedDate
              return trip;
            }
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