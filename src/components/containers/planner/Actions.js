import { v1 } from "uuid";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
// import { DeleteTrip, UpdateTableHeader, UpdateTableHeaderOptions, SearchItems } from '../../hooks/Firebase';
import { SaveClient } from '@/helpers/database/Clients';
import { SaveTrip, UpdateTrip } from '@/helpers/database/Trips';
import { SaveActivity, UpdateActivity, GetActivity } from '@/helpers/database/Activity';
import { Analytics_Fir } from '@/hooks/Analytics';
import { SubscriptionStatus, toDate } from '@/lib/GlobalFunctions';
import { UTCTimeToLocalTime } from '@/lib/Utils';



export function FormData(name, data, companySettings) {
  var info = {
    trip: []
  }
  // console.log('BNNNN: ', data);
  if (companySettings) {
    for (let i = 0; i < companySettings.headers.length; i++) {
      const header = companySettings.headers[i]

      var value2 = data ? data[header.uid] : ''

      if (name === 'edit') {
        if (!value2) {
          if (i === 0) {
            value2 = data.riderUID
          } else if (i === 1) {
            value2 = data.type
          } else if (i === 3) {
            value2 = data.pickupTime
          } else if (i === 4) {
            value2 = data.destination
          } else if (i === 5) {
            value2 = data.pickupDate.toDate()
          } else if (i === 6) {
            value2 = data.driverUID
          }
        } else {
          if (header.type === 'date') {
            // dayjs.extend(utc)
            // dayjs.extend(timezone)
            // const ttt = dayjs(data[header.uid]).add(4, 'hour').utc().toDate()
            // const ttt = dayjs(data[header.uid]).toDate()
            const utc = new Date(data[header.uid]);
            const local = UTCTimeToLocalTime(utc)
            value2 = local
            // value2 = ttt
            // value2 = new Date(data[header.uid])
          }
        }
      }
  
      
      var item = { title: header.title, name: header.uid, type: header.type, value: value2, options: header.options, frameType: header.type, isRequired: false }

      if (name === 'create' && (header.uid === '71130' || header.uid === '16538')) {
        item['isRequired'] = true
      }

      if (item.name !== '38543') {
        info.trip.push(item)
      }
    }
  
    if (data && data['61972']) {
      const signature = { title: 'signature', name: 'signature', type: 'image', value: data['61972'], frameType: 'signature', isRequired: false }
      info.trip.push(signature)
    }

    const comments = { title: 'comments', name: 'comments', type: 'longText', value: data ? data.comments : '', frameType: 'longText', isRequired: false }
    info.trip.push(comments)

    const collectionUID = { title: '', name: 'collectionUID', type: '', value: data && data['collectionUID'] ? data.collectionUID : '', frameType: '', isRequired: false }
    info.trip.push(collectionUID)
    const id = { title: '', name: 'uid', type: '', value: data ? data.id : '', frameType: '', isRequired: false }
    info.trip.push(id)
  }

  return info
}


async function SaveTripStatus(userUID, boardUID, tripUID, info, desc, activityUID, dbInfo) {
  const dbBaseURL = dbInfo.url

  if (activityUID) {
      const updatedActivityUID = await UpdateActivity(activityUID, 'changedTripStatus', boardUID, info, desc, dbBaseURL)
      return updatedActivityUID
  } else {
      const activityUID = await SaveActivity('changedTripStatus', userUID, boardUID, tripUID, info, desc, dbBaseURL).catch((err) => console.log('activity3 error: ', err))
      return activityUID
  }
}


export function ActivityFormData(name, data, companySettings, tripUID) {
  var info = {
    activity: {}
  }

  if (data && data.length > 0) {
    const currentActivity = GetActivityInfo(data, tripUID)
    info.activity = { activityUID: currentActivity.activityUID, info: currentActivity.info, tripUID: currentActivity.tripUID, type: currentActivity.type, userUID: currentActivity.userUID }
  }

  return info
}

