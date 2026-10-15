import { CapitalizeFirstLetterOfEachWord } from '@/lib/format/text';



export function testSample(value, autocompleteData) {
  let item = { }

  if (autocompleteData) {
    for (let i = 0; i < autocompleteData.length; i++) {
      const autocompleteDataItem = autocompleteData[i]

      if (autocompleteDataItem.id === value) {
        item = { value: autocompleteDataItem.id, title: CapitalizeFirstLetterOfEachWord(autocompleteDataItem.fName + ' ' + autocompleteDataItem.lName) }
      }
    }
  }

  return item
}


export function GenerateAutoCompleteValue(value, autocompleteData) {
  let item = { value: '', title: value }

  if (autocompleteData) {
    for (let i = 0; i < autocompleteData.length; i++) {
      const autocompleteDataItem = autocompleteData[i]

      if (autocompleteDataItem.id === value) {
        item = { value: autocompleteDataItem.id, title: CapitalizeFirstLetterOfEachWord(autocompleteDataItem.fName + ' ' + autocompleteDataItem.lName) }
      }
    }
  }

  return item
}


export function ShowAddressAutoComplete(inputName, isHomePickup, clientPreviousTrips, isNewDestination) {
  if (inputName === '67300') {
    if (!isHomePickup) {
      return true
    } else {
      return false
    }
  } else if (inputName === '32168' && isNewDestination) {
    return true
  } else if (clientPreviousTrips.length === 0) {
    return true
  } else {
    return false
  }
}


export function ClientPreviousDestinationAddresses(trips) {
  const addresses = []

  for (let i = 0; i < trips.length; i++) {
    const trip = trips[i]

    if (typeof trip['32168'] === 'object' && trip['32168'] !== null) {
      const destinationAddress = trip['32168']
      const latLng = destinationAddress.latLng

      if (addresses.filter(e => e.latLng.lat === latLng.lat && e.latLng.lng === latLng.lng).length === 0) {
        if (addresses.length < 3) {
          addresses.push(destinationAddress)
        }
      }
    }
  }

  return addresses
}


export function GetPreviousAddressSuggestions(trips) {
  const addresses = []

  for (let i = 0; i < trips.length; i++) {
    const trip = trips[i]

    if (typeof trip['32168'] === 'object' && trip['32168'] !== null) {
      const destinationAddress = trip['32168']
      const latLng = destinationAddress.latLng

      if (addresses.filter(e => e.latLng.lat === latLng.lat && e.latLng.lng === latLng.lng).length === 0) {
        if (addresses.length < 3) {
          addresses.push(destinationAddress)
        }
      }
    }
  }

  return addresses
}
