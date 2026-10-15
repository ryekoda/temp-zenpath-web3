import { useState, useEffect } from 'react';
import { GetActivity } from '@/helpers/database/Activity';



export function useActivity(companyUID, tripUIDs, uids, userUID, lastDoc, refreshUID, isGranted, dbURL, isLoading, setIsLoading) {
    const [activity, setActivity] = useState([])


    useEffect(() => {
        if (isGranted) {
          (async () => {            
            const activityData = await GetActivity(null, uids, userUID, companyUID, tripUIDs, null, lastDoc, dbURL).catch((err) => console.log('activity error: ', err)); 
            
            if (activityData) {
                setActivity(lastDoc ? oldActivity => [...oldActivity, ...activityData] : activityData);
            }
            
            if (typeof isLoading === 'boolean') setIsLoading(false)
          })();  
        }
      // }, [ uids && uids.length, refreshUID ]);
    }, [ JSON.stringify(uids), JSON.stringify(tripUIDs), refreshUID ]);


    return activity
}
