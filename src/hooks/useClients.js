import { useState, useEffect } from 'react';
import { GetClients } from '@/helpers/database/Clients';



export default function useClients(companyUID, uids, lastDoc, refreshUID, isGranted, dbURL, isLoading, setIsLoading, includeRecentlyDeleted) {
  const [clients, setClients] = useState([])



  useEffect(() => {
    if (isGranted) {
      (async () => {
        const clientsData = await GetClients(uids, companyUID, lastDoc, includeRecentlyDeleted, dbURL).catch((err) => console.log('clients error: ', err)); 
        
        if (clientsData) {
          setClients(lastDoc ? oldClients => [...oldClients, ...clientsData] : clientsData);
        }
        if (typeof isLoading === 'boolean') setIsLoading(false)
      })();  
    }
  }, [ JSON.stringify(uids), refreshUID, JSON.stringify(lastDoc) ]);


  return clients
}
