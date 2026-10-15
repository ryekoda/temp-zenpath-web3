import { useState, useEffect } from 'react';
import { GetTaggedIndex } from '@/helpers/database/TaggedIndex';



// Most matches one search shows (the API's maximum)
export const CLIENT_SEARCH_LIMIT = 50

// Clients whose name or phone number starts with `query`, looked up on the server so clients that
// haven't been loaded into the list are found too. Waits for a pause in typing before searching.
export default function useClientSearch(query, companyUID, refreshUID, dbURL) {
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const searchText = query.trim()



  useEffect(() => {
    if (!searchText) {
      setResults([])
      setIsSearching(false)
      return
    }

    let isCancelled = false
    setIsSearching(true)

    const timer = setTimeout(async () => {
      const items = await GetTaggedIndex('clients', searchText, companyUID, dbURL, CLIENT_SEARCH_LIMIT).catch((err) => console.log('client search error: ', err));

      if (isCancelled) return
      setResults(items || [])
      setIsSearching(false)
    }, 300)

    return () => {
      isCancelled = true
      clearTimeout(timer)
    }
  }, [ searchText, companyUID, refreshUID ]);


  return { results, isSearching }
}