export function GetActivityInfo(activity, tripUID) {
  let currentShift = { tripUID: null, lastCompletedTask: null, status: null, info: { value: '' } }

  if (activity.length > 0) {
    // let tripActivity = activity.filter(obj => { return obj.type === 'changedTripStatus' })
    let tripActivity = activity.filter(obj => { return (obj.type === 'changedTripStatus' && obj.tripUID === tripUID) })

    if (tripActivity.length > 0) {
      let latest_TaskActivity = tripActivity.reduce((max, currentActivity) => max.lastModifiedAt > currentActivity.lastModifiedAt ? max : currentActivity);
      currentShift.activityUID = latest_TaskActivity.id
      currentShift.tripUID = latest_TaskActivity.tripUID
      currentShift.info = latest_TaskActivity.info
      currentShift.type = latest_TaskActivity.type
      currentShift.userUID = latest_TaskActivity.userUID
    }
  }

  return currentShift
}


export function GetDemensions(type, customWidth, customHeight) {
  const demensions = {
    create: { width: '780px', height: '1100px', title: 'create trip' },
    edit: { width: '580px', height: '1100px', title: 'trip' },
    custom: { width: customWidth, height: customHeight, title: '' }
  }

  return demensions[type] ? demensions[type] : demensions.custom
}


export function GetAdressCoordinates(tripType, selectedTrip) {
    let destination = { address: '', coordinates: { lat: '', lng: '' } }

    if (tripType === 'pickup') {
        if (selectedTrip.data['67300']) {
            // console.log('dyHome');
            destination = { address: selectedTrip.data['67300'].address, coordinates: { lat: selectedTrip.data['67300'].latLng.lat, lng: selectedTrip.data['67300'].latLng.lng } }
        } else {
            if (selectedTrip.client['59737']) {
                destination = { address: selectedTrip.client['59737'].address, coordinates: { lat: selectedTrip.client['59737'].latLng.lat, lng: selectedTrip.client['59737'].latLng.lng } }
            } else {
                destination['address'] = selectedTrip.client.address
            }
        }
    } else if (tripType === 'dropoff') {
        destination = { address: selectedTrip.data['32168'].address, coordinates: { lat: selectedTrip.data['32168'].latLng.lat, lng: selectedTrip.data['32168'].latLng.lng } }
    }

    return destination
}


export function GetMapInitCoordinates(location, defaultLocation) {
    let coordinates = { lat: defaultLocation.lat, lng: defaultLocation.lng }

    if (location && location.data) {

        if (location.data['67300']) {
            coordinates = { 
                lat: location.data['67300'].latLng.lat,
                lng: location.data['67300'].latLng.lng 
            }
        } else {
            coordinates = { 
                lat: location.client['59737'].latLng.lat,
                lng: location.client['59737'].latLng.lng
            }
        }
    } else if (location && location['32168']) {

        coordinates = {
            lat: location['32168'].latLng.lat,
            lng: location['32168'].latLng.lng
        }
    }

    return coordinates
}


