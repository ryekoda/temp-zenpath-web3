import axios from 'axios';



export async function SaveActivity(type, userUID, boardUID, tripUID, info, desc, baseURL) {
    const url = baseURL + '/api/activity'
    // const url = 'http://localhost:3002' + '/activity'

    const doc = await axios.post(url, {
        'type': type, 
        'userUID': userUID, 
        'boardUID': boardUID, 
        'tripUID': tripUID,
        'info': info,
        'desc': desc
    })

    const data = doc['data'].activityUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function UpdateActivity(id, type, boardUID, info, desc, baseURL) {
    const url = baseURL + '/api/activity'
    // const url = 'http://localhost:3002' + '/activity'

    const doc = await axios.put(url, {
        'id': id,
        'type': type, 
        'boardUID': boardUID, 
        'info': info,
        'desc': desc
    })

    const data = doc['data'].activity
    if (data) {
        return data
    } else {
        return
    }
}


export async function GetActivity(type, uids, userUID, companyUID, tripUIDs, info, lastDoc, baseURL) {
    const url = baseURL + '/api/activity'
    // const url = 'http://localhost:3002' + '/activity'
    
    const doc = await axios.get(url, {
        params: {
            'type': type,
            'uids': uids,
            'userUID': userUID,
            'companyUID': companyUID,
            'tripUIDs': tripUIDs,
            'info': info,
            'lastDoc': lastDoc
        }
    })

    const data = doc['data'].activity
   
    if (data) {
        return data
    } else {
        return
    }
}