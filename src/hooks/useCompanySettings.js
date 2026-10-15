import { useState, useEffect } from 'react';
import { GetCompanySettings } from '@/helpers/database/CompanySettings';
// import { firestore, UpdateTableHeader } from '../Firebase.js';
// import { app, auth, db, analytics } from '@/config/firebase/Firebase';



export function useCompanySettings(companyUID, table, refreshUID, isGranted, dbURL) {
  const [companySettings, setCompanySettings] = useState()


  useEffect(() => {

    if (isGranted) {
      (async () => {
        const companySettingsData = await GetCompanySettings(table, companyUID, dbURL).catch((err) => console.log('company settings error: ', err)); 
        
        if (companySettingsData) {
          setCompanySettings(companySettingsData);
          if (typeof isLoading === 'boolean') setIsLoading(false)
        } else {
          // Save new
          console.log('New');
        }
      })();  
    }
  }, [ refreshUID ]);
  

  // useEffect(() => {
  //   var unsubscribe = null

  //   if (isGranted) {
  //     unsubscribe = firestore.collection("tableSettings").where("table", "==", table).where("orgUID", "==", companyUID)
  //       .get()
  //       .then((snapshots) => {
  //         if (snapshots.size > 0) {
  //           const snapshot = snapshots.docs[0]

  //           let newCompanySettings = {
  //             id: snapshot.id,
  //             ...snapshot.data()
  //           }
          
  //           setCompanySettings(newCompanySettings)
  //         } else {
  //           // create...

  //           var defaultHeaders = null
  //           if (table === 'employees') {
  //             defaultHeaders = [
  //               { uid: '34057', title: 'Name', indexPosition: 0, type: 'text', isHidden: false },
  //               { uid: '45566', title: 'Position', indexPosition: 1, type: 'dropDown', options: { dropDown: [{ value: 'driver', title: 'driver' }, { value: 'clerk', title: 'clerk' }, { value: 'mechanic', title: 'mechanic' }] }, isHidden: false },
  //               { uid: '23800', title: 'Phone', indexPosition: 2, type: 'phone', isHidden: false },
  //               { uid: '44853', title: 'Date Hired', indexPosition: 3, type: 'date', isHidden: false }
  //             ]
  //           } else if (table === 'clients') {
  //             defaultHeaders = [
  //               { uid: '10990', title: 'Name', indexPosition: 0, type: 'text', isHidden: false },
  //               { uid: '72260', title: 'Phone', indexPosition: 1, type: 'phone', isHidden: false },
  //               { uid: '59737', title: 'Address', indexPosition: 2, type: 'address', isHidden: false },
  //               { uid: '27966', title: 'DOB', indexPosition: 3, type: 'date', isHidden: false },
  //               { uid: '92085', title: 'Disability', indexPosition: 4, type: 'dropDown', options: { dropDown: [{ value: 'powerchair', title: 'powerchair' }, { value: 'walker', title: 'walker' }, { value: 'wheelchair', title: 'wheelchair' }, { value: 'walking', title: 'walking' }] }, isHidden: false }
  //             ]
  //           } else if (table === 'trips') {
  //             defaultHeaders = [
  //               { uid: '71130', title: 'Client', indexPosition: 0, type: 'dropDown', isHidden: false },
  //               { uid: '95242', title: 'Trip Type', indexPosition: 1, type: 'dropDown', options: { dropDown: [{ value: 'oneway', title: 'one way' }, { value: 'roundtrip', title: 'round trip' }] }, isHidden: false },
  //               { uid: '67300', title: 'Pickup Address', indexPosition: 2, type: 'address', isHidden: false },
  //               { uid: '97264', title: 'Pickup Time', indexPosition: 3, type: 'time', isHidden: false },
  //               { uid: '32168', title: 'Destination', indexPosition: 4, type: 'address', isHidden: false },
  //               { uid: '16538', title: 'Trip Date', indexPosition: 5, type: 'date', isHidden: false },
  //               { uid: '46783', title: 'Driver', indexPosition: 6, type: 'dropDown', isHidden: true },
  //               { uid: '38543', title: 'Progress', indexPosition: 7, type: 'dropDown', options: { dropDown: [{ value: 'pending', title: 'pending' }, { value: 'enroute', title: 'en route' }, { value: 'complete', title: 'complete' }] }, isHidden: false }
  //             ]
  //           } else if (table === 'reports') {
  //             defaultHeaders = [
  //               { uid: '55410', title: 'Name', indexPosition: 0, type: 'ref', options: { ref: [{ value: '71130', type: 'text' }] }, isHidden: false },
  //               { uid: '61895', title: 'Pickup Time', indexPosition: 1, type: 'ref', options: { ref: [{ value: '97264', type: 'time' }] }, isHidden: false },
  //               { uid: '37498', title: 'Pickup Address', indexPosition: 2, type: 'ref', options: { ref: [{ value: '67300', type: 'address' }] }, isHidden: false },
  //               { uid: '70600', title: 'Trip Type', indexPosition: 3, type: 'ref', options: { ref: [{ value: '95242', type: 'dropDown' }] }, isHidden: false },
  //               { uid: '65474', title: 'Phone', indexPosition: 4, type: 'ref', options: { ref: [{ value: '72260', type: 'phone' }] }, isHidden: false },
  //               { uid: '14787', title: 'Destination', indexPosition: 5, type: 'ref', options: { ref: [{ value: '32168', type: 'address' }] }, isHidden: false },
  //               { uid: '75606', title: 'Mileage', indexPosition: 6, type: 'text', isHidden: true },
  //               { uid: '94583', title: 'Signature', indexPosition: 7, type: 'ref', options: { ref: [{ value: '61972', type: 'image' }] }, isHidden: false }
  //             ]
  //           }

  //           firestore.collection("tableSettings").add({
  //             orgUID: companyUID,
  //             table: table,
  //             headers: defaultHeaders,
  //             createdAt: new Date()
  //           })
  //           .then((settings) => {

  //             firestore.collection("tableSettings").doc(settings.id)
  //               .get()
  //               .then((doc) => {
  //                 const newCompanySettings = {
  //                   id: doc.id,
  //                   ...doc.data()
  //                 }

  //                 setCompanySettings(newCompanySettings)
  //               })
  //           })
  //           .catch((error) => {
  //             console.error("Error adding settings document: ", error);
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log('error: ', error.message);
  //       });
  //   }
  // }, [ refreshUID ]);

  return companySettings
}
