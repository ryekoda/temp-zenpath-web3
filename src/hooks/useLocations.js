import { useState, useEffect } from 'react';
import { db } from '@/config/firebase/Firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";



export function useLocations(userUIDs, orgUID, refreshUID) {
  const [locations, setLocations] = useState()


  useEffect(() => {
    var locs = []


    const locationsRef = collection(db, "locations");
    userUIDs.map((userUID) => {
        const q = query(collection(db, "locations"), where('orgUID', '==', orgUID), where('userUID', '==', userUID), orderBy("createdAt", "desc"), limit(1));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                const newLocation = {
                    id: doc.id,
                    ...doc.data(),
                    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
                }

                locs.push(newLocation)
            })

            setLocations(locs)
        })

        return () => {
            unsubscribe()
        }
    });
  }, [ JSON.stringify(userUIDs), db ]);

  return locations
}
