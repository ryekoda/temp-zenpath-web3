import { useState, useEffect, useRef } from 'react';
import { GetClientsPage } from '@/helpers/database/Clients';



// The clients page's list: loads the first page, then appends the next one each time loadMore is called.
// Starts over from the first page whenever refreshUID changes.
export default function useClientPages(companyUID, refreshUID, dbURL, isLoading, setIsLoading) {
  const [clients, setClients] = useState([])
  // Where the next page starts; null once the last page has loaded
  const [cursor, setCursor] = useState(null)
  const isFetchingMore = useRef(false)



  useEffect(() => {
    let isCancelled = false

    ;(async () => {
      const page = await GetClientsPage([], companyUID, null, false, dbURL).catch((err) => console.log('clients error: ', err));

      if (isCancelled) return
      if (page) {
        setClients(page.clients)
        setCursor(page.lastDoc)
      }
      if (typeof isLoading === 'boolean') setIsLoading(false)
    })();

    return () => { isCancelled = true }
  }, [ companyUID, refreshUID ]);


  async function loadMore() {
    if (!cursor || isFetchingMore.current) return
    isFetchingMore.current = true

    const page = await GetClientsPage([], companyUID, cursor, false, dbURL).catch((err) => console.log('clients error: ', err));

    if (page) {
      setClients(oldClients => [...oldClients, ...page.clients])
      setCursor(page.lastDoc)
    }
    isFetchingMore.current = false
  }


  return { clients, loadMore, hasMore: Boolean(cursor) }
}
