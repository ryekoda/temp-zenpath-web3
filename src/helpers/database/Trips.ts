import axios from 'axios';



export async function SaveTrip(companyUID: any, fields: any, baseURL: any) {
    const url = baseURL + '/api/trips'

    const doc = await axios.post(url, {
        'companyUID': companyUID,
        'fields': fields
    })

    const data = doc['data'].tripUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function UpdateTrip(tripUID: any, companyUID: any, fields: any, baseURL: any) {
    const url = baseURL + '/api/trips'

    const doc = await axios.put(url, {
        'tripUID': tripUID,
        'companyUID': companyUID,
        'fields': fields
    })

    const data = doc['data'].trip
    if (data) {
        return data
    } else {
        return
    }
}


export async function GetTrips(tripUID: any, companyUID: any, employeeUID: any, clientUID: any, filterDate: any, lastDoc: any, baseURL: any) {
    const url = baseURL + '/api/trips'


    const doc = await axios.get(url, {
        params: {
            'tripUID': tripUID, 
            'companyUID': companyUID, 
            'employeeUID': employeeUID, 
            'clientUID': clientUID, 
            'filterDate': filterDate, 
            'lastDoc': lastDoc
        }
    })

    const data = doc['data'].trips

    if (data) {        
        return data
    } else {
        return
    }
}


export async function DeleteTrip(tripUID: string, baseURL: string) {
    const url = baseURL + '/api/trips'


    const doc = await axios.delete(url, {
        params: {
            'tripUID': tripUID
        }
    })

    return
}