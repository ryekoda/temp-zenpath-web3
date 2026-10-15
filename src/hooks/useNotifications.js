import { useState, useEffect } from 'react';
import { GetCompany } from '@/helpers/database/Companies';
import { db } from '@/config/firebase/Firebase';
import { collection, query, where, onSnapshot } from "firebase/firestore";



export function useNotifications(userInfo, dbURL, refreshUID) {
  const [notifications, setNotifications] = useState()


  useEffect(() => {
    var noti = []
    if (userInfo) {
    const email = userInfo.email.toLowerCase()

    const q = query(collection(db, "notifications"), where("recipEmail", "==", email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
            const boardUID = doc.data().boardUID
            const companyData = await GetCompany(boardUID, dbURL).catch((err) => console.log('company error: ', err)); 

            if (companyData) {
                const boardName = companyData.title
  
                const newNoti = {
                  id: doc.id,
                  lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
                  ...doc.data(),
                  boardTitle: boardName
                }
    
                if (newNoti['isPublic']) {
                  noti.push(newNoti)
                }
    
                if (doc.id === querySnapshot.docs[querySnapshot.docs.length - 1].id) {
                  setNotifications(noti)
                }
            }
        })
    });

    return () => {
        unsubscribe()
    }

  }
  }, [ db ]);

  return notifications
}
