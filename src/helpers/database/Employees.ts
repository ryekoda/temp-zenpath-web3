import axios from 'axios';



export async function SaveEmployee(item: any, companyUID: string, baseURL: string) {
    const url = baseURL + '/api/employees'


    const doc = await axios.post(url, {
        'item': item,
        'companyUID': companyUID
    })

    const data = doc['data'].employeeUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function UpdateEmployee(uid: string, baseURL: string, key?: any, value?: any, item?: any) {
    const url = baseURL + '/api/employees'


    const doc = await axios.put(url, {
        'uid': uid,
        'key': key, 
        'value': value,
        'item': item
    })

    const data = doc['data'].employeeUID
    if (data) {
        return data
    } else {
        return
    }
}


export async function GetEmployees(companyUID: string, baseURL: string, lastDoc?: any, userUID?: any) {
    const url = baseURL + '/api/employees'


    const doc = await axios.get(url, {
        params: {
            'companyUID': companyUID,
            'userUID': userUID,
            'lastDoc': lastDoc
        }
    })

    const data = doc['data'].employees
    
    if (data) {
        return data
    } else {
        return
    }
}


export async function DeleteEmployee(itemUID: string, baseURL: string) {
    const url = baseURL + '/api/employees'


    const doc = await axios.delete(url, {
        params: {
            'uid': itemUID
        }
    })

    return
}