export function GetSortedDrivers(drivers) {
    drivers.sort(function(a, b) {
        var textA = a && a['fName'] ? a.fName.toUpperCase() : '';
        var textB = b && b['fName'] ? b.fName.toUpperCase() : '';
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    return drivers
}


export function ShowModal(name, setModalType, setIsToolTipOpen) {
  setModalType(name)
  setIsToolTipOpen(false)
    // if (isOpen) {
    //   setModalType(name)
    //   setIsShowingModel(true)
    //   setIsToolTipOpen(false)
    // } else {
    //   setIsShowingModel(false)
    // }
}


export function DateDidChange(newDate, setFilterDate, setFilteredTrips, reloadData) {
  setFilterDate(newDate)
  setFilteredTrips([])
  reloadData()
}


export function Reload(setRefreshUID, setSelectedTable, setSelectedDriverUID, setFilteredTrips) {
    const uid = v1()
    setRefreshUID(uid)

    if (setSelectedTable) {
        setSelectedTable('pendingRiders_Table')
        setSelectedDriverUID(null)
        setFilteredTrips([])
    }
}


export async function Save(item, setIsSubmitButtonDisabled, modalName, setModalName, company, trips, companyUID, setIsShowingModal, handleModalClose, reloadData, fields, autoCompleteData, activityField, dbURL) {
  setIsSubmitButtonDisabled(true)

  const dbBaseURL = dbURL
  const tripUID = modalName  === 'create' ? null : item.uid

  const isPaidSubscription = (SubscriptionStatus(company).isSubscriptionActive || SubscriptionStatus(company).isInGracePeriod) ? true : false
  const monthlyTrips = trips['monthlyTrips'] ? trips['monthlyTrips'].length : 0
  let saveAuthorized = false
  
  if (isPaidSubscription) {
    saveAuthorized = true
  } else {
    if (monthlyTrips >= 50) {
      // Show pricing
      setIsShowingModal(true)
      setModalName('pricing')
    } else {
      saveAuthorized = true
    }
  }

  if (saveAuthorized) {
    let clientUID = ''

    const newFields = item.data2[0]
    if (newFields[0]) {
      const value = newFields[0].value
      const isClientFound = autoCompleteData.some(el => el.id === value)

      if (!isClientFound) {
        const name = value.split(" ")
        const fName = name[0]
        const lName = name.length > 1 ? name[name.length - 1] : ''
        const fullName = { 'fName': fName, 'lName': lName }
  
        if (fullName.fName) {
          const clientItem = { data: [ {title: 'first name', name: 'fName', type: 'text', value: fullName.fName, required: true }, { title: 'last name', name: 'lName', type: 'text', value: fullName.lName, required: true }] }
          clientUID = await SaveClient(companyUID, clientItem.data, dbBaseURL).catch((err) => console.log('client error: ', err))
        }
      }
    }

    // here
    let tripData = item.data

    // testing
    let tripData2 = item.data2
    const collectionUID = v1()
    for (let i = 0; i < tripData2.length; i++) {
      const d = tripData2[i]
      const cliName = tripData2[0][0]
      const triType = tripData2[0][1]

      if (d[0].name !== "71130") {
        d.splice(0, 0, cliName);
      }

      if (d[1].name !== "95242") {
        d.splice(1, 0, triType);
      }

      // pkup addy
      if (d[2].name !== "67300") {
        let pAddy = tripData2[i - 1][4]
        if (pAddy.name === '32168') {
          pAddy.name = "67300"
          pAddy.title = "Pickup Address"
          d.splice(2, 0, pAddy);
        }
      }

      // time
      const timeIndex = d.findIndex((obj => obj.name == '97264'))
      if (!d[timeIndex].value) {
        d[timeIndex].value = dayjs(new Date()).toDate()
      }

      const dateIndex = d.findIndex((obj => obj.name == '16538'))
      if (!d[dateIndex].value) {
        d[dateIndex].value = dayjs(new Date()).toDate()
      }

      if (clientUID) {
        const tripIndex = d.findIndex((obj => obj.name == '71130'));
        d[tripIndex].value = clientUID
      }

      const collectionUIDIndex = d.findIndex((obj => obj.name == 'collectionUID'));
      d[collectionUIDIndex].value = collectionUID

      //tripUID
      let tripUID2 = ''
      const tripUIDIndex = d.findIndex((obj => obj.name == 'uid'));
      tripUID2 = d[tripUIDIndex].value
      d.splice(tripUIDIndex, 1);

      if (tripUID2) {
        // update
        // console.log('VVVVV: ', d);
        await UpdateTrip(tripUID2, companyUID, d, dbBaseURL).catch((err) => console.log('trip update error: ', err))
      } else {
        // save
        await SaveTrip(companyUID, d, dbBaseURL).catch((err) => console.log('trip error: ', err))
      }
    }
    //

    if (activityField) {
      // await SaveTripStatus(activityField.userUID, companyUID, activityField.tripUID, activityField['info'] && activityField['info'].value ? activityField['info'].value : '', null, activityField.activityUID, dbInfo)
    }

    // Analytics_Fir().create_trip()
    setIsShowingModal(false)
    reloadData()

    setIsSubmitButtonDisabled(false)
  } else {
    setIsSubmitButtonDisabled(false)
  }
}


export async function Delete(itemUID, dbURL) {
  await DeleteTrip(itemUID, dbURL).catch((err) => console.log('delete trip error: ', err)); 
}


  export function PageHeaderOptionPressed(name, companySettings, header, setModalType, setIsShowingModel, setRefreshUID) {
    if (name === 'inviteMembers') {
      setModalType('invite_Member')
      setIsShowingModel(true)
    } else if (name === 'feedback') {
      setModalType('feedback')
      setIsShowingModel(true)
    } else {
      if (companySettings) {
        const headerUID = header.uid
        const headerTitle = header.title
        const headerIsHidden = header.isHidden
  
        // UpdateTableHeader(headerUID, headerTitle, headerIsHidden, companySettings, function() {
        //   Reload(setRefreshUID)
        // })
      }
    }
  }

export function DismissModal(setIsShowingModel) {
  setIsShowingModel(false)
}


export function DriverItemPressed(name, driverUID, trips, setSelectedTable, setSelectedDriverUID, setFilteredTrips) {
    const assignedTrips = trips

    if (assignedTrips.length > 0) {
      var newTrips = []

      for (let i = 0; i < assignedTrips.length; i++) {
        let newTrip = assignedTrips[i]

        if (newTrip.driverUID === driverUID) {
          newTrips.push(newTrip)
        }

        if (newTrip['46783'] === driverUID) {
          newTrips.push(newTrip)
        }

        if (i === assignedTrips.length - 1) {
          setSelectedTable(name)
          setSelectedDriverUID(driverUID)
          setFilteredTrips(newTrips)
        }
      }
    } else {
      setSelectedTable(name)
      setSelectedDriverUID(driverUID)
    }
}

export function OpenModal(info, setIsShowingModel, setModalType, setSelectedTripInfo, setRefreshUID, setIsToolTipOpen) {
    if (info) {
        setModalType('edit_Trip')
        setSelectedTripInfo(info)
        // Reload(setRefreshUID)
    } else {
        setModalType('create_Trip')
        setSelectedTripInfo(null)
    }

    setIsShowingModel(true)
    setIsToolTipOpen(false)
}

// index, sectionIndex, popperTrigger, allPopperTriggers, selectedData, setSelectedData, rawSelectedData, isToolTipOpen, setIsToolTipOpen, querySelectorUID, selectedHeader, setSelectedItem, OpenModal, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setCurrentTooltip
export function ItemPressed2(name, data, setModalName, setIsShowingModal, setSelectedTripInfo, setRefreshUID, setIsToolTipOpen) {
  setSelectedTripInfo(null)
  setModalName(name)
  setIsShowingModal(true)
  setIsToolTipOpen(false)

  if (name === 'create') {
    
  } else if (name === 'edit') {
    const { info, selectedHeader, item } = data
    setSelectedTripInfo(item)
    // const { data, index, sectionIndex, item, querySelectorUID, selectedHeader } = data

    if (selectedHeader === 'linkAccount') {
      // setSelectedData(selectedData)
    } else {
      if (selectedHeader.type === 'dropDown') {
        if (selectedHeader.uid === '71130' || selectedHeader.uid === '95242' || selectedHeader.uid === '46783' || selectedHeader.uid === '38543') {

          // setSelectedTripInfo(item)
          // OpenModal(rawSelectedData, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setIsToolTipOpen)
        } else {
          // setSelectedData(selectedData)
        }
      } else {
        // Open edit modal
        // OpenModal(rawSelectedData, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setIsToolTipOpen)
      }
    }
  } else {
    // setModalName('create')
  }


  // if (data) {
  //     setModalType('edit_Trip')
  //     setSelectedTripInfo(data)
  //     // Reload(setRefreshUID)
  // } else {
  //     setModalType('create_Trip')
  //     setSelectedTripInfo(null)
  // }

  // setIsShowingModel(true)


}

export function VerifyDriverTrips(driverUID, trips) {
    const assignedTrips = trips.asTrips

    if (assignedTrips.length > 0) {

      for (let i = 0; i < assignedTrips.length; i++) {
        let newTrip = assignedTrips[i]

        if (newTrip.driverUID === driverUID) {
          return true
        }

        if (newTrip['46783'] === driverUID) {
          return true
        }

        if (i === assignedTrips.length - 1) {
          return false
        }
      }
    } else {
      return false
    }
  }

  // export function ListColumnTapped(name, value, companySettings, setIsToolTipOpen, reload) {
  //   let headers = companySettings.headers
  //   var rand = Math.floor(10000 + Math.random() * 90000);
  //   let newHeader = { title: value, isHidden: false, uid: rand, type: value, indexPosition:  headers.length }
  
  //   headers.push(newHeader)
  
  //   UpdateTableHeaderOptions(headers, companySettings, function() {
  //     reload()
  //   })
  // }

  export function ListColumnTapped(name, type, data, companySettings, setIsToolTipOpen, reload) {
    if (name === 'headerOptions') {
      if (type === 'delete') {
        let headers = companySettings.headers
        // let newIndex = 0
        for (let i = 0; i < headers.length; i++) {
          const header = headers[i]
  
          if (header.uid === data) {
            headers.splice(i, 1)
          }
        }
  
        for (let i = 0; i < headers.length; i++) {
          const header = headers[i]
          header.indexPosition = header.indexPosition === i ? header.indexPosition : header.indexPosition === i - 1 ? i - 1 : i
        }
        
        // UpdateTableHeaderOptions(headers, companySettings, function() {
        //   setIsToolTipOpen(false)
        //   reload()
        // })
      }
    } else if (name === 'addColumn') {
      if (type === 'text') {
        let headers = companySettings.headers
        var rand = Math.floor(10000 + Math.random() * 90000);
        let newHeader = { title: type, isHidden: false, uid: rand, type: type, indexPosition:  headers.length }
      
      
        headers.push(newHeader)
        // UpdateTableHeaderOptions(headers, companySettings, function() {
        //   setIsToolTipOpen(false)
        //   reload()
        // })
      }
    }
}

export function ErrorMessage(errorCode) {
  var info = { message: '' }

  switch(errorCode) {
    case 1:
      info['message'] = 'Please enter a valid email address'
      break;
    case 3:
      info['message'] = 'Password is incorrect. Please enter correct password'
      break;
    case 4:
      info['message'] = 'Password is incorrect. Please try again'
      break;
    case 5:
      info['message'] = 'No user found with this email in our database'
      break;
    case 6:
        info['message'] = 'No user found with this email in our database'
        break;
    default:
      info['message'] = ''
      break;
  }

  return info
}

export function CellPressed(index, sectionIndex, popperTrigger, allPopperTriggers, selectedData, setSelectedData, rawSelectedData, isToolTipOpen, setIsToolTipOpen, querySelectorUID, selectedHeader, setSelectedItem, OpenModal, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setCurrentTooltip) {
  let trigger = null

  if (querySelectorUID) {
    trigger = allPopperTriggers.current[index].current[sectionIndex].querySelector("." + querySelectorUID)
  } else {
    trigger = allPopperTriggers.current[index].current[sectionIndex]
  }

  popperTrigger.current = trigger

  if (selectedHeader === 'linkAccount') {
    setIsToolTipOpen(!isToolTipOpen)
    setSelectedData(selectedData)
  } else {
    if (selectedHeader.type === 'dropDown') {
      if (selectedHeader.uid === '71130' || selectedHeader.uid === '95242' || selectedHeader.uid === '46783' || selectedHeader.uid === '38543') {
        OpenModal(rawSelectedData, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setIsToolTipOpen)
      } else {
        setIsToolTipOpen(!isToolTipOpen)
        setSelectedData(selectedData)
      }
    } else {
      // Open edit modal
      OpenModal(rawSelectedData, setIsShowingModel, setModalType, setSelectedEmployeeInfo, setRefreshUID, setIsToolTipOpen)
    }
  }

  setCurrentTooltip('list')
  setSelectedItem({ header: selectedHeader, data: selectedData })
}

export async function InputChanged(target, fields, setFields, setAutoCompleteData, company, setTimer, timer, isToolTipOpen, setIsToolTipOpen, setCurrentTooltip, isTapEvent) {
  const targetName = target.name
  var value = target.value

  setFields(fields.map(field => {
      if (field.name !== targetName) return field
      return {...field, value: value ? value : ''}
  }))

  // autocomplete
  if (targetName === '71130') {
    if (isTapEvent) {
      setIsToolTipOpen(false)
    } else {
      OpenAutocompleteDropDown(targetName, value, setAutoCompleteData, company, setTimer, timer, isToolTipOpen, setIsToolTipOpen, setCurrentTooltip)
    }
  }
}

// export async function InputChanged(e, type, name, setValue, allFieldsData, setAllFieldsData, setRefreshUID, setAutoCompleteData, setErrorCode) {
//   setErrorCode(0)

//   if (type === 'date') {
//     const newDate = e

//     setValue(newDate)
//     setAllFieldsData(allFieldsData.map(item => {
//       if (item.name !== name) return item
//       return {...item, value: newDate}
//     }))
//   } else if (type === 'time') {
//     // const newTime = e

//     var newTime = toDate(e,"h:m").getTime()
  
//     setValue(newTime)
//     setAllFieldsData(allFieldsData.map(item => {
//       if (item.name !== name) return item
//       return {...item, value: newTime}
//     }))
//   } else if (type === 'address') {
//     const newAddress = e

//     const results = await geocodeByAddress(newAddress)
//     const latLng = await getLatLng(results[0])
//     setValue(newAddress)

//     const address = { address: newAddress, latLng: latLng }
//     setAllFieldsData(allFieldsData.map(item => {
//       if (item.name !== name) return item
//       return {...item, value: address}
//     }))
//   } else {
//     e.stopPropagation();

//     const target = e.target
//     if (target.name === 'phone' || target.name === '23800' || target.name === '72260' || target.name === 'compSize') {
//       let isNumb = /^\d+$/.test(target.value);

//       if (isNumb || target.value === '') { setValue(target.value) }
//     } else {
//       setValue(target.value ? target.value : '')
//     }

//     if (allFieldsData) {
//       setAllFieldsData(allFieldsData.map(item => {
//         if (item.name !== name) return item
//         return {...item, value: target.value ? target.value : ''}
//       }))
//     } else {
//       setAllFieldsData(target.value ? target.value : '')
//     }

//     if (target.name === '71130') {

//       startAutocomplete(target.name, target.value, setAutoCompleteData)
//     }


//     // reloadData(setRefreshUID)
//   }
// }

function OpenAutocompleteDropDown(name, value, setAutoCompleteData, company, setTimer, timer, isToolTipOpen, setIsToolTipOpen, setCurrentTooltip) {
  clearTimeout(timer)

  const newTimer = setTimeout(() => {

    if (name === '71130') {
      setAutoCompleteData([])

      // searchItems(company.id, 'clients', value, function(items) {
  
      //   if (!value) {
      //     setIsToolTipOpen(false)
      //   } else {
   
      //     if (!isToolTipOpen) {
      //       if (items && items.length > 0) {

      //         setIsToolTipOpen(true)
      //         setCurrentTooltip('form')
      //         // setCurrentTooltip('modal_AutocompleteInput')
      //       }
      //     } 
      //   }

      //   setAutoCompleteData(items)
      // })
    }
  }, 300)

  setTimer(newTimer)
}

export function searchItems(boardUID, category, value, callback) {
  if (value) {

    // SearchItems(boardUID, category, value, function(items, error) {
    //   callback(items)
    // })
  } else {
    callback([])
  }
}


export function LoadMoreItems(items, setLastDoc, setRefreshUID) {
  setLastDoc(items[items.length - 1].lastDoc)
  Reload(setRefreshUID)
}