import axios from 'axios';



export async function SaveNotification(boardUID: string, recipEmail: string, senderUID: string, type: string, baseURL: string) {
    const url = baseURL + '/api/notifications'


    const doc = await axios.post(url, {
        'boardUID': boardUID,
        'recipEmail': recipEmail,
        'senderUID': senderUID,
        'type': type
    })

    const data = doc['data'].notificationUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function UpdateNotification(uid: string, keyValues: any[], baseURL: string) {
    const url = baseURL + '/api/notifications'


    const doc = await axios.put(url, {
        'uid': uid,
        'keyValues': keyValues
    })

    const data = doc['data'].notificationUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function GetNotifications(email: string, type: string, companyUID: string, isPublic: boolean, baseURL: string) {
    const url = baseURL + '/api/notifications'


    const doc = await axios.get(url, {
        params: {
            'email': email,
            'type': type,
            'companyUID': companyUID,
            'isPublic': isPublic
        }
    })

    const data = doc['data'].notifications
    
    if (data) {
        return data
    } else {
        return
    }
}