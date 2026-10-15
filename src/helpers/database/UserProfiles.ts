import axios from 'axios';
import { log } from 'console';



export async function SaveUser(authUID: string, email: string, fName: string, lName: string, baseURL: string) {
    const url = baseURL + '/api/users'

    const doc = await axios.post(url, {
        'authUID': authUID,
        'email': email,
        'fName': fName.toLowerCase(),
        'lName': lName.toLowerCase()
    })
    
    const data = doc['data'].userUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function UpdateUser(uid: string, key: string, value: string, baseURL: string) {
    const url = baseURL + '/api/users'
    
    const doc = await axios.put(url, {
        'uid': uid, 
        'key': key, 
        'value': value
    })

    const data = doc['data'].user
    if (data) {
        return data
    } else {
        return
    }
}


export async function GetUser(baseURL: string, userUID?: any, authUID?: any, email?: any, lastDoc?: any) {
    const url = baseURL + '/api/users'
    
    const doc = await axios.get(url, {
        params: {
            'uid': userUID, 
            'uids': [],
            'authUID': authUID, 
            'email': email,
            'lastDoc': lastDoc
        }
    })

    const data = doc['data'].user

    if (data) {
        return data
    } else {
        return 
    }
}
